import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, getCurrentUser, signInWithEmail, signUpWithEmail, signOut } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create auth context
const AuthContext = createContext({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isGuest: false,
  isInitialized: false,
  isDarkTheme: true,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  continueAsGuest: () => {},
  toggleTheme: () => {},
  updateProfile: () => {},
});

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // Check for active session on app load
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setIsLoading(false);
        setIsInitialized(true);
      }
    );

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Load saved user and theme preference from storage on init
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedTheme = await AsyncStorage.getItem('theme');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        if (storedTheme) {
          setIsDarkTheme(storedTheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading stored user or theme:', error);
      }
    };
    
    loadStoredUser();
  }, []);

  // Check if user is logged in
  const checkUser = async () => {
    try {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error.message);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Sign in with email and password
  const handleSignIn = async (email, password) => {
    setIsLoading(true);
    setIsGuest(false);
    const { data, error } = await signInWithEmail(email, password);
    setIsLoading(false);
    
    if (error) return { error };
    return { user: data.user };
  };

  // Sign up with email and password
  const handleSignUp = async (email, password) => {
    setIsLoading(true);
    setIsGuest(false);
    const { data, error } = await signUpWithEmail(email, password);
    setIsLoading(false);
    
    if (error) return { error };
    return { user: data.user };
  };

  // Sign out
  const handleLogout = async () => {
    setIsLoading(true);
    
    if (isGuest) {
      setIsGuest(false);
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return { error: null };
    }
    
    const { error } = await signOut();
    setIsLoading(false);
    
    if (error) return { error };
    return { error: null };
  };
  
  // Continue as guest
  const handleContinueAsGuest = async () => {
    setIsLoading(true);
    
    try {
      // Create guest user
      const guestData = {
        id: 'guest-' + Math.random().toString(36).substr(2, 9),
        email: 'guest@example.com',
        isGuest: true,
      };
      
      // Update state
      setUser(guestData);
      setIsGuest(true);
      
      return { user: guestData, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle theme function
  const handleToggleTheme = async () => {
    try {
      const newTheme = !isDarkTheme;
      setIsDarkTheme(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Update profile function
  const handleUpdateProfile = async (profileData) => {
    if (!user) return { error: 'No user logged in' };
    
    setIsLoading(true);
    
    try {
      // Update user data
      const updatedUser = {
        ...user,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      
      // Save updated user to storage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return { user: updatedUser, error: null };
    } catch (error) {
      return { user, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isGuest,
    isInitialized,
    isDarkTheme,
    signIn: handleSignIn,
    signUp: handleSignUp,
    logout: handleLogout,
    continueAsGuest: handleContinueAsGuest,
    toggleTheme: handleToggleTheme,
    updateProfile: handleUpdateProfile,
  };

  // Return provider with value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 