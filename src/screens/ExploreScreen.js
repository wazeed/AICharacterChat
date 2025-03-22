import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ImageBackground,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SHADOWS, BACKGROUND_IMAGES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Mock character categories
const CATEGORIES = [
  { id: 'for_you', name: 'For You' },
  { id: 'multi_role', name: 'Multi-Role' },
  { id: 'oc', name: 'OC' },
  { id: 'anime', name: 'Anime' },
  { id: 'movies', name: 'Movies&TV' },
];

// Mock character data with placeholder background colors
const getCharacterBackgroundColor = (id, theme) => {
  const colors = [
    COLORS.primary,
    COLORS.accent,
    COLORS.secondary,
    COLORS.accentSecondary,
    COLORS.primaryLight
  ];
  return colors[id % colors.length];
};

// Mock character data
const CHARACTERS = [
  { 
    id: 1, 
    name: 'Paulo', 
    description: '/Can I play ball with the mlk...',
    category: 'multi_role',
    stats: '3.5M',
    tags: ['Text Game', 'Loyal', 'Gentle', 'Jealous', 'Naughty'],
    image: null
  },
  { 
    id: 2, 
    name: 'Nishimura Riki', 
    description: 'Riki |forced marriage for our dad\'s companies 💮',
    category: 'anime',
    stats: '1.9M',
    tags: ['Elegant', 'Movies&TV', 'Romance'],
    image: null
  },
  { 
    id: 3, 
    name: 'biker boy', 
    description: 'He is very selfish but kinda sweet.',
    category: 'oc',
    stats: '16.3M',
    tags: ['OC', 'Student', 'Cold', 'Gentle', 'Badboy'],
    image: null
  },
  { 
    id: 4, 
    name: 'Charlotte', 
    description: 'Your cousin who is over for the weekend',
    category: 'for_you',
    stats: '6.7M',
    tags: ['Student', 'Friendly', 'Family'],
    image: null
  },
  { 
    id: 5, 
    name: 'Geralt of Rivia', 
    description: 'The Witcher, monster hunter',
    category: 'multi_role',
    stats: '8.2M',
    tags: ['Fantasy', 'Serious', 'Adventurous'],
    image: null
  },
  { 
    id: 6, 
    name: 'Sherlock Holmes', 
    description: 'The world\'s greatest detective',
    category: 'movies',
    stats: '4.5M',
    tags: ['Movies&TV', 'Detective', 'Genius'],
    image: null
  },
  { 
    id: 7, 
    name: 'Hinata Hyuga', 
    description: 'Shy kunoichi from the Hidden Leaf',
    category: 'anime',
    stats: '3.8M',
    tags: ['Anime', 'Shy', 'Sweet'],
    image: null
  },
  { 
    id: 8, 
    name: 'Captain America', 
    description: 'Super soldier with unwavering morals',
    category: 'movies',
    stats: '7.1M',
    tags: ['Movies&TV', 'Hero', 'Brave'],
    image: null
  },
];

const itemWidth = (width - 40) / 2;

const ExploreScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('for_you');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCharacters, setFilteredCharacters] = useState(CHARACTERS);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    // Start animations when the component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Filter characters based on selected category and search query
    filterCharacters();
  }, [selectedCategory, searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  const filterCharacters = () => {
    let filtered = CHARACTERS;
    
    // Filter by category
    if (selectedCategory !== 'for_you') {
      filtered = filtered.filter(char => char.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        char => 
          char.name.toLowerCase().includes(query) || 
          char.description.toLowerCase().includes(query) ||
          (char.tags && char.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredCharacters(filtered);
  };

  const renderCharacterItem = ({ item }) => (
    <Animated.View 
      style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
      }}
    >
      <TouchableOpacity
        style={styles.characterCard}
        onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
          style={styles.cardGradient}
        >
          <View style={styles.characterContent}>
            <View style={styles.characterImageContainer}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.characterImage} />
              ) : (
                <View
                  style={[
                    styles.characterImagePlaceholder,
                    { backgroundColor: getCharacterBackgroundColor(item.id, theme) },
                  ]}
                >
                  <Text style={styles.characterImagePlaceholderText}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.characterDetails}>
              <Text style={styles.characterName}>{item.name}</Text>
              <Text style={styles.characterDescription} numberOfLines={2}>
                {item.description}
              </Text>
              
              <View style={styles.tagsContainer}>
                {item.tags && item.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.characterStats}>
            <View style={styles.statItem}>
              <FontAwesome name="heart" size={14} color={COLORS.accent} />
              <Text style={styles.statText}>{item.stats?.likes || 0}</Text>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome name="comment" size={14} color={COLORS.primary} />
              <Text style={styles.statText}>{item.stats?.messages || 0}</Text>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome name="star" size={14} color={COLORS.accentSecondary} />
              <Text style={styles.statText}>{item.stats?.rating || 0}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={18} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search characters..."
          placeholderTextColor={COLORS.gray}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={18} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.selectedCategoryItem,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'for_you' ? 'Characters For You' : `${selectedCategory} Characters`}
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="search" size={50} color={COLORS.gray} />
      <Text style={styles.emptyText}>No characters found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your search or browse a different category
      </Text>
    </View>
  );

  // Add star twinkling effect
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 3 + 1;
      stars.push(
        <View
          key={`star-${i}`}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: size / 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.25,
          }}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ImageBackground 
        source={{ uri: BACKGROUND_IMAGES.alternate }}
        style={styles.backgroundImage}
      >
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
        
        <LinearGradient
          colors={GRADIENTS.main.colors}
          start={GRADIENTS.main.start}
          end={GRADIENTS.main.end}
          style={styles.gradient}
        />
        
        <View style={styles.title}>
          <Text style={styles.titleText}>Explore</Text>
        </View>
        
        <FlatList
          data={filteredCharacters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCharacterItem}
          contentContainerStyle={styles.charactersContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.primary, COLORS.secondary]}
            />
          }
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  starsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    paddingTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: COLORS.inputRadius,
    paddingHorizontal: 15,
    marginVertical: 10,
    height: 50,
    ...SHADOWS.medium,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: COLORS.textDark,
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 5,
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  selectedCategoryItem: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  seeAllText: {
    color: COLORS.white,
    opacity: 0.9,
  },
  charactersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  characterCard: {
    borderRadius: COLORS.cardRadius,
    marginBottom: 20,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  cardGradient: {
    borderRadius: COLORS.cardRadius,
    padding: 15,
  },
  characterContent: {
    flexDirection: 'row',
  },
  characterImageContainer: {
    marginRight: 15,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  characterImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImagePlaceholderText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  characterDetails: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  characterDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tagPill: {
    backgroundColor: 'rgba(90, 102, 232, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  characterStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.textDark,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
});

export default ExploreScreen; 