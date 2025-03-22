import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const orbitAnim = useRef(new Animated.Value(0)).current;
  
  // Animated dots values
  const dotAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Define character colors based on theme
  const characterColors = [
    theme.primary,
    theme.accent1,
    theme.accent2,
    theme.accent3,
    theme.secondary
  ];

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      
      // Start orbiting animation
      Animated.loop(
        Animated.timing(orbitAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Animate dots sequentially with loop
    const animateDots = () => {
      Animated.stagger(200, [
        Animated.timing(dotAnims[0], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnims[1], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dotAnims[2], {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        dotAnims.forEach(anim => anim.setValue(0));
        setTimeout(animateDots, 300);
      });
    };

    // Start the dots animation
    setTimeout(animateDots, 1000);
  }, [fadeAnim, scaleAnim, orbitAnim, dotAnims]);

  // Calculate orbital animation transforms
  const orbitalRotation = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Create five orbital characters with different positions
  const orbitalPositions = [0, 72, 144, 216, 288].map(angle => {
    return {
      transform: [
        { rotate: `${angle}deg` },
        { translateX: 120 },
        { rotate: orbitalRotation },
      ],
    };
  });

  // Dot opacity animations
  const dotOpacities = dotAnims.map(anim => 
    anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.2, 1, 0.2],
    })
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background orbital circles */}
      <View style={styles.orbitalBackground}>
        <View style={[styles.orbitalCircle, styles.orbitalCircle1, { borderColor: theme.border }]} />
        <View style={[styles.orbitalCircle, styles.orbitalCircle2, { borderColor: theme.border }]} />
        <View style={[styles.orbitalCircle, styles.orbitalCircle3, { borderColor: theme.border }]} />
      </View>

      {/* Orbital characters */}
      <View style={styles.orbitalContainer}>
        {orbitalPositions.map((style, index) => (
          <Animated.View key={index} style={[styles.orbitalCharacter, style]}>
            <View 
              style={[
                styles.characterAvatar, 
                { backgroundColor: characterColors[index % 5] }
              ]}
            >
              <Text style={[styles.characterText, { color: theme.text }]}>
                {['G', 'M', 'P', 'S', 'A'][index % 5]}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* App Logo */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[styles.logo, { backgroundColor: theme.primary }]}>
          <FontAwesome name="comments" size={50} color={theme.text} />
        </View>
        <Text style={[styles.appName, { color: theme.text }]}>AI Chat</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.loadingContainer}>
        {dotOpacities.map((opacity, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles.loadingDot,
              { opacity, backgroundColor: theme.primary }
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitalBackground: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitalCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitalCircle1: {
    width: 480,
    height: 480,
  },
  orbitalCircle2: {
    width: 360,
    height: 360,
  },
  orbitalCircle3: {
    width: 240,
    height: 240,
  },
  orbitalContainer: {
    position: 'absolute',
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitalCharacter: {
    position: 'absolute',
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default SplashScreen; 