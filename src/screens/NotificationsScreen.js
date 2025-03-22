import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Mock notification data
const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Character Added!',
    message: 'Check out our new AI character "Sherlock Holmes" now available to chat with.',
    time: '5 min ago',
    read: false,
    type: 'character',
  },
  {
    id: '2',
    title: 'Your feedback has been received',
    message: 'Thank you for submitting feedback about your experience with Marie Curie.',
    time: '2 hours ago',
    read: true,
    type: 'feedback',
  },
  {
    id: '3',
    title: 'Tony Stark replied',
    message: 'Your conversation with Tony Stark has a new reply waiting for you.',
    time: '1 day ago',
    read: true,
    type: 'message',
  },
  {
    id: '4',
    title: 'Weekly AI Update',
    message: 'We\'ve made our AI responses more dynamic and personalized for your favorite characters!',
    time: '3 days ago',
    read: true,
    type: 'system',
  },
  {
    id: '5',
    title: 'Seasonal Event Started',
    message: 'Explore themed conversations with characters during our Winter Wonder event!',
    time: '1 week ago',
    read: true,
    type: 'event',
  },
];

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => setNotifications([]),
          style: 'destructive',
        },
      ]
    );
  };

  const handleNotificationPress = (item) => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === item.id 
          ? { ...notification, read: true } 
          : notification
      )
    );

    // Navigate based on notification type
    switch (item.type) {
      case 'character':
        navigation.navigate('Explore');
        break;
      case 'message':
        navigation.navigate('Chats');
        break;
      case 'feedback':
        navigation.navigate('Profile');
        break;
      case 'event':
      case 'system':
      default:
        // Just mark as read, no navigation needed
        break;
    }
  };

  const getIconColorForType = (type) => {
    switch (type) {
      case 'character':
        return theme.accent;
      case 'message':
        return theme.primary;
      case 'feedback':
        return theme.success;
      case 'system':
        return theme.primary;
      case 'event':
        return theme.warning;
      default:
        return theme.primary;
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: theme.secondary },
        !item.read && { 
          backgroundColor: 'rgba(138, 43, 226, 0.1)',
          borderLeftWidth: 3,
          borderLeftColor: theme.primary 
        },
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
        {item.type === 'character' && (
          <FontAwesome name="user" size={20} color={getIconColorForType(item.type)} />
        )}
        {item.type === 'message' && (
          <FontAwesome name="comment" size={20} color={getIconColorForType(item.type)} />
        )}
        {item.type === 'feedback' && (
          <FontAwesome name="check-circle" size={20} color={getIconColorForType(item.type)} />
        )}
        {item.type === 'system' && (
          <FontAwesome name="cog" size={20} color={getIconColorForType(item.type)} />
        )}
        {item.type === 'event' && (
          <FontAwesome name="calendar" size={20} color={getIconColorForType(item.type)} />
        )}
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.notificationTime, { color: theme.textSecondary }]}>{item.time}</Text>
        </View>
        <Text style={[styles.notificationMessage, { color: theme.textSecondary }]}>{item.message}</Text>
      </View>
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={20} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        <View style={styles.placeholderButton} />
      </View>

      {notifications.length > 0 ? (
        <>
          <View style={[styles.actionBar, { borderBottomColor: theme.border }]}>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.actionButton} onPress={markAllAsRead}>
                <Text style={[styles.actionButtonText, { color: theme.primary }]}>Mark all as read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton} onPress={deleteAllNotifications}>
              <FontAwesome name="trash" size={16} color={theme.error} style={{ marginRight: 8 }} />
              <Text style={[styles.actionButtonText, { color: theme.error }]}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bell-slash" size={60} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Notifications</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            You don't have any notifications yet. We'll notify you when there's something new!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholderButton: {
    width: 36,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButtonText: {
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default NotificationsScreen; 