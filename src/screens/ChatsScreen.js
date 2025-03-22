import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

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

// Mock chat data
const CHATS = [
  { 
    id: 2, 
    character: 'Marie Curie', 
    avatar: null,
    lastMessage: 'The discovery of radium was one of the most exciting moments in my research.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).getTime(), // 2 hours ago
    unread: 2,
  },
  { 
    id: 3, 
    character: 'Captain Picard', 
    avatar: null,
    lastMessage: 'Make it so. The Enterprise will be ready for our next mission.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).getTime(), // 5 hours ago
    unread: 0,
  },
  { 
    id: 1, 
    character: 'Gandalf', 
    avatar: null,
    lastMessage: 'A wizard is never late, nor is he early. He arrives precisely when he means to.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).getTime(), // 8 hours ago
    unread: 1,
  },
  { 
    id: 4, 
    character: 'Tony Stark', 
    avatar: null,
    lastMessage: 'I am Iron Man. The suit and I are one. Also, have you tried shawarma?',
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).getTime(), // Yesterday
    unread: 0,
  },
  { 
    id: 5, 
    character: 'Jane Austen', 
    avatar: null,
    lastMessage: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).getTime(), // 2 days ago
    unread: 0,
  },
];

const ChatsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Format timestamp to readable string
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffHours = Math.floor((now - messageDate) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) {
        return 'Just now';
      }
      return `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Filter chats based on search query
  const filteredChats = CHATS.filter(chat => 
    chat.character.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.chatItem, { borderBottomColor: theme.border }]}
      onPress={() => navigation.navigate('ChatDetail', { characterId: item.id })}
    >
      <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.id, theme) }]}>
        <Text style={[styles.avatarText, { color: theme.actionButtonText }]}>{item.character[0]}</Text>
        {item.unread > 0 && (
          <View style={[styles.unreadBadge, { 
            backgroundColor: theme.notification,
            borderColor: theme.background
          }]}>
            <Text style={[styles.unreadText, { color: theme.actionButtonText }]}>{item.unread}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.characterName, { color: theme.text }]}>{item.character}</Text>
          <Text style={[styles.timestamp, { color: theme.textSecondary }]}>{formatTimestamp(item.timestamp)}</Text>
        </View>
        <Text 
          style={[
            styles.lastMessage, 
            { color: theme.textSecondary },
            item.unread > 0 && [styles.unreadMessage, { color: theme.text }]
          ]} 
          numberOfLines={2}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chats</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.inputBackground }]}>
          <FontAwesome name="search" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search conversations..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome name="times-circle" size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome name="comments" size={50} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.text }]}>No conversations yet</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
              Start chatting with AI characters in the Explore tab
            </Text>
            <TouchableOpacity 
              style={[styles.exploreButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Explore')}
            >
              <Text style={[styles.exploreButtonText, { color: theme.actionButtonText }]}>
                Explore Characters
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    fontSize: 16,
  },
  chatList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
  },
  lastMessage: {
    fontSize: 16,
    lineHeight: 22,
  },
  unreadMessage: {
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  exploreButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatsScreen; 