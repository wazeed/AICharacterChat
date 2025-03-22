import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { supabase } from '../services/supabase';
import { useTheme } from '../context/ThemeContext';
import { sizes } from '../constants/sizes';
import { FontAwesome } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'io.supabase.aicharacterchat://reset-password',
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setResetSent(true);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Background with orbital circles */}
        <View style={styles.backgroundCircles}>
          <View style={[styles.outerCircle, { borderColor: theme.border }]} />
          <View style={[styles.middleCircle, { borderColor: theme.border }]} />
          <View style={[styles.innerCircle, { borderColor: theme.border }]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Reset Password</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.content}>
          {resetSent ? (
            <View style={styles.successContainer}>
              <View style={styles.iconContainer}>
                <FontAwesome name="check-circle" size={60} color={theme.success} />
              </View>
              <Text style={[styles.title, { color: theme.text }]}>Reset Email Sent</Text>
              <Text style={[styles.message, { color: theme.textSecondary }]}>
                We've sent password reset instructions to your email. Please check your inbox.
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.buttonText, { color: theme.actionButtonText }]}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={[styles.title, { color: theme.text }]}>Forgot Your Password?</Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Enter your email below to receive password reset instructions
              </Text>

              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.inputBackground,
                  color: theme.text 
                }]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[
                  styles.button, 
                  { backgroundColor: theme.primary },
                  { opacity: isLoading ? 0.7 : 1 }
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, { color: theme.actionButtonText }]}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: theme.inputBackground }]}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Return to Login</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundCircles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
    width: sizes.width * 1.2,
    height: sizes.width * 1.2,
    borderRadius: sizes.width * 0.6,
    borderWidth: 1,
  },
  middleCircle: {
    position: 'absolute',
    width: sizes.width * 0.9,
    height: sizes.width * 0.9,
    borderRadius: sizes.width * 0.45,
    borderWidth: 1,
  },
  innerCircle: {
    position: 'absolute',
    width: sizes.width * 0.6,
    height: sizes.width * 0.6,
    borderRadius: sizes.width * 0.3,
    borderWidth: 1,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
  },
  successContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
});

export default ForgotPasswordScreen; 