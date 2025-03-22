import React, { createContext, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useAuth } from './AuthContext';

// Define theme colors
const lightTheme = {
  background: '#FFFFFF',
  primary: '#6246EA',
  secondary: '#D1D1E9',
  text: '#2B2C34',
  textSecondary: '#6B6C74',
  accent: '#E45858',
  card: '#F8F8FC',
  border: '#E6E6E6',
  actionButton: '#6246EA',
  actionButtonText: '#FFFFFF',
  headerBackground: '#F8F8FC',
  tabBar: '#FFFFFF',
  tabBarActive: '#6246EA',
  tabBarInactive: '#6B6C74',
  inputBackground: '#F8F8FC',
  chatMessageBg: '#F0F0F8',
  chatMessageText: '#2B2C34',
  chatUserMessageBg: '#D8D5F2',
  chatUserMessageText: '#2B2C34',
  notificationBadge: '#E45858',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#E45858',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  gradientStart: '#7E5AF0',
  gradientEnd: '#6246EA',
};

const darkTheme = {
  background: '#2B2C34',
  primary: '#7E5AF0',
  secondary: '#3A3B47',
  text: '#FFFFFE',
  textSecondary: '#B0B1BB',
  accent: '#FF6B6B',
  card: '#3A3B47',
  border: '#4A4B57',
  actionButton: '#7E5AF0',
  actionButtonText: '#FFFFFF',
  headerBackground: '#3A3B47',
  tabBar: '#2B2C34',
  tabBarActive: '#7E5AF0',
  tabBarInactive: '#B0B1BB',
  inputBackground: '#3A3B47',
  chatMessageBg: '#3A3B47',
  chatMessageText: '#FFFFFE',
  chatUserMessageBg: '#4D3BAA',
  chatUserMessageText: '#FFFFFE',
  notificationBadge: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#FF6B6B',
  shadow: 'rgba(0, 0, 0, 0.2)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  gradientStart: '#7E5AF0',
  gradientEnd: '#6246EA',
};

// Create context
export const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
});

export const ThemeProvider = ({ children }) => {
  const { isDarkTheme } = useAuth();
  const systemColorScheme = useColorScheme();
  
  // Use either the user preference from auth context or system preference
  const currentTheme = isDarkTheme ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        isDark: isDarkTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 