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
  const { characterId } = route.params;
  // Convert characterId to number to ensure it works with numeric keys
  const numericCharacterId = Number(characterId);
  const character = CHARACTERS[numericCharacterId];
  const { theme } = useTheme();
  
  const [messages, setMessages] = useState(INITIAL_MESSAGES[numericCharacterId] || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);
  
  // For typing animation
  const typingOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Animation for typing indicator
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingOpacity, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      typingOpacity.setValue(0);
    }
  }, [isTyping, typingOpacity]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate character response after delay
    setTimeout(() => {
      // Random response from character's preset responses
      const responses = CHARACTER_RESPONSES[numericCharacterId] || [];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const characterMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse || "Interesting...",
        sender: 'character',
        timestamp: new Date().toISOString(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, characterMessage]);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }) => {
    const isCharacter = item.sender === 'character';
    const characterColor = getCharacterBackgroundColor(numericCharacterId, theme);
    
    return (
      <View style={[styles.messageContainer, isCharacter ? styles.characterMessage : styles.userMessage]}>
        {isCharacter && (
          <View style={[styles.avatar, { backgroundColor: characterColor }]}>
            <Text style={[styles.avatarText, { color: theme.actionButtonText }]}>{character.name[0]}</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble, 
          isCharacter 
            ? [styles.characterBubble, { backgroundColor: theme.messageBubbleReceived }] 
            : [styles.userBubble, { backgroundColor: theme.messageBubbleSent }]
        ]}>
          <Text style={[styles.messageText, { color: theme.text }]}>{item.text}</Text>
          <Text style={[styles.timestamp, { color: theme.textSecondary }]}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  if (!character) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <FontAwesome name="exclamation-circle" size={50} color={theme.danger} />
        <Text style={[styles.errorText, { color: theme.text }]}>Character not found</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: theme.actionButtonText }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const characterColor = getCharacterBackgroundColor(numericCharacterId, theme);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: theme.background,
        borderBottomColor: theme.border
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={[styles.smallAvatar, { backgroundColor: characterColor }]}>
            <Text style={[styles.smallAvatarText, { color: theme.actionButtonText }]}>{character.name[0]}</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{character.name}</Text>
        </View>
        <TouchableOpacity style={styles.infoButton} onPress={() => navigation.navigate('CharacterDetail', { characterId })}>
          <FontAwesome name="info-circle" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing indicator */}
      {isTyping && (
        <Animated.View style={[
          styles.typingIndicator, 
          { opacity: typingOpacity, backgroundColor: theme.card }
        ]}>
          <View style={[styles.typingAvatar, { backgroundColor: characterColor }]}>
            <Text style={[styles.typingAvatarText, { color: theme.actionButtonText }]}>{character.name[0]}</Text>
          </View>
          <View style={styles.typingBubble}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, { backgroundColor: theme.textSecondary }]} />
              <View style={[styles.typingDot, { backgroundColor: theme.textSecondary }]} />
              <View style={[styles.typingDot, { backgroundColor: theme.textSecondary }]} />
            </View>
          </View>
        </Animated.View>
      )}

      {/* Input area */}
      <View style={[styles.inputContainer, { 
        backgroundColor: theme.card,
        borderTopColor: theme.border
      }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: theme.border
          }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
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
});

export default ChatDetailScreen; 