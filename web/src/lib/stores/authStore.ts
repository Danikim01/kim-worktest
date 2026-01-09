import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];

interface AuthState {
  user: User | null;
  session: Session;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      set({ loading: true });

      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      set({
        user: session?.user ?? null,
        session: session,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          session: session,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error };
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error };
      }

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        loading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ loading: false });
    }
  },
}));

