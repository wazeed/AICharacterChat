import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const sizes = {
  // Screen dimensions
  width,
  height,
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    circle: 9999,
  },
  
  // Avatar sizes
  avatar: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
  
  // Button heights
  button: {
    sm: 32,
    md: 44,
    lg: 56,
  },
  
  // Input heights
  input: {
    md: 48,
    lg: 56,
  },
}; 