import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  FlatList,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

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

// Mock data for featured and recent characters
const FEATURED_CHARACTERS = [
  { id: 1, name: 'Gandalf', avatar: null, category: 'Fantasy', description: 'A wise wizard with powerful magic and timeless wisdom' },
  { id: 2, name: 'Marie Curie', avatar: null, category: 'Historical', description: 'Nobel Prize winner and pioneer in the field of radioactivity' },
  { id: 3, name: 'Captain Picard', avatar: null, category: 'Sci-Fi', description: 'Starfleet captain known for diplomacy and leadership' },
  { id: 4, name: 'Sherlock Holmes', avatar: null, category: 'Literature', description: "The world's greatest detective with exceptional deductive skills" },
  { id: 5, name: 'Ada Lovelace', avatar: null, category: 'Science', description: "Known as the world's first computer programmer" },
  { id: 6, name: 'Socrates', avatar: null, category: 'Philosophy', description: "Ancient Greek philosopher and founder of Western philosophy" },
];

const RECENT_CHATS = [
  { id: 2, name: 'Marie Curie', avatar: null, lastMessage: 'The discovery of radium was one of the most important moments in science.', time: '2h ago' },
  { id: 1, name: 'Gandalf', avatar: null, lastMessage: 'A wizard is never late, nor is he early. He arrives precisely when he means to.', time: '5h ago' },
  { id: 3, name: 'Captain Picard', avatar: null, lastMessage: 'Make it so. The Enterprise will be ready for our next mission.', time: 'Yesterday' },
];

// Quick actions for grid layout
const QUICK_ACTIONS = [
  { id: 'explore', name: 'Explore', icon: 'compass', screen: 'Explore' },
  { id: 'chats', name: 'Chats', icon: 'comments', screen: 'Chats' },
  { id: 'profile', name: 'Profile', icon: 'user-circle', screen: 'Profile' },
  { id: 'notifications', name: 'Notifications', icon: 'bell', screen: 'Notifications' },
];

// Creates a starry background effect
const StarryBackground = ({ count = 40 }) => {
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

// Animated Featured Character Card for Grid Layout
const FeaturedCharacterCard = ({ item, index, onPress, theme }) => {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.gridFeaturedCard,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.featuredCardTouchable}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCardGradient}
        >
          <View
            style={[
              styles.featuredAvatar,
              { backgroundColor: getCharacterBackgroundColor(item.id, theme) }
            ]}
          >
            <Text style={styles.featuredAvatarText}>{item.name.charAt(0)}</Text>
          </View>
          
          <Text style={styles.featuredName}>{item.name}</Text>
          <Text style={styles.featuredCategory}>{item.category}</Text>
          
          <Text style={styles.featuredDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Quick Action Item for Grid
const QuickActionItem = ({ item, index, onPress, theme }) => {
  const translateY = useRef(new Animated.Value(20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100 + 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay: index * 100 + 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.quickActionItem,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => onPress(item.screen)}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
          style={styles.actionGradient}
        >
          <FontAwesome name={item.icon} size={24} color="rgba(255,255,255,0.9)" />
          <Text style={styles.actionText}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Recent Chat Item with animations
const RecentChatItem = ({ item, index, onPress, theme }) => {
  const translateX = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        delay: index * 100 + 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 100 + 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.recentChatContainer,
        {
          opacity,
          transform: [{ translateX }],
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.recentChatItem}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.recentChatGradient}
        >
          <View 
            style={[
              styles.recentAvatar,
              { backgroundColor: getCharacterBackgroundColor(item.id, theme) }
            ]}
          >
            <Text style={styles.recentAvatarText}>{item.name.charAt(0)}</Text>
          </View>
          
          <View style={styles.recentChatContent}>
            <View style={styles.recentChatHeader}>
              <Text style={styles.recentChatName}>{item.name}</Text>
              <Text style={styles.recentChatTime}>{item.time}</Text>
            </View>
            
            <Text style={styles.recentChatMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const sectionOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour < 12) {
      newGreeting = 'Good Morning';
    } else if (hour < 18) {
      newGreeting = 'Good Afternoon';
    } else {
      newGreeting = 'Good Evening';
    }
    
    setGreeting(newGreeting);
    
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
      Animated.timing(sectionOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleCharacterPress = (character) => {
    navigation.navigate('CharacterDetail', { character });
  };
  
  const handleChatPress = (chat) => {
    navigation.navigate('ChatDetail', { 
      chatId: chat.id, 
      characterName: chat.name 
    });
  };
  
  const handleNavigate = (screen) => {
    navigation.navigate(screen);
  };

  // Render grid item for featured characters
  const renderFeaturedItem = ({ item, index }) => (
    <FeaturedCharacterCard
      item={item}
      index={index}
      onPress={handleCharacterPress}
      theme={theme}
    />
  );
  
  // Render grid item for quick actions
  const renderQuickActionItem = ({ item, index }) => (
    <QuickActionItem
      item={item}
      index={index}
      onPress={handleNavigate}
      theme={theme}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?q=80&w=1700' }}
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
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.username}>{user?.name || 'AI Explorer'}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <LinearGradient
                  colors={[theme.primary, theme.accent]}
                  style={styles.profileGradient}
                >
                  <FontAwesome name="user" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          {/* Quick Actions Grid */}
          <Animated.View style={{ opacity: sectionOpacity, marginTop: 15 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            
            <FlatList
              data={QUICK_ACTIONS}
              renderItem={renderQuickActionItem}
              keyExtractor={item => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.quickActionsGrid}
            />
          </Animated.View>
          
          {/* Featured Characters Grid */}
          <Animated.View style={{ opacity: sectionOpacity, marginTop: 15 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Characters</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={FEATURED_CHARACTERS}
              renderItem={renderFeaturedItem}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.featuredGrid}
            />
          </Animated.View>
          
          {/* Recent Chats Section */}
          <Animated.View style={{ opacity: sectionOpacity, marginTop: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Conversations</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentChatsList}>
              {RECENT_CHATS.map((chat, index) => (
                <RecentChatItem
                  key={chat.id}
                  item={chat}
                  index={index}
                  onPress={handleChatPress}
                  theme={theme}
                />
              ))}
            </View>
          </Animated.View>
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
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Grid Layouts
  quickActionsGrid: {
    paddingHorizontal: 10,
  },
  quickActionItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  featuredGrid: {
    paddingHorizontal: 10,
  },
  gridFeaturedCard: {
    width: '50%', 
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  // Featured Characters
  featuredCardTouchable: {
    flex: 1,
  },
  featuredCardGradient: {
    padding: 16,
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuredAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featuredAvatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featuredCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
  },
  featuredDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Recent Chats
  recentChatsList: {
    paddingHorizontal: 20,
  },
  recentChatContainer: {
    marginBottom: 12,
  },
  recentChatItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentChatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  recentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  recentChatContent: {
    flex: 1,
  },
  recentChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentChatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recentChatTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  recentChatMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  // Quick Actions Styling
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    height: 120,
  },
  actionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default HomeScreen; 