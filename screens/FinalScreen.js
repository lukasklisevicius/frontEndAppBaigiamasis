import React, { useEffect } from 'react';
import { View, StyleSheet, Text, BackHandler, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';

const FinalScreen = ({ route }) => {
  // Ekrano kintamieji
  const { groupData, participants } = route.params;
  const navigation = useNavigation();

  // Išjungiama galimybė grįžti į praeitą psulapį
  useEffect(() => {
    const handleBackPress = () => true;
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  // Grįžtame į pagrindinį programos ekraną
  const goHome = () => {
    navigation.navigate('Home');
  };

  // Rodomi Ekrano komponentai
  return (
    <LinearGradient
      colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']}
      start={{ x: 0.0, y: 0.1 }}
      end={{ x: 0.5, y: 1.0 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 35 }}>
        <Text style={{ fontSize: 48, fontWeight: 600, marginBottom: 10 }}>Sveikiname!</Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Slaptieji kalėdų seneliai paskirstyti!</Text>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          <Text>Visiems </Text>
          <Text style={{ fontWeight: 600 }}>{participants.length} </Text>
          <Text>grupės </Text>
          <Text style={{ fontWeight: 600, textTransform: 'uppercase' }}>{groupData.name} </Text>
          <Text>dalyviams, </Text>
          <Text>Išsiūsti trumpieji SMS pranešimai.</Text>
        </Text>
        <Text style={{ fontSize: 24, fontWeight: 600, marginVertical: 10 }}>Linksmos šventės!</Text>
      </View>
      <View style={{ width: '100%', padding: 35 }}>
        <TouchableOpacity onPress={goHome}>
          <LinearGradient style={[styles.submitButton, styles.elevation]} colors={['#bfe7ff', '#95d5fc']}>
            <Text style={styles.submitButtonText}>Į pradžią</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

// Komponentų stilius
const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 50,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
  },
  elevation: {
    shadowOpacity: 0.85,
    shadowRadius: 5,
    elevation: 6,
    shadowColor: '#000363',
  },
});

export default FinalScreen;