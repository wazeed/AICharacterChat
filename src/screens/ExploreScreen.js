import React, { useState } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

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
    theme.primary,
    theme.accent,
    theme.secondary,
    theme.success,
    theme.warning
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

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2;

const ExploreScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('for_you');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh with a timeout
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Filter characters based on search query and selected category
  const filteredCharacters = CHARACTERS.filter(character => {
    const matchesSearch = !searchQuery || 
                          character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          character.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'for_you' || character.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCharacterItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.characterCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('ChatDetail', { characterId: item.id })}
    >
      <View style={styles.characterImageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.characterImage} />
        ) : (
          <View style={[
            styles.placeholderImage, 
            { backgroundColor: getCharacterBackgroundColor(item.id, theme) }
          ]}>
            <Text style={[styles.characterInitial, { color: theme.actionButtonText }]}>
              {item.name[0]}
            </Text>
          </View>
        )}
        <View style={[styles.characterStatsContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <FontAwesome name="comment" size={14} color={theme.actionButtonText} />
          <Text style={[styles.characterStats, { color: theme.actionButtonText }]}>{item.stats}</Text>
        </View>
      </View>
      
      <View style={styles.characterInfo}>
        <Text style={[styles.characterName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.characterDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tagChip, { backgroundColor: theme.secondary }]}>
              <Text style={[styles.tagText, { color: theme.text }]}>{tag}</Text>
            </View>
          ))}
          {item.tags.length > 3 && (
            <View style={styles.moreTagsContainer}>
              <Text style={[styles.moreTagsText, { color: theme.textSecondary }]}>+{item.tags.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render header component for the FlatList
  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Homepage
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={[styles.searchInput, { 
            color: theme.text,
            backgroundColor: theme.inputBackground,
            borderRadius: 10,
            paddingHorizontal: 15
          }]}
          placeholder="Search"
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[styles.searchIconContainer, { backgroundColor: theme.secondary }]}
          onPress={() => {/* Open search modal */}}
        >
          <FontAwesome name="search" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={[styles.categoriesContainer, {
        borderColor: theme.border,
        backgroundColor: theme.isDark ? theme.card : 'transparent'
      }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryTab,
                {
                  backgroundColor: selectedCategory === item.id 
                    ? theme.primary 
                    : theme.isDark ? theme.secondary : '#f0f0f0',
                  borderWidth: theme.isDark ? 1 : 0,
                  borderColor: theme.border
                },
                selectedCategory === item.id && styles.categoryTabSelected
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === item.id 
                      ? theme.actionButtonText 
                      : theme.text
                  },
                  selectedCategory === item.id && styles.categoryTextSelected
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );

  // Render empty component
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="search" size={50} color={theme.textSecondary} />
      <Text style={[styles.emptyText, { color: theme.text }]}>No characters found</Text>
      <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>Try a different category</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      {/* Use FlatList as the main scrollable component */}
      <FlatList
        data={filteredCharacters}
        renderItem={renderCharacterItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.characterGridContent}
        columnWrapperStyle={styles.characterRow}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      />

      {/* Create Character Button (floating) */}
      <TouchableOpacity 
        style={[styles.createButton, { 
          backgroundColor: theme.actionButton,
          shadowColor: theme.shadow
        }]}
        onPress={() => {/* Navigate to character creation */}}
      >
        <FontAwesome name="plus" size={24} color={theme.actionButtonText} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    height: 44,
  },
  searchIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginTop: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingTop: 6,
    borderRadius: 8,
    marginHorizontal: 15,
  },
  categoriesContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryTabSelected: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    fontWeight: '700',
  },
  characterGridContent: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Space for floating button
  },
  characterRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  characterCard: {
    width: itemWidth,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  characterImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterInitial: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  characterStatsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  characterStats: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  characterInfo: {
    padding: 12,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  characterDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
  },
  moreTagsContainer: {
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  moreTagsText: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ExploreScreen; 