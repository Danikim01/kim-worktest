import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

interface AuthState {
  user: User | null;
  session: Session;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; isAdmin: boolean }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  checkAdminEmail: (email: string) => boolean;
}

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,
  isAdmin: false,

  checkAdminEmail: (email: string) => {
    if (!ADMIN_EMAIL) {
      console.error('ADMIN_EMAIL not configured in .env');
      return false;
    }

    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  },

  initialize: async () => {
    try {
      set({ loading: true });

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      const user = session?.user ?? null;
      const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

      set({
        user,
        session: session,
        isAdmin,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();
        set({
          user,
          session: session,
          isAdmin,
        });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false, initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });

      // First verify that the email matches ADMIN_EMAIL from .env
      const isValidAdminEmail = get().checkAdminEmail(email);

      if (!isValidAdminEmail) {
        set({ loading: false });
        return { 
          error: { message: 'Solo usuarios administradores pueden acceder al backoffice' },
          isAdmin: false 
        };
      }

      // If email matches, sign in with Supabase (normal login like web app)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error, isAdmin: false };
      }

      // Verify the user email matches admin email (double check)
      const isAdmin = data.user?.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase();

      if (!isAdmin) {
        // This shouldn't happen, but just in case
        await supabase.auth.signOut();
        set({ loading: false });
        return { 
          error: { message: 'Usuario no autorizado para acceder al backoffice' },
          isAdmin: false 
        };
      }

      set({
        user: data.user,
        session: data.session,
        isAdmin,
        loading: false,
      });

      return { error: null, isAdmin };
    } catch (error: any) {
      set({ loading: false });
      return { error, isAdmin: false };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAdmin: false,
        loading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ loading: false });
    }
  },
}));

