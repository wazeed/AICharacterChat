export const COLORS = {
  // Primary palette - elegant cosmic theme
  primary: "#5A66E8", // Updated to match the login button color
  primaryLight: "#7B85F5",
  primaryDark: "#31429F",
  
  // Secondary palette
  secondary: "#65419D", // Purple from the gradient
  secondaryLight: "#8B6ABE",
  secondaryDark: "#42246E",
  
  // Accent colors
  accent: "#FF6B6B", // Vibrant accent for highlights
  accentLight: "#FF9E9E",
  accentSecondary: "#FFD166", // Secondary accent
  
  // Background colors
  background: "#1F2A68", // Dark blue from the gradient
  backgroundDark: "#1B2065", 
  backgroundLight: "#303E8C",
  cardBackground: "rgba(255, 255, 255, 0.85)", // Semi-transparent like login card
  
  // Text colors
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.75)",
  textDark: "#222222",
  textMuted: "rgba(0, 0, 0, 0.6)",
  
  // Standard colors
  dark: "#121212",
  darkLighter: "#1E1E1E",
  darkCard: "#2A2A2A",
  white: "#FFFFFF",
  lightGray: "#E5E5E5",
  gray: "#9E9E9E",
  darkGray: "#555555",
  black: "#000000",
  transparent: "transparent",
  
  // Status colors
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FFC107",
  info: "#2196F3",
};

export const FONTS = {
  // Font families
  poppins: "Poppins",
  quicksand: "Quicksand", 
  inter: "Inter",

  // Font weights
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,

  // App specific sizes
  cardRadius: 24, // Updated to match login card
  buttonRadius: 16, // Updated to match login buttons
  inputRadius: 16, // Updated to match inputs
  avatarSize: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5, // Increased for more depth
    },
    shadowOpacity: 0.3,
    shadowRadius: 6, // Increased for softer shadow
    elevation: 5,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 10,
  },
  cosmic: { // New shadow style for the starry theme
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  }
}; 

// Common Background gradient settings to use across the app
export const GRADIENTS = {
  main: {
    colors: ['rgba(31, 42, 104, 0.85)', 'rgba(27, 32, 101, 0.9)', 'rgba(65, 41, 90, 0.95)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  card: {
    colors: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  button: {
    colors: ['#5A66E8', '#7B85F5'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  }
};

// Background image URLs to use across the app
export const BACKGROUND_IMAGES = {
  main: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
  secondary: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80',
  alternate: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1771&q=80'
}; 