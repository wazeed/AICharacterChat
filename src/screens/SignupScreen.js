import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  Animated,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Character avatars for floating effect - matching login screen
const FLOATING_AVATARS = [
  { id: 1, position: { top: '8%', left: '15%' }, size: 65, opacity: 0.9 },
  { id: 2, position: { top: '12%', right: '18%' }, size: 75, opacity: 0.85 },
  { id: 3, position: { top: '20%', left: '25%' }, size: 55, opacity: 0.8 },
  { id: 4, position: { top: '15%', right: '28%' }, size: 60, opacity: 0.75 },
  { id: 5, position: { top: '6%', left: '38%' }, size: 45, opacity: 0.7 },
  { id: 6, position: { top: '25%', right: '15%' }, size: 50, opacity: 0.8 },
  { id: 7, position: { top: '23%', left: '12%' }, size: 40, opacity: 0.7 },
  { id: 8, position: { top: '30%', right: '35%' }, size: 42, opacity: 0.9 },
];

const SignupScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      // Add sparkling effect animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
      // Add subtle rotation animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 12000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Sign Up Error', 'Please enter both email and password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Sign Up Error', 'Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await signUp(email, password);
      
      if (error) {
        Alert.alert('Sign Up Error', error.message);
      }
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Enhanced floating avatars with star-like qualities
  const renderFloatingAvatars = () => {
    return FLOATING_AVATARS.map(avatar => {
      const pulseAnim = useRef(new Animated.Value(1)).current;
      const individualRotate = useRef(new Animated.Value(0)).current;
      
      useEffect(() => {
        // Pulse animation for avatar size
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.08,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 2000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
        
        // Individual subtle rotation for each avatar
        Animated.loop(
          Animated.timing(individualRotate, {
            toValue: 1,
            duration: 10000 + Math.random() * 5000,
            useNativeDriver: true,
          })
        ).start();
      }, []);
      
      // Calculate rotation based on individual avatar animation
      const avatarRotate = individualRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });
      
      return (
        <Animated.View
          key={avatar.id}
          style={[
            styles.floatingAvatar,
            {
              width: avatar.size,
              height: avatar.size,
              borderRadius: avatar.size / 2,
              opacity: avatar.opacity,
              ...avatar.position,
              transform: [
                { scale: pulseAnim },
                { rotate: avatarRotate },
              ],
            },
          ]}
        >
          <Animated.View
            style={{
              position: 'absolute',
              width: '100%', 
              height: '100%',
              borderRadius: avatar.size / 2,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              opacity: sparkleAnim,
            }}
          />
          <ImageBackground
            source={{ uri: `https://picsum.photos/400/400?random=${avatar.id + 10}` }}
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: avatar.size / 2,
            }}
            imageStyle={{ borderRadius: avatar.size / 2 }}
          />
        </Animated.View>
      );
    });
  };

  // Add a subtle background stars effect
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

  // Calculate the rotation from the animation value
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Artistic background with overlay */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80' }}
          style={styles.backgroundImage}
        >
          {/* Add subtle star background */}
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          
          <LinearGradient
            colors={['rgba(31, 42, 104, 0.85)', 'rgba(27, 32, 101, 0.9)', 'rgba(65, 41, 90, 0.95)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
          
          {/* Rotation container for the avatar animation */}
          <Animated.View style={[
            styles.rotationContainer,
            { transform: [{ rotate: spin }] }
          ]}>
            {/* Avatars Animation Area - More evenly distributed */}
            <View style={styles.avatarContainer}>
              {renderFloatingAvatars()}
            </View>
          </Animated.View>
          
          {/* App logo at top with better styling */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>CHARACTER.AI</Text>
            <View style={styles.logoUnderline} />
          </View>
          
          {/* Main Content - Reorganized */}
          <Animated.View style={[
            styles.contentContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}>
            <View style={styles.titleContainer}>
              <Text style={styles.appTitle}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join our community and start chatting with AI characters
              </Text>
            </View>

            <View style={styles.spacer} />
            
            {/* Signup Form */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupHeading}>Sign Up</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(0,0,0,0.6)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(0,0,0,0.6)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(0,0,0,0.6)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={styles.signupButton}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By signing up, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms</Text> and acknowledge our{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.hasAccountButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.hasAccountText}>
                  Already have an account? <Text style={styles.loginText}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  rotationContainer: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    left: width * -0.25,
    top: -100,
  },
  logoContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  logoUnderline: {
    width: 40,
    height: 3,
    backgroundColor: '#5A66E8',
    marginTop: 6,
    borderRadius: 2,
  },
  avatarContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1,
  },
  floatingAvatar: {
    position: 'absolute',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 120,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  spacer: {
    flex: 1,
  },
  signupContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  signupHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  signupButton: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#5A66E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  termsContainer: {
    marginTop: 16,
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
  },
  termsLink: {
    color: '#5A66E8',
    fontWeight: '500',
  },
  hasAccountButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 10,
  },
  hasAccountText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.8)',
  },
  loginText: {
    color: '#5A66E8',
    fontWeight: 'bold',
  },
});

export default SignupScreen; 