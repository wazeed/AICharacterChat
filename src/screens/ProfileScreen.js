import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isDarkTheme, toggleTheme, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || 'User');
  const [profilePicture, setProfilePicture] = useState(null);
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await logout();
      if (error) {
        Alert.alert('Error', error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSwitch = async (setting, value) => {
    if (setting === 'notifications') {
      setNotificationsEnabled(value);
    } else if (setting === 'darkTheme') {
      try {
        await toggleTheme();
      } catch (error) {
        console.log('Error toggling theme:', error);
      }
    }
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const saveProfileChanges = async () => {
    const profileData = {
      displayName,
      profilePicture,
    };
    
    try {
      const { error } = await updateProfile(profileData);
      if (error) {
        Alert.alert('Error', error);
      } else {
        setEditModalVisible(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSelectProfilePicture = () => {
    // This would use image picker in a real app
    Alert.alert('Feature', 'Image selection would be implemented here');
    // For now, let's just simulate a selected image
    setProfilePicture('https://randomuser.me/api/portraits/lego/1.jpg');
  };

  const renderEditProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <FontAwesome name="times" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.profilePictureContainer}
              onPress={handleSelectProfilePicture}
            >
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
              ) : (
                <View style={[styles.profilePicturePlaceholder, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.profilePicturePlaceholderText, { color: theme.actionButtonText }]}>
                    {displayName[0].toUpperCase()}
                  </Text>
                  <View style={[styles.editIconContainer, { backgroundColor: theme.accent, borderColor: theme.card }]}>
                    <FontAwesome name="camera" size={14} color={theme.actionButtonText} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Display Name</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.inputBackground, color: theme.text }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: theme.actionButton }]}
            onPress={saveProfileChanges}
          >
            <Text style={[styles.saveButtonText, { color: theme.actionButtonText }]}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity 
          style={[styles.notificationIcon, { backgroundColor: theme.secondary }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <FontAwesome name="bell" size={22} color={theme.text} />
          {/* Notification badge */}
          <View style={[styles.notificationBadge, { backgroundColor: theme.notificationBadge }]}>
            <Text style={[styles.notificationBadgeText, { color: theme.actionButtonText }]}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Premium Subscription Banner */}
        <TouchableOpacity 
          style={[styles.premiumBanner, { 
            backgroundColor: theme.primary,
            shadowColor: theme.shadow,
          }]}
        >
          <View style={styles.premiumContent}>
            <View style={styles.premiumIconContainer}>
              <TouchableOpacity style={[
                styles.premiumBadge, 
                { backgroundColor: theme.accent }
              ]}>
                <FontAwesome name="star" size={24} color={theme.actionButtonText} />
              </TouchableOpacity>
            </View>
            <View style={styles.premiumTextContainer}>
              <Text style={[styles.premiumTitle, { color: theme.actionButtonText }]}>
                Upgrade to Premium
              </Text>
              <Text style={[styles.premiumDescription, { color: theme.actionButtonText }]}>
                Unlock unlimited characters, advanced features and no ads!
              </Text>
            </View>
          </View>
          <View style={[styles.premiumButtonContainer, { backgroundColor: theme.actionButtonText }]}>
            <Text style={[styles.premiumButtonText, { color: theme.primary }]}>
              Try Free for 7 Days
            </Text>
          </View>
        </TouchableOpacity>

        {/* User Info Section */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={[styles.avatarText, { color: theme.actionButtonText }]}>
                  {(displayName[0] || 'U').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.userName, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
          
          <TouchableOpacity 
            style={[styles.editProfileButton, { backgroundColor: theme.secondary }]}
            onPress={handleEditProfile}
          >
            <Text style={[styles.editProfileText, { color: theme.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FontAwesome name="bell" size={20} color={theme.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.text }]}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={notificationsEnabled ? theme.actionButtonText : theme.border}
              ios_backgroundColor={theme.border}
              onValueChange={(value) => toggleSwitch('notifications', value)}
              value={notificationsEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <FontAwesome name="moon-o" size={20} color={theme.text} style={styles.settingIcon} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Theme</Text>
            </View>
            <Switch
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDarkTheme ? theme.actionButtonText : theme.border}
              ios_backgroundColor={theme.border}
              onValueChange={(value) => toggleSwitch('darkTheme', value)}
              value={isDarkTheme}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('FAQ')}
          >
            <View style={styles.menuItemLeft}>
              <FontAwesome name="question-circle" size={20} color={theme.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: theme.text }]}>FAQ</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('Feedback')}
          >
            <View style={styles.menuItemLeft}>
              <FontAwesome name="comment" size={20} color={theme.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: theme.text }]}>Send Feedback</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <FontAwesome name="lock" size={20} color={theme.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <FontAwesome name="file-text" size={20} color={theme.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <FontAwesome name="user-secret" size={20} color={theme.text} style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: theme.text }]}>Privacy Settings</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.secondary }]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <FontAwesome name="sign-out" size={20} color={theme.error} style={styles.logoutIcon} />
          <Text style={[styles.logoutText, { color: theme.error }]}>
            {isLoading ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.textSecondary }]}>Version 1.0.0</Text>
      </ScrollView>

      {renderEditProfileModal()}
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 15,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editProfileText: {
    fontWeight: '600',
  },
  section: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    marginBottom: 20,
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profilePicturePlaceholderText: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumBanner: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    padding: 5,
    paddingBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  premiumIconContainer: {
    marginRight: 15,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  premiumDescription: {
    fontSize: 14,
    opacity: 0.9,
  },
  premiumButtonContainer: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 5,
  },
  premiumButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  premiumBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen; 