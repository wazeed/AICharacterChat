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
  Alert,
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
  { id: 1, name: 'Paulo', avatar: null, category: 'Text Game', description: '/Can I play ball with the mlk...', tags: ['Text Game', 'Loyal', 'Gentle', 'Jealous', 'Naughty'] },
  { id: 2, name: 'Nishimura Riki', avatar: null, category: 'Movies&TV', description: 'Riki |forced marriage for our dad\'s companies 💮', tags: ['Elegant', 'Movies&TV', 'Romance'] },
  { id: 3, name: 'biker boy', avatar: null, category: 'OC', description: 'He is very selfish bit kinda sweet.', tags: ['OC', 'Student', 'Cold', 'Gentle', 'Badboy'] },
  { id: 4, name: 'Charlotte', avatar: null, category: 'Romance', description: 'Your cousin who is over for the weekend', tags: ['Romance', 'Flirty', 'Family'] },
  { id: 5, name: 'Ada Lovelace', avatar: null, category: 'Science', description: "Known as the world's first computer programmer", tags: ['Historical', 'Science', 'Genius'] },
  { id: 6, name: 'Socrates', avatar: null, category: 'Philosophy', description: "Ancient Greek philosopher and founder of Western philosophy", tags: ['Philosophy', 'Historical', 'Wise'] },
];

// Quick Actions data
const QUICK_ACTIONS = [
  { id: 1, name: 'For You', icon: 'star', screen: 'ExploreScreen', params: { filter: 'forYou' } },
  { id: 2, name: 'Multi-Role', icon: 'users', screen: 'ExploreScreen', params: { filter: 'multiRole' } },
  { id: 3, name: 'OC', icon: 'pencil', screen: 'ExploreScreen', params: { filter: 'OC' } },
  { id: 4, name: 'Anime', icon: 'heart', screen: 'ExploreScreen', params: { filter: 'Anime' } },
];

const RECENT_CHATS = [
  { id: 2, name: 'Marie Curie', avatar: null, lastMessage: 'The discovery of radium was one of the most important moments in science.', time: '2h ago' },
  { id: 1, name: 'Gandalf', avatar: null, lastMessage: 'A wizard is never late, nor is he early. He arrives precisely when he means to.', time: '5h ago' },
  { id: 3, name: 'Captain Picard', avatar: null, lastMessage: 'Make it so. The Enterprise will be ready for our next mission.', time: 'Yesterday' },
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

// Featured character card component as a grid item
const FeaturedCharacterCard = ({ item, index, onPress, theme }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featuredCardContainer,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.featuredCard]}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
          style={styles.featuredCardGradient}
        >
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.featuredAvatar} />
          ) : (
            <View
              style={[
                styles.featuredAvatarPlaceholder,
                { backgroundColor: getCharacterBackgroundColor(item.id, theme) },
              ]}
            >
              <Text style={styles.featuredAvatarLetter}>{item.name.charAt(0)}</Text>
            </View>
          )}
          
          <View style={styles.featuredCardContent}>
            <Text style={styles.featuredCardName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.featuredCardCategory} numberOfLines={1}>{item.category}</Text>
            <Text style={styles.featuredCardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Quick action item component
const QuickActionItem = ({ item, index, onPress, theme }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.quickActionContainer,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.quickActionItem, { borderColor: theme.border }]}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
          style={styles.quickActionGradient}
        >
          <FontAwesome name={item.icon} size={24} color={theme.textLight} />
          <Text style={styles.quickActionName}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Recent chat item component
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
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, fetch fresh data here
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleCharacterPress = (character) => {
    // Pass the full character object
    navigation.navigate('CharacterDetail', { characterId: character.id, character: character });
  };

  const handleChatPress = (chat) => {
    // Pass the full chat object and character ID
    navigation.navigate('ChatDetail', {
      characterId: chat.id,
      character: chat
    });
  };

  const handleQuickActionPress = (item) => {
    if (item.screen && item.params) {
      navigation.navigate(item.screen, item.params);
    } else {
      Alert.alert('Coming Soon', 'This feature will be available in a future update.');
    }
  };

  const renderFeaturedItem = ({ item, index }) => (
    <FeaturedCharacterCard
      item={item}
      index={index}
      onPress={handleCharacterPress}
      theme={theme}
    />
  );

  const renderQuickActionItem = ({ item, index }) => (
    <QuickActionItem
      item={item}
      index={index}
      onPress={handleQuickActionPress}
      theme={theme}
    />
  );

  const renderRecentChatItem = ({ item, index }) => (
    <RecentChatItem
      key={item.id}
      item={item}
      index={index}
      onPress={handleChatPress}
      theme={theme}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1471&auto=format&fit=crop' }}
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
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.textLight}
            />
          }
        >
          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={[styles.welcomeText, { color: theme.textLight }]}>
                  Welcome back
                </Text>
                <Text style={[styles.userNameText, { color: theme.textLight }]}>
                  {user?.displayName || 'User'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <FontAwesome name="user-circle" size={32} color={theme.textLight} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Quick Actions Section */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.textLight }]}>
              Categories
            </Text>
            <FlatList
              data={QUICK_ACTIONS}
              renderItem={renderQuickActionItem}
              keyExtractor={(item) => `quick-action-${item.id}`}
              horizontal={false}
              numColumns={2}
              columnWrapperStyle={styles.quickActionsRow}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsContainer}
            />
          </Animated.View>

          {/* Featured Characters Section */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textLight }]}>
                Featured Characters
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                <Text style={[styles.seeAllText, { color: theme.accent }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={FEATURED_CHARACTERS}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => `featured-${item.id}`}
              horizontal={false}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            />
          </Animated.View>

          {/* Recent Chats Section */}
          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textLight }]}>
                Continue Chatting
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                <Text style={[styles.seeAllText, { color: theme.accent }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {RECENT_CHATS.map((chat, index) => (
              <TouchableOpacity 
                key={`chat-${chat.id}`}
                style={styles.recentChatItem}
                onPress={() => handleChatPress(chat)}
              >
                <View style={styles.chatAvatarContainer}>
                  {chat.avatar ? (
                    <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
                  ) : (
                    <View
                      style={[
                        styles.chatAvatarPlaceholder,
                        { backgroundColor: getCharacterBackgroundColor(chat.id, theme) },
                      ]}
                    >
                      <Text style={styles.chatAvatarLetter}>{chat.name.charAt(0)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={[styles.chatName, { color: theme.textLight }]}>{chat.name}</Text>
                    <Text style={[styles.chatTime, { color: theme.textSecondary }]}>{chat.time}</Text>
                  </View>
                  <Text style={[styles.chatMessage, { color: theme.textSecondary }]} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.8,
    fontWeight: '400',
  },
  userNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  profileButton: {
    padding: 10,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Featured grid styles
  featuredContainer: {
    paddingBottom: 10,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featuredCardContainer: {
    width: (width - 60) / 2, // 2 columns with 20px padding on sides and 20px spacing
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredCardGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  featuredAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: 20,
    left: 15,
  },
  featuredAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    top: 20,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredAvatarLetter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  featuredCardContent: {
    width: '100%',
  },
  featuredCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  featuredCardCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  featuredCardDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Quick actions grid styles
  quickActionsContainer: {
    paddingBottom: 10,
  },
  quickActionsRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quickActionContainer: {
    width: (width - 60) / 2, // 2 columns with 20px padding on sides and 20px spacing
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionItem: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  quickActionGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  quickActionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  // Recent chat styles
  recentChatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatAvatarContainer: {
    marginRight: 15,
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: 12,
  },
  chatMessage: {
    fontSize: 14,
  },
});

export default HomeScreen; 