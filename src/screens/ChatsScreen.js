import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Animated,
  RefreshControl,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SHADOWS, BACKGROUND_IMAGES } from '../constants/theme';

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

// Mock data for chat list
const CHAT_LIST = [
  {
    id: '1',
    name: 'Marie Curie',
    lastMessage: 'The discovery of radium was just the beginning...',
    time: '10:42 AM',
    unread: 2,
    image: null,
  },
  {
    id: '2',
    name: 'Albert Einstein',
    lastMessage: 'Imagination is more important than knowledge',
    time: 'Yesterday',
    unread: 0,
    image: null,
  },
  {
    id: '3',
    name: 'Sherlock Holmes',
    lastMessage: 'Elementary, my dear Watson!',
    time: 'Yesterday',
    unread: 5,
    image: null,
  },
  {
    id: '4',
    name: 'Gandalf',
    lastMessage: 'A wizard is never late, nor is he early.',
    time: 'Monday',
    unread: 0,
    image: null,
  },
  {
    id: '5',
    name: 'Wonder Woman',
    lastMessage: 'Peace is a responsibility. Fighting ensures peace.',
    time: 'Sunday',
    unread: 0,
    image: null,
  },
  {
    id: '6',
    name: 'Tony Stark',
    lastMessage: 'Sometimes you gotta run before you can walk',
    time: 'Last Week',
    unread: 0,
    image: null,
  },
];

const ChatsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState(CHAT_LIST);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  
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
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Filter chats based on search query
    if (searchQuery.trim() !== '') {
      const filteredChats = CHAT_LIST.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setChats(filteredChats);
    } else {
      setChats(CHAT_LIST);
    }
  }, [searchQuery]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
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

  const renderChatItem = ({ item, index }) => {
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
          transform: [{ translateY: itemSlideAnim }]
        }}
      >
        <TouchableOpacity 
          style={styles.chatItem}
          onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, name: item.name })}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            style={styles.chatItemGradient}
          >
            <View style={styles.chatItemContent}>
              <View style={styles.avatarContainer}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.avatar} />
                ) : (
                  <View 
                    style={[
                      styles.avatarPlaceholder,
                      { backgroundColor: getCharacterBackgroundColor(parseInt(item.id)) }
                    ]}
                  >
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                  </View>
                )}
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unread}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
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

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="comments-o" size={60} color="rgba(255,255,255,0.7)" />
      <Text style={styles.emptyText}>No chats found</Text>
      <Text style={styles.emptySubtext}>
        Start a new conversation with a character
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.emptyButtonGradient}
        >
          <Text style={styles.emptyButtonText}>Explore Characters</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

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
        
        <Animated.View 
          style={{
            opacity: headerFadeAnim,
            zIndex: 10,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chats</Text>
          </View>
          
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <FontAwesome name="times-circle" size={18} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
        
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatsList}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.primary, COLORS.secondary]}
            />
          }
        />
        
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={() => navigation.navigate('Explore')}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.newChatButtonGradient}
          >
            <FontAwesome name="plus" size={24} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: COLORS.inputRadius,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
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
  chatsList: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  chatItem: {
    borderRadius: COLORS.cardRadius,
    marginBottom: 15,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  chatItemGradient: {
    borderRadius: COLORS.cardRadius,
    padding: 15,
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  unreadBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: COLORS.accent,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textDark,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  unreadMessage: {
    color: COLORS.textDark,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtext: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  emptyButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  newChatButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  newChatButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatsScreen; 