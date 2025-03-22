import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Helper function to get character background color
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

// Mock character data - ideally this would come from a central data store
const CHARACTERS = {
  1: { 
    id: 1, 
    name: 'Paulo', 
    description: '/Can I play ball with the mlk...',
  },
  2: { 
    id: 2, 
    name: 'Nishimura Riki', 
    description: 'Riki |forced marriage for our dad\'s companies 💮',
  },
  3: { 
    id: 3, 
    name: 'biker boy', 
    description: 'He is very selfish but kinda sweet.',
  },
  4: { 
    id: 4, 
    name: 'Charlotte', 
    description: 'Your cousin who is over for the weekend',
  },
  5: { 
    id: 5, 
    name: 'Geralt of Rivia', 
    description: 'The Witcher, monster hunter',
  },
  6: { 
    id: 6, 
    name: 'Sherlock Holmes', 
    description: 'The world\'s greatest detective',
  },
  7: { 
    id: 7, 
    name: 'Hinata Hyuga', 
    description: 'Shy kunoichi from the Hidden Leaf',
  },
  8: { 
    id: 8, 
    name: 'Captain America', 
    description: 'Super soldier with unwavering morals',
  },
};

// Initial messages for different characters
const INITIAL_MESSAGES = {
  1: [
    { id: '1', text: "Hey there! I'm Paulo. What's up?", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  2: [
    { id: '1', text: "Hello. This is Nishimura Riki. Our parents arranged our marriage. What do you think about that?", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  3: [
    { id: '1', text: "Sup. I'm just hanging out. You got something to say?", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  4: [
    { id: '1', text: "Hi! I'm your cousin Charlotte! I'm staying for the weekend. Wanna hang out?", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  5: [
    { id: '1', text: "Hmm. A contract perhaps? What kind of monster troubles you?", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  6: [
    { id: '1', text: "Interesting. Tell me the details of your case and leave nothing out, even the seemingly insignificant details.", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  7: [
    { id: '1', text: "H-hello there. It's nice to meet you...", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  8: [
    { id: '1', text: "Good to meet you, soldier. How can I be of service today?", sender: 'character', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
};

// Character-specific responses
const CHARACTER_RESPONSES = {
  1: [ // Paulo responses
    "Yo, that's cool! I'm all about that vibe.",
    "Want to play some basketball later?",
    "My friends say I'm pretty chill to hang with.",
    "That's interesting. Tell me more about yourself.",
    "I'm just trying to live my best life, you know what I mean?"
  ],
  2: [ // Nishimura Riki responses
    "Our families' companies will benefit greatly from our union.",
    "Perhaps we should get to know each other better before the wedding.",
    "My father expects nothing but perfection from this arrangement.",
    "Do you believe in love, or is business all that matters?",
    "I've been thinking about our future together."
  ],
  3: [ // Biker boy responses
    "Whatever. I don't really care.",
    "You're actually not as boring as I thought.",
    "Don't expect me to be nice all the time.",
    "I might look tough, but I've got a soft side too.",
    "You wanna go for a ride on my bike sometime?"
  ],
  4: [ // Charlotte responses
    "It's been so long since we hung out together!",
    "Do you remember when we used to play together as kids?",
    "My parents said I could stay longer if we get along well.",
    "What's new with you? I want to know everything!",
    "Family is so important, don't you think?"
  ],
  5: [ // Geralt responses
    "Hmm.",
    "Winds howling.",
    "What now, you piece of filth?",
    "Evil is evil. Lesser, greater, middling... it's all the same.",
    "I hate portals."
  ],
  6: [ // Sherlock responses
    "Elementary, my dear friend.",
    "The game is afoot!",
    "You see, but you do not observe.",
    "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
    "Data! Data! Data! I can't make bricks without clay!"
  ],
  7: [ // Hinata responses
    "N-Naruto-kun is my inspiration...",
    "I won't give up, that's my ninja way too!",
    "I'm trying to become stronger everyday.",
    "Sometimes being kind is its own form of strength.",
    "I believe in you!"
  ],
  8: [ // Captain America responses
    "I can do this all day.",
    "When I went under, the world was at war. I wake up, they say we won. They didn't say what we lost.",
    "The price of freedom is high. It always has been. And it's a price I'm willing to pay.",
    "I don't like bullies; I don't care where they're from.",
    "If you start running, they'll never let you stop."
  ]
};

const ChatDetailScreen = ({ route, navigation }) => {
  const { characterId, character } = route.params || {};
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Animation effects on screen load
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Get character data
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
        // Fallback to a default character
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

  // Load initial messages
  useEffect(() => {
    if (characterData) {
      // Simulate initial messages loading
      const initialMessages = [
        {
          id: 1,
          text: `Hi there! I'm ${characterData.name}. ${characterData.description || ''}`,
          sender: 'character',
          createdAt: new Date(Date.now() - 60000 * 3).toISOString(),
        },
        {
          id: 2,
          text: 'How can I help you today?',
          sender: 'character',
          createdAt: new Date(Date.now() - 60000 * 2).toISOString(),
        },
      ];
      setMessages(initialMessages);
    }
  }, [characterData]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      createdAt: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
    
    // Simulate character response after a short delay
    setTimeout(() => {
      if (characterData) {
        const characterResponses = [
          `That's interesting. Tell me more about that.`,
          `I understand. From my perspective as ${characterData.name}, I think...`,
          `Great question! Let me think about that.`,
          `That's a fascinating point. I'd approach it this way...`,
        ];
        
        const randomResponse = characterResponses[Math.floor(Math.random() * characterResponses.length)];
        
        const characterMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'character',
          createdAt: new Date().toISOString(),
        };
        
        setMessages([...updatedMessages, characterMessage]);
        
        // Scroll to bottom again
        setTimeout(() => {
          flatListRef.current?.scrollToEnd();
        }, 100);
      }
    }, 1000);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.textLight }]}>
          Loading conversation...
        </Text>
      </View>
    );
  }

  // Character not found state
  if (!characterData) {
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

  // Render normal chat interface
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Chat Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
        >
          <FontAwesome name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.characterInfo}
          onPress={() => navigation.navigate('CharacterDetail', { characterId, character: characterData })}
        >
          <View 
            style={[
              styles.avatarContainer, 
              { backgroundColor: getCharacterBackgroundColor(characterData.id, theme) }
            ]}
          >
            <Text style={styles.avatarText}>{characterData.name.charAt(0)}</Text>
          </View>
          <Text style={[styles.characterName, { color: theme.text }]}>
            {characterData.name}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <FontAwesome name="ellipsis-v" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.messageContainer, 
              item.sender === 'user' ? styles.userMessage : styles.characterMessage,
              item.sender === 'user' 
                ? { backgroundColor: theme.userMessageBackground } 
                : { backgroundColor: theme.characterMessageBackground }
            ]}
          >
            <Text style={[styles.messageText, { color: theme.text }]}>{item.text}</Text>
            <Text style={[styles.messageTime, { color: theme.textSecondary }]}>
              {formatTime(item.createdAt)}
            </Text>
          </Animated.View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {/* Input Area */}
      <View style={[styles.inputContainer, { borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton, 
            { backgroundColor: theme.primary },
            !inputMessage.trim() && { opacity: 0.5 }
          ]} 
          onPress={sendMessage}
          disabled={!inputMessage.trim()}
        >
          <FontAwesome name="paper-plane" size={20} color={theme.actionButtonText} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  smallAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '85%',
  },
  characterMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '85%',
  },
  characterBubble: {
    borderTopLeftRadius: 5,
  },
  userBubble: {
    borderTopRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginLeft: 15,
    marginBottom: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  typingAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  typingAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
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
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default ChatDetailScreen; 