import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

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
  { id: 1, name: 'Gandalf', avatar: null, category: 'Fantasy' },
  { id: 2, name: 'Marie Curie', avatar: null, category: 'Historical' },
  { id: 3, name: 'Captain Picard', avatar: null, category: 'Sci-Fi' },
];

const RECENT_CHATS = [
  { id: 2, name: 'Marie Curie', avatar: null, lastMessage: 'The discovery of radium...', time: '2h ago' },
  { id: 1, name: 'Gandalf', avatar: null, lastMessage: 'A wizard is never late...', time: '5h ago' },
  { id: 3, name: 'Captain Picard', avatar: null, lastMessage: 'Make it so.', time: 'Yesterday' },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');

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
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate a data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>{greeting}</Text>
          <Text style={[styles.username, { color: theme.text }]}>{user?.email?.split('@')[0] || 'User'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.actionButtonText }]}>
              {(user?.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
        }
      >
        {/* Featured Characters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Characters</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {FEATURED_CHARACTERS.map(character => (
              <TouchableOpacity 
                key={character.id} 
                style={styles.featuredCard}
                onPress={() => navigation.navigate('CharacterDetail', { characterId: character.id })}
              >
                <View style={[styles.featuredAvatar, { backgroundColor: getCharacterBackgroundColor(character.id, theme) }]}>
                  {character.avatar ? (
                    <Image source={{ uri: character.avatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={[styles.featuredAvatarText, { color: theme.actionButtonText }]}>{character.name[0]}</Text>
                  )}
                </View>
                <Text style={[styles.featuredName, { color: theme.text }]}>{character.name}</Text>
                <Text style={[styles.featuredCategory, { color: theme.textSecondary }]}>{character.category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Chats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Chats</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {RECENT_CHATS.map(chat => (
            <TouchableOpacity 
              key={chat.id} 
              style={[styles.chatItem, { borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('ChatDetail', { characterId: chat.id })}
            >
              <View style={[styles.chatAvatar, { backgroundColor: getCharacterBackgroundColor(chat.id, theme) }]}>
                {chat.avatar ? (
                  <Image source={{ uri: chat.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={[styles.chatAvatarText, { color: theme.actionButtonText }]}>{chat.name[0]}</Text>
                )}
              </View>
              
              <View style={styles.chatInfo}>
                <View style={styles.chatNameRow}>
                  <Text style={[styles.chatName, { color: theme.text }]}>{chat.name}</Text>
                  <Text style={[styles.chatTime, { color: theme.textSecondary }]}>{chat.time}</Text>
                </View>
                <Text style={[styles.chatLastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button (temporary for testing) */}
        <TouchableOpacity 
          style={[styles.logoutButton, { 
            backgroundColor: theme.danger,
            shadowColor: theme.shadow
          }]} 
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: theme.actionButtonText }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  featuredCard: {
    width: 120,
    marginRight: 15,
    alignItems: 'center',
  },
  featuredAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featuredAvatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  featuredName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  featuredCategory: {
    fontSize: 14,
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  chatAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chatAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  chatInfo: {
    flex: 1,
  },
  chatNameRow: {
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
    fontSize: 14,
  },
  chatLastMessage: {
    fontSize: 14,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen; 