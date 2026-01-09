import { Response } from 'express';
import { AuthenticatedRequest, ShowFilters, CreateShowRequest, UpdateShowRequest } from '../types';
import container from '../services/container';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const dataRepository = container.dataRepository;

const createShowSchema = z.object({
  artista: z.string().min(1),
  venue: z.string().min(1),
  fecha_show: z.string(),
  ciudad: z.string().min(1),
  pais: z.string().min(1),
  capacidad_total: z.number().positive(),
  ticketera: z.string().min(1),
  estado: z.string(),
  category: z.string().nullable().optional(),
});

export const getShows = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let shows = await dataRepository.getAllShows();

    // Apply filters
    const filters: ShowFilters = {
      ciudad: req.query.ciudad as string | undefined,
      fecha: req.query.fecha as string | undefined,
      artista: req.query.artista as string | undefined,
    };

    if (filters.ciudad) {
      shows = shows.filter(show => 
        show.ciudad.toLowerCase().includes(filters.ciudad!.toLowerCase())
      );
    }

    if (filters.fecha) {
      shows = shows.filter(show => {
        const showDate = new Date(show.fecha_show).toISOString().split('T')[0];
        const filterDate = filters.fecha!.split('T')[0];
        return showDate === filterDate;
      });
    }

    if (filters.artista) {
      shows = shows.filter(show => 
        show.artista.toLowerCase().includes(filters.artista!.toLowerCase())
      );
    }

    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shows' });
  }
};

export const getShowById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const show = await dataRepository.getShowById(id);

    if (!show) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    res.json(show);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch show' });
  }
};

export const createShow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validation = createShowSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ error: 'Invalid data', details: validation.error.errors });
      return;
    }

    const data: CreateShowRequest = validation.data;
    const now = new Date().toISOString();

    const newShow = await dataRepository.createShow({
      id: uuidv4(),
      ...data,
      category: data.category ?? null,
      created_at: now,
      updated_at: now,
    });

    res.status(201).json(newShow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create show' });
  }
};

export const updateShow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates: UpdateShowRequest = req.body;

    const updatedShow = await dataRepository.updateShow(id, updates);

    if (!updatedShow) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    res.json(updatedShow);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update show' });
  }
};

export const deleteShow = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await dataRepository.deleteShow(id);

    if (!deleted) {
      res.status(404).json({ error: 'Show not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete show' });
  }
};

