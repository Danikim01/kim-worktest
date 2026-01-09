import { createClient, SupabaseClient } from '@supabase/supabase-js';

class SupabaseService {
  private supabaseAdmin: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    if (!this.supabaseAdmin) {
      const supabaseUrl = process.env.SUPABASE_URL || '';
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
      }

      // Service role client for server-side operations (has admin privileges)
      this.supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return this.supabaseAdmin;
  }

  async verifyToken(token: string): Promise<{ user: any; error: any }> {
    try {
      const client = this.getClient();
      
      // Use verifyOtp or getUser - getUser should work with JWT tokens
      const { data, error } = await client.auth.getUser(token);
      
      if (error) {
        console.error('Error verifying token:', error.message);
        return { user: null, error };
      }

      if (!data.user) {
        console.error('No user returned from token verification');
        return { user: null, error: { message: 'No user found' } };
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      if (error.message?.includes('Supabase credentials')) {
        throw error;
      }
      console.error('Exception verifying token:', error);
      return { user: null, error: { message: error.message || 'Token verification failed' } };
    }
  }

  async getUserById(userId: string): Promise<{ user: any; error: any }> {
    try {
      const client = this.getClient();
      const { data, error } = await client.auth.admin.getUserById(userId);
      
      if (error) {
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      if (error.message?.includes('Supabase credentials')) {
        throw error;
      }
      return { user: null, error };
    }
  }

  isAdmin(user: any): boolean {
    // Check if user email matches ADMIN_EMAIL from .env
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return false;
    return user?.email?.toLowerCase() === adminEmail.toLowerCase();
  }

  // Expose getClient for use in controllers (public method)
  getAdminClient(): SupabaseClient {
    return this.getClient();
  }
}

export default new SupabaseService();

