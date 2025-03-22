import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

/**
 * A consistent scrollable container that ensures scrollbars are visible
 */
const ScrollableContent = ({ 
  children, 
  contentContainerStyle, 
  style,
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        indicatorStyle={theme.isDark ? 'white' : 'black'}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5, // Adds space for the scrollbar
  },
  content: {
    padding: 15,
  },
});

export default ScrollableContent; 