import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
  SafeAreaView,
  RefreshControl,
  ImageBackground,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SHADOWS, BACKGROUND_IMAGES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Helper function to get character background colors
const getCharacterBackgroundColor = (id) => {
  const colors = [
    COLORS.primary,
    COLORS.accent,
    COLORS.secondary,
    COLORS.accentSecondary,
    COLORS.primaryLight
  ];
  return colors[id % colors.length];
};

// Mock featured characters data
const FEATURED_CHARACTERS = [
  { id: 1, name: 'Gandalf', avatar: null, category: 'Fantasy' },
  { id: 2, name: 'Marie Curie', avatar: null, category: 'Historical' },
  { id: 3, name: 'Captain Picard', avatar: null, category: 'Sci-Fi' },
];

// Mock recent characters data
const RECENT_CHARACTERS = [
  { id: 2, name: 'Marie Curie', avatar: null, lastMessage: 'The discovery of radium...', time: '2h ago' },
  { id: 1, name: 'Gandalf', avatar: null, lastMessage: 'A wizard is never late...', time: '5h ago' },
  { id: 3, name: 'Captain Picard', avatar: null, lastMessage: 'Make it so.', time: 'Yesterday' },
];

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlideAnim = useRef(new Animated.Value(-20)).current;
  
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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    // Handle logout functionality
    console.log('Logging out...');
    // For example: navigation.navigate('Login');
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
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

  const renderFeaturedCharacter = ({ item }) => (
    <Animated.View 
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        styles.featuredCharacterCard,
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.65)']}
          style={styles.featuredCardGradient}
        >
          <View style={styles.featuredCardContent}>
            <View style={styles.featuredImageContainer}>
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.featuredCharacterImage} />
              ) : (
                <View
                  style={[
                    styles.featuredCharacterImagePlaceholder,
                    { backgroundColor: getCharacterBackgroundColor(item.id) },
                  ]}
                >
                  <Text style={styles.featuredCharacterInitial}>{item.name[0]}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.featuredCharacterInfo}>
              <Text style={styles.featuredCharacterName}>{item.name}</Text>
              <Text style={styles.featuredCharacterDescription} numberOfLines={2}>
                {item.category}
              </Text>
              
              <View style={styles.featuredCharacterTags}>
                {item.tags && item.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.featuredCharacterStats}>
            <View style={styles.statItem}>
              <FontAwesome name="heart" size={16} color={COLORS.accent} />
              <Text style={styles.statText}>{item.stats?.likes || 0}</Text>
            </View>
            
            <View style={styles.statItem}>
              <FontAwesome name="comment" size={16} color={COLORS.primary} />
              <Text style={styles.statText}>{item.stats?.messages || 0}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderRecentCharacter = ({ item, index }) => {
    const delay = index * 100;
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(20)).current;
    
    useEffect(() => {
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(itemSlideAnim, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
    
    return (
      <Animated.View
        style={{
          opacity: itemFadeAnim,
          transform: [{ translateY: itemSlideAnim }],
        }}
      >
        <TouchableOpacity
          style={styles.recentCharacterCard}
          onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            style={styles.recentCardGradient}
          >
            <View style={styles.recentCharacterContent}>
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.recentCharacterImage} />
              ) : (
                <View
                  style={[
                    styles.recentCharacterImagePlaceholder,
                    { backgroundColor: getCharacterBackgroundColor(item.id) },
                  ]}
                >
                  <Text style={styles.recentCharacterInitial}>{item.name[0]}</Text>
                </View>
              )}
              
              <View style={styles.recentCharacterInfo}>
                <Text style={styles.recentCharacterName}>{item.name}</Text>
                <Text style={styles.recentCharacterDescription} numberOfLines={1}>
                  {item.lastMessage || item.description}
                </Text>
                
                <View style={styles.recentCharacterStats}>
                  <FontAwesome name="clock-o" size={12} color={COLORS.textMuted} />
                  <Text style={styles.recentTimeText}>{item.time}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ImageBackground 
        source={{ uri: BACKGROUND_IMAGES.main }}
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
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.primary, COLORS.secondary]}
            />
          }
        >
          <Animated.View
            style={{
              opacity: headerFadeAnim,
              transform: [{ translateY: headerSlideAnim }],
            }}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>Welcome back</Text>
                <Text style={styles.username}>User</Text>
              </View>
              
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.profileButtonGradient}
                >
                  <FontAwesome name="user" size={24} color={COLORS.primary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Characters</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={FEATURED_CHARACTERS}
              renderItem={renderFeaturedCharacter}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredCharactersContainer}
            />
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Chats</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentCharactersContainer}>
              {RECENT_CHARACTERS.map((item, index) => renderRecentCharacter({ item, index }))}
            </View>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  profileButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  seeAllText: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.9,
  },
  featuredCharactersContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  featuredCharacterCard: {
    width: width * 0.75,
    borderRadius: COLORS.cardRadius,
    marginRight: 15,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  featuredCardGradient: {
    width: '100%',
    height: '100%',
    borderRadius: COLORS.cardRadius,
    padding: 15,
  },
  featuredCardContent: {
    flexDirection: 'row',
  },
  featuredImageContainer: {
    marginRight: 15,
  },
  featuredCharacterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  featuredCharacterImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCharacterInitial: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  featuredCharacterInfo: {
    flex: 1,
  },
  featuredCharacterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  featuredCharacterDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  featuredCharacterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagPill: {
    backgroundColor: 'rgba(90, 102, 232, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  featuredCharacterStats: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
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
  recentCharactersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  recentCharacterCard: {
    borderRadius: COLORS.cardRadius,
    marginBottom: 15,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  recentCardGradient: {
    borderRadius: COLORS.cardRadius,
    padding: 15,
  },
  recentCharacterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentCharacterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  recentCharacterImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentCharacterInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  recentCharacterInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recentCharacterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  recentCharacterDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  recentCharacterStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  recentTimeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 5,
  },
});

export default HomeScreen; 