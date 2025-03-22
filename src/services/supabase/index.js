import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Supabase implementation for development and testing
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'mock-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Mock user for testing
const MOCK_USER = {
  id: 'mock-user-id',
  email: 'test@example.com',
  user_metadata: {
    name: 'Test User',
  },
};

// Authentication functions with mock implementation
export const signInWithEmail = async (email, password) => {
  // For testing, always succeed with mock user
  return { data: { user: MOCK_USER, session: { user: MOCK_USER } }, error: null };
};

export const signUpWithEmail = async (email, password) => {
  // For testing, always succeed with mock user
  return { data: { user: MOCK_USER, session: { user: MOCK_USER } }, error: null };
};

export const signOut = async () => {
  return { error: null };
};

export const getCurrentUser = async () => {
  return { user: MOCK_USER, error: null };
};

// We'll add more Supabase functions as needed for profiles, characters, chats, etc. 