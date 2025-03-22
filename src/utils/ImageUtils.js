/**
 * Image utility functions to avoid errors with missing assets
 */

// This object stores require statements for all image assets
const imageAssets = {
  // UI elements
  'cid-example': require('../assets/images/placeholder-cid-example.png'),
  'logo': require('../assets/images/placeholder-logo.png'),
  
  // Placeholder images with different colors for characters
  'placeholder-1': require('../assets/images/placeholder-1.png'),
  'placeholder-2': require('../assets/images/placeholder-2.png'),
  'placeholder-3': require('../assets/images/placeholder-3.png'), 
  'placeholder-4': require('../assets/images/placeholder-4.png'),
};

/**
 * Get an image asset by key with fallback
 * @param {string} key - Key of the image in the assets dictionary
 * @returns {NodeRequire} - The required image
 */
export const getImageSource = (key) => {
  // Return the image if it exists in our asset dictionary
  if (imageAssets[key]) {
    return imageAssets[key];
  }
  
  // Return a color placeholder if key starts with 'character-'
  if (key && key.startsWith('character-')) {
    const id = parseInt(key.split('-')[1], 10) % 4 + 1;
    return imageAssets[`placeholder-${id}`];
  }
  
  // Default fallback
  console.warn(`Image asset not found: ${key}`);
  return imageAssets['placeholder-1'];
};

export default {
  getImageSource,
}; 