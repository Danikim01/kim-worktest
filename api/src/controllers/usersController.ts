import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import container from '../services/container';
import supabaseService from '../services/supabaseService';
import { z } from 'zod';

const dataRepository = container.dataRepository;

const updateUserSchema = z.object({
  nombre: z.string().optional(),
});

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user from Supabase Auth
    const { user: supabaseUser, error: supabaseError } = await supabaseService.getUserById(req.user.id);

    if (supabaseError || !supabaseUser) {
      res.status(404).json({ error: 'User not found in Supabase', details: supabaseError });
      return;
    }

    // Get additional user data from JSON file (favoritos, nombre, etc.)
    let userData = await dataRepository.getUserById(req.user.id);

    // If user doesn't exist in our JSON file, create it with empty data
    if (!userData) {
      const now = new Date().toISOString();
      userData = await dataRepository.createUser({
        id: req.user.id,
        email: req.user.email,
        favoritos: [],
        created_at: now,
        updated_at: now,
      });
    }

    // Combine Supabase user data with local user data
    const response = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      nombre: userData.nombre || supabaseUser.user_metadata?.nombre || null,
      favoritos: userData.favoritos || [],
      created_at: supabaseUser.created_at || userData.created_at,
      updated_at: userData.updated_at,
      // Additional Supabase metadata
      email_confirmed: supabaseUser.email_confirmed_at !== null,
      last_sign_in: supabaseUser.last_sign_in_at,
      metadata: supabaseUser.user_metadata,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const validation = updateUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
      return;
    }

    // Ensure user exists
    let user = await dataRepository.getUserById(req.user.id);
    if (!user) {
      const now = new Date().toISOString();
      user = await dataRepository.createUser({
        id: req.user.id,
        email: req.user.email,
        favoritos: [],
        created_at: now,
        updated_at: now,
      });
    }

    const updatedUser = await dataRepository.updateUser(req.user.id, validation.data);

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const addFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { showId } = req.params;

    // Verify show exists
    const show = await dataRepository.getShowById(showId);
    if (!show) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    // Get or create user
    let user = await dataRepository.getUserById(req.user.id);
    if (!user) {
      const now = new Date().toISOString();
      user = await dataRepository.createUser({
        id: req.user.id,
        email: req.user.email,
        favoritos: [],
        created_at: now,
        updated_at: now,
      });
    }

    // Check if already favorited
    if (user.favoritos.includes(showId)) {
      res.status(400).json({ error: 'Show already in favorites' });
      return;
    }

    // Add to favorites
    const updatedFavorites = [...user.favoritos, showId];
    const updatedUser = await dataRepository.updateUser(req.user.id, {
      favoritos: updatedFavorites,
    });

    if (!updatedUser) {
      res.status(500).json({ error: 'Failed to update favorites' });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { showId } = req.params;

    // Get user
    const user = await dataRepository.getUserById(req.user.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if in favorites
    if (!user.favoritos.includes(showId)) {
      res.status(400).json({ error: 'Show not in favorites' });
      return;
    }

    // Remove from favorites
    const updatedFavorites = user.favoritos.filter(id => id !== showId);
    const updatedUser = await dataRepository.updateUser(req.user.id, {
      favoritos: updatedFavorites,
    });

    if (!updatedUser) {
      res.status(500).json({ error: 'Failed to update favorites' });
      return;
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get all users from Supabase Auth (not from JSON file)
    const client = supabaseService.getAdminClient();
    const { data, error: supabaseError } = await client.auth.admin.listUsers();

    if (supabaseError) {
      console.error('Error fetching users from Supabase:', supabaseError);
      res.status(500).json({ error: 'Failed to fetch users from Supabase', details: supabaseError });
      return;
    }

    // Transform Supabase users to our format
    const users = data.users.map((supabaseUser: any) => ({
      id: supabaseUser.id,
      email: supabaseUser.email,
      nombre: supabaseUser.user_metadata?.nombre || null,
      favoritos: [], // We'll get this from JSON if needed
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
      email_confirmed: supabaseUser.email_confirmed_at !== null,
      last_sign_in: supabaseUser.last_sign_in_at,
    }));

    // Optionally enrich with favorites from JSON file
    const usersWithFavorites = await Promise.all(
      users.map(async (user) => {
        const localUser = await dataRepository.getUserById(user.id);
        if (localUser) {
          return { ...user, favoritos: localUser.favoritos || [] };
        }
        return user;
      })
    );

    res.json(usersWithFavorites);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

