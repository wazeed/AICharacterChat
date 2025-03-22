import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

// Helper function to get character background color based on ID
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

// Mock character data
const CHARACTERS = {
  1: { 
    id: 1, 
    name: 'Gandalf', 
    description: 'A wise wizard from Middle-earth, known for his guidance and powerful magic.',
    longDescription: 'Gandalf is a wizard, one of the Istari order, and the leader of the Fellowship of the Ring. He is known for his vast knowledge, magical powers, and deep wisdom. Gandalf often serves as a guide, mentor, and friend to those in need. With his iconic staff and sword Glamdring, Gandalf has faced down demons, dark wizards, and even a Balrog.',
    personality: 'Wise, patient, kind, but firm when needed. Has a good sense of humor and appreciates life\'s simple pleasures.',
    category: 'fantasy',
    traits: ['Wise', 'Magical', 'Compassionate', 'Strategic'],
    knownFor: ['Magic', 'Guiding heroes', 'Fighting the Balrog', 'Fireworks'],
  },
  2: { 
    id: 2, 
    name: 'Marie Curie', 
    description: 'Pioneering physicist and chemist who conducted groundbreaking research on radioactivity.',
    longDescription: 'Marie Curie was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity. She was the first woman to win a Nobel Prize, the first person to win the Nobel Prize twice, and the only person to win the Nobel Prize in two scientific fields. Her achievements included the development of the theory of radioactivity, techniques for isolating radioactive isotopes, and the discovery of two elements, polonium and radium.',
    personality: 'Determined, brilliant, modest, and dedicated to scientific pursuit above personal gain or recognition.',
    category: 'historical',
    traits: ['Brilliant', 'Pioneering', 'Dedicated', 'Humble'],
    knownFor: ['Discovery of radium and polonium', 'Research on radioactivity', 'Nobel Prizes in Physics and Chemistry'],
  },
  3: { 
    id: 3, 
    name: 'Captain Picard', 
    description: 'Captain of the USS Enterprise, known for his diplomatic skills and moral leadership.',
    longDescription: 'Jean-Luc Picard is a Starfleet officer and captain of the USS Enterprise-D and later the USS Enterprise-E. He is known for his moral certainty, diplomatic approach to problem-solving, and intellectual curiosity. Picard is fluent in multiple languages, is an amateur archaeologist, and has a deep appreciation for literature, classical music, and Earl Grey tea.',
    personality: 'Intellectual, diplomatic, ethical, with a strong sense of duty and responsibility.',
    category: 'scifi',
    traits: ['Diplomatic', 'Intelligent', 'Principled', 'Commanding'],
    knownFor: ['Leadership of the Enterprise', 'First Contact with new species', 'Defeating the Borg', 'Shakespearean quotes'],
  },
};

const CharacterDetailScreen = ({ route, navigation }) => {
  const { characterId, character } = route.params || {};
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(true);
  const [characterData, setCharacterData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation on screen load
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Load character data
  useEffect(() => {
    const loadCharacter = async () => {
      setLoading(true);
      try {
        // First try to use the character passed directly
        if (character) {
          setCharacterData(character);
        } 
        // Otherwise try to find by ID in our mock data
        else if (characterId && CHARACTERS[characterId]) {
          setCharacterData(CHARACTERS[characterId]);
        } 
        // Fallback to the Paulo character
        else {
          // If neither is available, this is a development fallback
          setCharacterData(CHARACTERS[1]);
          console.warn('Character not found, using fallback');
        }
      } catch (error) {
        console.error('Error loading character:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId, character]);

  const handleStartChat = () => {
    if (characterData) {
      navigation.navigate('ChatDetail', {
        characterId: characterData.id,
        character: characterData
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Render function with early return
  if (!characterData && loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textLight }]}>
          Loading character...
        </Text>
      </View>
    );
  }

  if (!characterData && !loading) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.textLight }]}>
          Character not found
        </Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.accent }]}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Now we know characterData exists, so continue with render
  const [scrollY] = useState(new Animated.Value(0));
  
  // Get character color based on ID
  const characterColor = getCharacterBackgroundColor(characterData.id, theme);

  // Header opacity animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Animated header */}
      <Animated.View style={[
        styles.animatedHeader, 
        { 
          opacity: headerOpacity,
          backgroundColor: theme.background 
        }
      ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.headerBackButton}
            onPress={handleBackPress}
          >
            <FontAwesome name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {characterData.name}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <FontAwesome name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Character avatar and name */}
        <View style={styles.characterHeader}>
          <View style={[styles.avatar, { backgroundColor: characterColor }]}>
            <Text style={[styles.avatarText, { color: theme.actionButtonText }]}>
              {characterData.name[0]}
            </Text>
          </View>
          <Text style={[styles.characterName, { color: theme.text }]}>{characterData.name}</Text>
          <Text style={[styles.characterCategory, { color: theme.textSecondary }]}>
            {characterData.category.charAt(0).toUpperCase() + characterData.category.slice(1)}
          </Text>
        </View>

        {/* Character description */}
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            {characterData.longDescription}
          </Text>
        </View>

        {/* Character personality */}
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Personality</Text>
          <Text style={[styles.sectionText, { color: theme.textSecondary }]}>
            {characterData.personality}
          </Text>
        </View>

        {/* Character traits */}
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Traits</Text>
          <View style={styles.tagsContainer}>
            {characterData.traits.map((trait, index) => (
              <View style={[styles.tag, { backgroundColor: theme.secondary }]} key={index}>
                <Text style={[styles.tagText, { color: theme.text }]}>{trait}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Known for */}
        <View style={[styles.section, { borderTopColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Known For</Text>
          {characterData.knownFor.map((item, index) => (
            <View style={styles.listItem} key={index}>
              <FontAwesome name="star" size={16} color={theme.primary} style={styles.listIcon} />
              <Text style={[styles.listText, { color: theme.text }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Start Chat button */}
        <TouchableOpacity 
          style={[styles.chatButton, { 
            backgroundColor: theme.actionButton,
            shadowColor: theme.shadow
          }]}
          onPress={handleStartChat}
        >
          <FontAwesome name="comment" size={20} color={theme.actionButtonText} style={styles.chatButtonIcon} />
          <Text style={[styles.chatButtonText, { color: theme.actionButtonText }]}>
            Start Chatting
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: 90,
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerBackButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  characterHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  characterCategory: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listIcon: {
    marginRight: 10,
  },
  listText: {
    fontSize: 16,
    flex: 1,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  chatButtonIcon: {
    marginRight: 10,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CharacterDetailScreen; 