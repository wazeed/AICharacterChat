import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  Animated,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Mock character categories
const CATEGORIES = [
  { id: 'all', name: 'All Characters' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'historical', name: 'Historical' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'literature', name: 'Literature' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'science', name: 'Science' },
];

// Mock characters data
const CHARACTERS = [
  { id: 1, name: 'Gandalf', avatar: null, category: 'fantasy', description: 'A wise wizard with powerful magic and timeless wisdom' },
  { id: 2, name: 'Marie Curie', avatar: null, category: 'historical', description: 'Nobel Prize winner and pioneer in the field of radioactivity' },
  { id: 3, name: 'Captain Picard', avatar: null, category: 'sci-fi', description: 'Starfleet captain known for diplomacy and leadership' },
  { id: 4, name: 'Sherlock Holmes', avatar: null, category: 'literature', description: "The world's greatest detective with exceptional deductive skills" },
  { id: 5, name: 'Socrates', avatar: null, category: 'philosophy', description: 'Ancient Greek philosopher and the founder of Western philosophy' },
  { id: 6, name: 'Albert Einstein', avatar: null, category: 'science', description: 'Theoretical physicist who developed the theory of relativity' },
  { id: 7, name: 'Elizabeth Bennet', avatar: null, category: 'literature', description: 'The spirited and intelligent protagonist from Pride and Prejudice' },
  { id: 8, name: 'Nikola Tesla', avatar: null, category: 'science', description: 'Inventor and electrical engineer who contributed to AC electricity' },
  { id: 9, name: 'Frodo Baggins', avatar: null, category: 'fantasy', description: 'The brave hobbit who carried the One Ring to Mount Doom' },
  { id: 10, name: 'Ada Lovelace', avatar: null, category: 'historical', description: 'Mathematician and writer, known as the first computer programmer' },
  { id: 11, name: 'Data', avatar: null, category: 'sci-fi', description: 'Android officer from Star Trek with a desire to understand humanity' },
  { id: 12, name: 'Aristotle', avatar: null, category: 'philosophy', description: 'Greek philosopher who contributed to logic, ethics, and metaphysics' },
];

// Creates a starry background effect
const StarryBackground = ({ count = 50 }) => {
  const stars = [];
  
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 2 + 1;
    const opacity = useRef(new Animated.Value(Math.random() * 0.6 + 0.2)).current;
    
    useEffect(() => {
      const randomDuration = 1500 + Math.random() * 3000;
      
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: Math.random() * 0.8 + 0.1,
            duration: randomDuration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: Math.random() * 0.4 + 0.1,
            duration: randomDuration,
            useNativeDriver: true,
          }),
        ])
      );
      
      animation.start();
      
      return () => animation.stop();
    }, []);
    
    stars.push(
      <Animated.View
        key={i}
        style={{
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: '#fff',
          borderRadius: size / 2,
          top: Math.random() * height,
          left: Math.random() * width,
          opacity,
        }}
      />
    );
  }
  
  return <View style={{ position: 'absolute', width, height }}>{stars}</View>;
};

// Character Item with animations
const CharacterItem = ({ item, index, onPress, theme }) => {
  // Animation values
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 70, // Staggered animation
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.characterItemContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.characterItem}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.characterGradient}
        >
          <View
            style={[
              styles.characterAvatar,
              { backgroundColor: getCharacterBackgroundColor(item.id, theme) }
            ]}
          >
            <Text style={styles.characterAvatarText}>{item.name.charAt(0)}</Text>
          </View>
          
          <View style={styles.characterContent}>
            <Text style={styles.characterName}>{item.name}</Text>
            <Text style={styles.characterCategory}>{getCategoryName(item.category)}</Text>
            <Text 
              style={styles.characterDescription}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper function to get category name
const getCategoryName = (categoryId) => {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : 'Unknown';
};

// Helper function to get character background color
const getCharacterBackgroundColor = (id, theme) => {
  const colors = [
    theme.primary,
    theme.accent,
    theme.secondary,
    theme.success,
    theme.warning
  ];
  return colors[id % colors.length];
};

const ExploreScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const categoriesOpacity = useRef(new Animated.Value(0)).current;
  const searchBarTranslateX = useRef(new Animated.Value(-20)).current;
  
  useEffect(() => {
    // Start animations
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(searchBarTranslateX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(categoriesOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Filter characters based on selected category and search query
  const filterCharacters = () => {
    let filtered = CHARACTERS;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(character => character.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(character => 
        character.name.toLowerCase().includes(query) || 
        character.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  
  const handleCharacterPress = (character) => {
    // Navigate to character detail screen
    // If the CharacterDetail screen is not fully implemented yet, show an alert
    if (navigation.getState().routeNames.includes('CharacterDetail')) {
      navigation.navigate('CharacterDetail', { character });
    } else {
      startChat(character);
    }
  };
  
  const startChat = (character) => {
    // If CharacterDetail is not available, we can directly navigate to chat
    Alert.alert(
      `Chat with ${character.name}`,
      `Would you like to start a conversation with ${character.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Start Chat',
          onPress: () => {
            navigation.navigate('ChatDetail', { 
              chatId: character.id,
              characterName: character.name
            });
          }
        }
      ]
    );
  };

  const filteredCharacters = filterCharacters();
  
  // Render empty state when no characters match the filter
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <FontAwesome 
        name="search" 
        size={50} 
        color="rgba(255, 255, 255, 0.3)" 
      />
      <Text style={styles.emptyStateTitle}>No characters found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or selecting a different category
      </Text>
      
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('all');
        }}
      >
        <LinearGradient
          colors={[theme.primary, theme.accent]}
          style={styles.resetButtonGradient}
        >
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1539721972319-f0e80a00d424?q=80&w=1700' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <StarryBackground />
        
        <LinearGradient
          colors={[
            'rgba(8, 8, 20, 0.9)',
            'rgba(12, 12, 35, 0.85)',
            'rgba(16, 16, 45, 0.8)',
          ]}
          style={styles.overlay}
        />
        
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>Explore Characters</Text>
          
          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchBarContainer,
              {
                opacity: headerOpacity,
                transform: [{ translateX: searchBarTranslateX }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.searchBarGradient}
            >
              <FontAwesome
                name="search"
                size={16}
                color="rgba(255, 255, 255, 0.6)"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search characters..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                keyboardAppearance={isDark ? 'dark' : 'light'}
                selectionColor={theme.primary}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <FontAwesome
                    name="times-circle"
                    size={16}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </Animated.View>
        </Animated.View>
        
        {/* Categories */}
        <Animated.View
          style={[
            styles.categoriesContainer,
            { opacity: categoriesOpacity },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.selectedCategoryItem,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    selectedCategory === category.id
                      ? [theme.primary, theme.accent]
                      : ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.selectedCategoryText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        
        {/* Characters List */}
        <ScrollView
          style={styles.charactersContainer}
          contentContainerStyle={styles.charactersContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="rgba(255, 255, 255, 0.8)"
              colors={[theme.primary, theme.accent]}
            />
          }
        >
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((character, index) => (
              <CharacterItem
                key={character.id}
                item={character}
                index={index}
                onPress={handleCharacterPress}
                theme={theme}
              />
            ))
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050714',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  searchBarContainer: {
    marginBottom: 15,
  },
  searchBarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    padding: 0,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategoryItem: {
    borderColor: 'transparent',
  },
  categoryGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  charactersContainer: {
    flex: 1,
  },
  charactersContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  characterItemContainer: {
    marginBottom: 15,
  },
  characterItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  characterGradient: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
  },
  characterAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  characterAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  characterContent: {
    flex: 1,
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  characterCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
  },
  characterDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 25,
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resetButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ExploreScreen; 