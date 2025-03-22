import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ScrollableContent from './ScrollableContent';

// FAQ data
const faqData = [
  {
    id: 1,
    question: 'What is AI Character Chat?',
    answer: 'AI Character Chat is a platform that allows you to have conversations with AI characters representing various personalities, from fictional characters to professional roles.',
  },
  {
    id: 2,
    question: 'How do I start a chat with a character?',
    answer: 'Browse the available characters in the Explore tab, select one that interests you, and tap the "Chat" button on their profile page to begin a conversation.',
  },
  {
    id: 3,
    question: 'Are my conversations private?',
    answer: 'Yes, your conversations are private by default. We take data privacy seriously and only store conversations to improve our service, with strict access controls in place.',
  },
  {
    id: 4,
    question: 'What\'s the difference between free and premium characters?',
    answer: 'Free characters offer basic conversation experiences, while premium characters provide more in-depth knowledge, personality traits, and longer conversation history.',
  },
  {
    id: 5,
    question: 'Can I create my own character?',
    answer: 'Yes! You can create your own character by tapping the + button at the bottom of the screen, then following the character creation process.',
  },
  {
    id: 6,
    question: 'How does billing work?',
    answer: 'We offer both free and premium subscription plans. Premium subscriptions are billed monthly or annually and can be managed through your account settings.',
  },
  {
    id: 7,
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time through the app\'s settings. Your access will continue until the end of your current billing period.',
  },
];

const FAQItem = ({ item, isOpen, onToggle, theme }) => {
  return (
    <View style={[styles.faqItem, { borderColor: theme.border }]}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={onToggle}
      >
        <Text style={[styles.questionText, { color: theme.text }]}>{item.question}</Text>
        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.text}
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.faqAnswer}>
          <Text style={[styles.answerText, { color: theme.textSecondary }]}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const FAQScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [openFAQs, setOpenFAQs] = useState([]);

  const toggleFAQ = (index) => {
    if (openFAQs.includes(index)) {
      setOpenFAQs(openFAQs.filter(item => item !== index));
    } else {
      setOpenFAQs([...openFAQs, index]);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <FontAwesome name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>FAQ</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollableContent
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Frequently Asked Questions
        </Text>
        {faqData.map((item, index) => (
          <FAQItem 
            key={item.id}
            item={item}
            isOpen={openFAQs.includes(index)}
            onToggle={() => toggleFAQ(index)}
            theme={theme}
          />
        ))}
      </ScrollableContent>
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
  headerRight: {
    width: 36,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  faqItem: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
  },
  moreHelpContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  moreHelpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  moreHelpText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default FAQScreen; 