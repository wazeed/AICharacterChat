import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Mock chat data
const CHATS = [
  {
    id: 1,
    character: 'Gandalf',
    lastMessage: 'A wizard is never late, nor is he early. He arrives precisely when he means to.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    unread: 0,
  },
  {
    id: 2,
    character: 'Marie Curie',
    lastMessage: 'Nothing in life is to be feared, it is only to be understood.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unread: 3,
  },
  {
    id: 3,
    character: 'Captain Picard',
    lastMessage: 'Make it so. The first duty of every Starfleet officer is to the truth.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    unread: 0,
  },
  {
    id: 4,
    character: 'Sherlock Holmes',
    lastMessage: 'The game is afoot! I am analyzing the evidence we collected from the crime scene.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unread: 0,
  },
  {
    id: 5,
    character: 'Socrates',
    lastMessage: 'The only true wisdom is in knowing you know nothing. Let us continue our dialogue.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    unread: 1,
  },
  {
    id: 6,
    character: 'Ada Lovelace',
    lastMessage: 'The engine I am designing will be able to process more than just numbers.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    unread: 0,
  },
];

// Helper function to get avatar color based on character ID
const getAvatarColor = (id, theme) => {
  const colors = [
    theme.primary,
    theme.accent,
    theme.secondary,
    theme.success,
    theme.warning
  ];
  return colors[id % colors.length];
};

// Helper function to format timestamp as relative time
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? 'Yesterday' : `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

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

// Chat Item Component with elegant animations
const ChatItem = ({ item, index, onPress, theme }) => {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400, 
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.chatItemContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity style={styles.chatItem} onPress={() => onPress(item)}>
        <LinearGradient
          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.chatItemGradient}
        >
          <View style={styles.chatItemContent}>
            <View 
              style={[
                styles.avatarContainer,
                { backgroundColor: getAvatarColor(item.id, theme) }
              ]}
            >
              <Text style={styles.avatarText}>{item.character.charAt(0)}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.chatDetails}>
              <View style={styles.chatHeader}>
                <Text style={styles.characterName} numberOfLines={1}>
                  {item.character}
                </Text>
                <Text style={styles.timestamp}>{formatTimeAgo(item.timestamp)}</Text>
              </View>
              
              <Text 
                style={[
                  styles.lastMessage,
                  item.unread > 0 && styles.unreadMessage
                ]} 
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChatsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(CHATS);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  
  useEffect(() => {
    // Filter chats based on search query
    if (searchQuery.trim()) {
      setFilteredChats(
        CHATS.filter(
          chat => 
            chat.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredChats(CHATS);
    }
  }, [searchQuery]);
  
  useEffect(() => {
    // Animate header on mount
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
    ]).start();
  }, []);
  
  const handleChatPress = (chat) => {
    // Navigate to chat detail screen
    navigation.navigate('ChatDetail', { 
      chatId: chat.id, 
      characterName: chat.character 
    });
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="comments-o" size={60} color="rgba(255,255,255,0.7)" />
      <Text style={styles.emptyText}>No chats found</Text>
      <Text style={styles.emptySubText}>
        Try modifying your search or start a new conversation
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <LinearGradient
          colors={[theme.primary, theme.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.exploreButtonGradient}
        >
          <Text style={styles.exploreButtonText}>Explore Characters</Text>
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
        
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>Chats</Text>
          
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={16} color="rgba(255, 255, 255, 0.6)" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={16} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <ChatItem
              item={item}
              index={index}
              onPress={handleChatPress}
              theme={theme}
            />
          )}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="rgba(255, 255, 255, 0.8)"
              colors={[theme.primary, theme.accent]}
            />
          }
        />
        
        {/* Floating action button for new chat */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('Explore')}
        >
          <LinearGradient
            colors={[theme.primary, theme.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.floatingButtonGradient}
          >
            <FontAwesome name="plus" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  chatItemContainer: {
    marginBottom: 12,
  },
  chatItem: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatItemGradient: {
    borderRadius: 16,
    padding: 16,
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#050714',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  characterName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  timestamp: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  lastMessage: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  unreadMessage: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  exploreButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatsScreen; 