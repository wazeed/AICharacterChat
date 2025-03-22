import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SHADOWS, BACKGROUND_IMAGES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Mock user data
const USER = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null,
  premium: false,
  joinDate: 'August 2023',
  charactersCreated: 5,
  charactersInteractions: 128,
};

// Settings sections
const SETTINGS_SECTIONS = [
  {
    title: 'App Settings',
    items: [
      { id: 'darkMode', icon: 'moon-o', label: 'Dark Mode', type: 'toggle', value: true },
      { id: 'notifications', icon: 'bell', label: 'Notifications', type: 'toggle', value: true },
      { id: 'sound', icon: 'volume-up', label: 'Sound Effects', type: 'toggle', value: true },
      { id: 'language', icon: 'language', label: 'Language', type: 'option', value: 'English' },
    ],
  },
  {
    title: 'Account Settings',
    items: [
      { id: 'editProfile', icon: 'user-circle', label: 'Edit Profile', type: 'navigate' },
      { id: 'password', icon: 'lock', label: 'Change Password', type: 'navigate' },
      { id: 'premium', icon: 'star', label: 'Premium Subscription', type: 'navigate' },
      { id: 'privacy', icon: 'shield', label: 'Privacy Settings', type: 'navigate' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', icon: 'question-circle', label: 'Help Center', type: 'navigate' },
      { id: 'feedback', icon: 'comment', label: 'Send Feedback', type: 'navigate' },
      { id: 'about', icon: 'info-circle', label: 'About App', type: 'navigate' },
    ],
  },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout, isDarkTheme, toggleTheme, updateProfile } = useAuth();
  const { theme, isDark } = useTheme();
  const [settings, setSettings] = useState(SETTINGS_SECTIONS);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const profileScaleAnim = useRef(new Animated.Value(0.95)).current;
  
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
      Animated.timing(profileScaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Update dark mode toggle to match theme
    const updatedSettings = [...settings];
    const appSettings = updatedSettings[0];
    const darkModeItem = appSettings.items.find(item => item.id === 'darkMode');
    if (darkModeItem) {
      darkModeItem.value = isDark;
      setSettings(updatedSettings);
    }
  }, [isDark]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await logout();
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingToggle = (sectionIndex, itemIndex) => {
    const updatedSettings = [...settings];
    const item = updatedSettings[sectionIndex].items[itemIndex];
    
    if (item.id === 'darkMode') {
      toggleTheme();
    } else {
      item.value = !item.value;
      setSettings(updatedSettings);
    }
  };

  const handleSettingPress = (item) => {
    if (item.type === 'navigate') {
      // Navigate to respective screen
      console.log(`Navigate to: ${item.id}`);
    }
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

  const renderSettingItem = (item, sectionIndex, itemIndex) => (
    <Animated.View
      key={item.id}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(itemIndex + 1)) }],
      }}
    >
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => item.type === 'toggle' 
          ? handleSettingToggle(sectionIndex, itemIndex) 
          : handleSettingPress(item)
        }
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
          style={styles.settingItemGradient}
        >
          <View style={styles.settingItemContent}>
            <View style={styles.settingIconContainer}>
              <FontAwesome name={item.icon} size={20} color={COLORS.primary} />
            </View>
            
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            
            {item.type === 'toggle' ? (
              <Switch
                value={item.value}
                onValueChange={() => handleSettingToggle(sectionIndex, itemIndex)}
                trackColor={{ false: COLORS.gray, true: COLORS.primaryLight }}
                thumbColor={item.value ? COLORS.primary : COLORS.lightGray}
              />
            ) : item.type === 'option' ? (
              <View style={styles.settingValueContainer}>
                <Text style={styles.settingValue}>{item.value}</Text>
                <FontAwesome name="chevron-right" size={14} color={COLORS.textMuted} />
              </View>
            ) : (
              <FontAwesome name="chevron-right" size={14} color={COLORS.textMuted} />
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

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
        
        <Animated.View
          style={{
            opacity: headerFadeAnim,
            transform: [{ scale: profileScaleAnim }],
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
          
          <View style={styles.profileContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              style={styles.profileGradient}
            >
              <View style={styles.profileContent}>
                <View style={styles.avatarContainer}>
                  {USER.avatar ? (
                    <Image source={{ uri: USER.avatar }} style={styles.avatar} />
                  ) : (
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.secondary]}
                      style={styles.avatarPlaceholder}
                    >
                      <Text style={styles.avatarText}>{USER.name.charAt(0)}</Text>
                    </LinearGradient>
                  )}
                  
                  {USER.premium && (
                    <View style={styles.premiumBadge}>
                      <FontAwesome name="star" size={12} color={COLORS.white} />
                    </View>
                  )}
                </View>
                
                <Text style={styles.userName}>{USER.name}</Text>
                <Text style={styles.userEmail}>{USER.email}</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{USER.charactersCreated}</Text>
                    <Text style={styles.statLabel}>Characters</Text>
                  </View>
                  
                  <View style={styles.statDivider} />
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{USER.charactersInteractions}</Text>
                    <Text style={styles.statLabel}>Interactions</Text>
                  </View>
                  
                  <View style={styles.statDivider} />
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{USER.joinDate}</Text>
                    <Text style={styles.statLabel}>Joined</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {settings.map((section, sectionIndex) => (
            <View key={section.title} style={styles.settingSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => 
                  renderSettingItem(item, sectionIndex, itemIndex)
                )}
              </View>
            </View>
          ))}
          
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginTop: 30,
              marginBottom: 50,
            }}
          >
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LinearGradient
                colors={[COLORS.danger, COLORS.dangerDark]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.logoutButtonGradient}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileContainer: {
    marginHorizontal: 20,
    borderRadius: COLORS.cardRadius,
    overflow: 'hidden',
    marginBottom: 25,
    ...SHADOWS.medium,
  },
  profileGradient: {
    borderRadius: COLORS.cardRadius,
    padding: 20,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  settingSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionContent: {
    borderRadius: COLORS.cardRadius,
    overflow: 'hidden',
  },
  settingItem: {
    marginBottom: 2,
    borderRadius: COLORS.cardRadius,
    overflow: 'hidden',
  },
  settingItemGradient: {
    padding: 15,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(90, 102, 232, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginRight: 10,
  },
  logoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  logoutButtonGradient: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 