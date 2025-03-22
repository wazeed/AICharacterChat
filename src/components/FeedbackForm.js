import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getImageSource } from '../utils/ImageUtils';

const FeedbackForm = ({ navigation }) => {
  const { theme } = useTheme();
  const [feedbackText, setFeedbackText] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter feedback text');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending feedback to the server
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Success',
        'Thank you for your feedback!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFeedbackText('');
              setCharacterId('');
              navigation.goBack();
            },
          },
        ]
      );
    }, 1000);
  };

  const handleBackPress = () => {
    if (feedbackText.trim()) {
      Alert.alert(
        'Discard Feedback',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <FontAwesome name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Send Feedback</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        indicatorStyle={theme.isDark ? 'white' : 'black'}
      >
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Feedback Content</Text>
          <TextInput
            style={[styles.feedbackInput, { 
              backgroundColor: theme.inputBackground,
              color: theme.text 
            }]}
            placeholder="Please describe the specific issue for better service."
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={feedbackText}
            onChangeText={setFeedbackText}
            maxLength={500}
          />
          <Text style={[styles.characterCount, { color: theme.textSecondary }]}>{feedbackText.length}/500</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Upload Image <Text style={[styles.optionalText, { color: theme.textSecondary }]}>(Optional)</Text></Text>
          <TouchableOpacity style={[styles.uploadButton, { backgroundColor: theme.inputBackground }]}>
            <FontAwesome name="plus" size={32} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Character CID <Text style={[styles.optionalText, { color: theme.textSecondary }]}>(Optional)</Text></Text>
          <TextInput
            style={[styles.cidInput, { 
              backgroundColor: theme.inputBackground,
              color: theme.text 
            }]}
            placeholder="Please enter the CID of the Character."
            placeholderTextColor={theme.textSecondary}
            value={characterId}
            onChangeText={setCharacterId}
            maxLength={10}
          />
          <Text style={[styles.characterCount, { color: theme.textSecondary }]}>{characterId.length}/10</Text>
          
          <View style={styles.infoContainer}>
            <FontAwesome name="info-circle" size={16} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Copy CID to paste, manually enter, or upload Character's profile screenshot.
            </Text>
          </View>

          <View style={[styles.cidExampleContainer, { backgroundColor: theme.secondary }]}>
            <Image 
              source={getImageSource('cid-example')} 
              style={styles.cidExampleImage} 
            />
            <View style={styles.generateButtonContainer}>
              <TouchableOpacity style={[styles.generateButton, { backgroundColor: theme.primary }]}>
                <Text style={[styles.generateButtonText, { color: theme.actionButtonText }]}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.submitButton, 
          { backgroundColor: feedbackText.trim() ? theme.actionButton : theme.textSecondary }
        ]}
        onPress={handleSubmit}
        disabled={!feedbackText.trim() || isSubmitting}
      >
        <Text style={[styles.submitButtonText, { color: theme.actionButtonText }]}>
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
  headerRight: {
    width: 36,
  },
  scrollContent: {
    padding: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionalText: {
    fontSize: 14,
    fontWeight: 'normal',
  },
  feedbackInput: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
  },
  cidInput: {
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    height: 56,
  },
  characterCount: {
    alignSelf: 'flex-end',
    marginTop: 8,
    fontSize: 14,
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  cidExampleContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cidExampleImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  generateButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  generateButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  generateButtonText: {
    fontWeight: 'bold',
  },
  submitButton: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackForm; 