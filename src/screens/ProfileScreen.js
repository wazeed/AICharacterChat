import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Mock user data
const USER_DATA = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  joinDate: 'Member since October 2023',
  profileImage: null,
};

// Mock settings sections with corresponding screens
const SETTINGS_SECTIONS = [
  {
    id: 'appearance',
    title: 'Appearance',
    items: [
      { id: 'darkMode', title: 'Dark Mode', type: 'toggle' },
      { id: 'theme', title: 'Theme', type: 'link', value: 'Cosmic', screen: 'ThemeSettings' },
      { id: 'language', title: 'Language', type: 'link', value: 'English', screen: 'LanguageSettings' },
    ],
  },
  {
    id: 'preferences',
    title: 'Chat Preferences',
    items: [
      { id: 'notifications', title: 'Notifications', type: 'toggle', value: true },
      { id: 'sounds', title: 'Chat Sounds', type: 'toggle', value: true },
      { id: 'largeText', title: 'Large Text', type: 'toggle', value: false },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      { id: 'subscription', title: 'Subscription', type: 'link', value: 'Pro', screen: 'SubscriptionSettings' },
      { id: 'privacy', title: 'Privacy', type: 'link', screen: 'PrivacySettings' },
      { id: 'data', title: 'Data & Storage', type: 'link', screen: 'DataSettings' },
    ],
  },
  {
    id: 'support',
    title: 'Help & Support',
    items: [
      { id: 'faq', title: 'FAQ', type: 'link', screen: 'FAQ' },
      { id: 'contact', title: 'Contact Us', type: 'link', screen: 'ContactUs' },
      { id: 'about', title: 'About', type: 'link', value: 'v1.0.0', screen: 'About' },
    ],
  },
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

// Animated setting item component
const SettingItem = ({ item, index, onToggle, onPress, theme, sectionIndex }) => {
  const translateX = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        delay: (index * 70) + (sectionIndex * 100),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: (index * 70) + (sectionIndex * 100),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <Animated.View
      style={[
        styles.settingItemContainer,
        {
          opacity,
          transform: [{ translateX }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => item.type === 'link' && onPress(item)}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.settingItemGradient}
        >
          <View style={styles.settingItemContent}>
            <Text style={styles.settingItemTitle}>{item.title}</Text>
            
            {item.type === 'toggle' ? (
              <Switch
                value={item.value}
                onValueChange={(value) => onToggle(item.id, value)}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: theme.accent }}
                thumbColor="#fff"
                ios_backgroundColor="rgba(255,255,255,0.1)"
              />
            ) : item.value ? (
              <View style={styles.settingItemValueContainer}>
                <Text style={styles.settingItemValue}>{item.value}</Text>
                <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.6)" style={{ marginLeft: 8 }} />
              </View>
            ) : (
              <FontAwesome name="chevron-right" size={14} color="rgba(255,255,255,0.6)" />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isDarkTheme, toggleTheme, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || 'User');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userSettings, setUserSettings] = useState(SETTINGS_SECTIONS);
  
  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const profileInfoOpacity = useRef(new Animated.Value(0)).current;
  const profileInfoScale = useRef(new Animated.Value(0.95)).current;
  const dividerWidth = useRef(new Animated.Value(0)).current;
  const logoutButtonOpacity = useRef(new Animated.Value(0)).current;
  const logoutButtonTranslateY = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
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
      Animated.parallel([
        Animated.timing(profileInfoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(profileInfoScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(dividerWidth, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.parallel([
        Animated.timing(logoutButtonOpacity, {
          toValue: 1,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoutButtonTranslateY, {
          toValue: 0,
          duration: 500,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);
  
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
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

  const handleToggleSetting = (settingId, value) => {
    // Special case for dark mode toggle
    if (settingId === 'darkMode') {
      toggleTheme();
    }
    
    // Update the settings state
    const updatedSettings = userSettings.map(section => ({
      ...section,
      items: section.items.map(item => 
        item.id === settingId ? { ...item, value } : item
      ),
    }));
    
    setUserSettings(updatedSettings);
  };
  
  const handleSettingPress = (item) => {
    // Check if the screen exists before navigating
    if (item.screen) {
      // Special handling for screens that need parameters
      if (item.screen === 'FAQ') {
        navigation.navigate('FAQ');
      } else if (item.screen === 'Feedback') {
        navigation.navigate('Feedback');
      } else if (item.screen === 'Notifications') {
        navigation.navigate('Notifications');
      } else if (item.screen === 'Home') {
        navigation.navigate('Home');
      } else if (item.screen === 'Explore') {
        navigation.navigate('Explore');
      } else if (item.screen === 'Chats') {
        navigation.navigate('Chats');
      } else {
        // For screens that might not be fully implemented yet
        Alert.alert(
          'Coming Soon',
          `The ${item.title} feature will be available in a future update.`,
          [{ text: 'OK', onPress: () => console.log(`Navigate to ${item.screen} canceled`) }]
        );
      }
    } else if (item.action === 'logout') {
      handleLogout();
    } else if (item.action === 'editProfile') {
      handleEditProfile();
    } else if (item.action) {
      // For other custom actions
      Alert.alert(
        'Feature',
        `This would trigger the ${item.action} action`,
        [{ text: 'OK', onPress: () => console.log(`Action ${item.action} triggered`) }]
      );
    }
  };

  const handleStatPress = (statType) => {
    // Navigate to appropriate screen based on stat type
    switch (statType) {
      case 'characters':
        navigation.navigate('Explore');
        break;
      case 'chats':
        navigation.navigate('Chats');
        break;
      default:
        Alert.alert(
          'Coming Soon',
          'This feature will be available in a future update.',
          [{ text: 'OK' }]
        );
    }
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=1700' }}
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
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <Text style={styles.headerTitle}>Profile</Text>
          </Animated.View>
          
          {/* Profile Info Card */}
          <Animated.View
            style={[
              styles.profileCard,
              {
                opacity: profileInfoOpacity,
                transform: [{ scale: profileInfoScale }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileCardGradient}
            >
              <View style={styles.profileInfo}>
                <View style={styles.profileAvatarContainer}>
                  <LinearGradient
                    colors={[theme.primary, theme.accent]}
                    style={styles.profileAvatar}
                  >
                    <Text style={styles.profileAvatarText}>
                      {USER_DATA.name.charAt(0)}
                    </Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.profileDetails}>
                  <Text style={styles.profileName}>{USER_DATA.name}</Text>
                  <Text style={styles.profileEmail}>{USER_DATA.email}</Text>
                  <Text style={styles.profileDate}>{USER_DATA.joinDate}</Text>
                </View>
              </View>
              
              <Animated.View
                style={[
                  styles.divider,
                  {
                    width: dividerWidth.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
              
              <View style={styles.profileStats}>
                <TouchableOpacity 
                  style={styles.statItem}
                  onPress={() => handleStatPress('characters')}
                >
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Characters</Text>
                </TouchableOpacity>
                
                <View style={styles.statDivider} />
                
                <TouchableOpacity 
                  style={styles.statItem}
                  onPress={() => handleStatPress('chats')}
                >
                  <Text style={styles.statValue}>48</Text>
                  <Text style={styles.statLabel}>Chats</Text>
                </TouchableOpacity>
                
                <View style={styles.statDivider} />
                
                <TouchableOpacity 
                  style={styles.statItem}
                  onPress={() => handleStatPress('subscription')}
                >
                  <Text style={styles.statValue}>3</Text>
                  <Text style={styles.statLabel}>Months</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
          
          {/* Settings Sections */}
          {userSettings.map((section, sectionIndex) => (
            <View key={section.id} style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              {section.items.map((item, index) => (
                <SettingItem
                  key={item.id}
                  item={item}
                  index={index}
                  sectionIndex={sectionIndex}
                  onToggle={handleToggleSetting}
                  onPress={handleSettingPress}
                  theme={theme}
                />
              ))}
            </View>
          ))}
          
          {/* Logout Button */}
          <Animated.View
            style={[
              styles.logoutButtonContainer,
              {
                opacity: logoutButtonOpacity,
                transform: [{ translateY: logoutButtonTranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoutButtonGradient}
              >
                <View style={styles.logoutContent}>
                  <FontAwesome name="sign-out" size={20} color={theme.error} style={styles.logoutIcon} />
                  <Text style={[styles.logoutText, { color: theme.error }]}>
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      </ImageBackground>

      {renderEditProfileModal()}
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
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileCardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatarContainer: {
    marginRight: 15,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 15,
    alignSelf: 'center',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
    marginLeft: 8,
  },
  settingItemContainer: {
    marginBottom: 10,
  },
  settingItem: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItemGradient: {
    padding: 16,
    borderRadius: 14,
  },
  settingItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  settingItemValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  logoutButtonContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutButtonGradient: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: 'rgba(255, 255, 255, 0.4)',
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
});

export default ProfileScreen; 