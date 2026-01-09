const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
  details?: any;
}

// Helper to get current session token from Supabase
// This function tries multiple methods to get the token
async function getAuthToken(): Promise<string | null> {
  try {
    const { supabase } = await import('../supabase/client');
    
    // Method 1: Get session directly from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      // Try alternative method
      return getTokenFromStorage();
    }
    
    if (session?.access_token) {
      console.log('✅ Token obtenido de getSession()');
      return session.access_token;
    }
    
    // Method 2: Try to get from storage as fallback
    return getTokenFromStorage();
  } catch (error) {
    console.error('Exception getting auth token:', error);
    return getTokenFromStorage();
  }
}

// Fallback: Try to get token from localStorage
function getTokenFromStorage(): string | null {
  try {
    // Supabase stores session in localStorage with a specific key pattern
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return null;
    
    // Extract project ref from URL (e.g., https://xxxxx.supabase.co -> xxxxx)
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
    if (!projectRef) return null;
    
    const storageKey = `sb-${projectRef}-auth-token`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.access_token) {
          console.log('✅ Token obtenido de localStorage');
          return parsed.access_token;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Get auth token from Supabase
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token encontrado, enviando request a:', `${API_URL}${endpoint}`);
  } else {
    console.warn('⚠️ No se encontró token de autenticación - request sin autenticación');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'Request failed',
    }));
    throw error;
  }

  return response.json();
}

