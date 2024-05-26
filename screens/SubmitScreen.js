import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,DevSettings, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import InputModal from '../components/InputModal';
import { FontAwesome5 } from '@expo/vector-icons';
import InfoSubmitModal from '../components/InfoSubmitModal';

function SubmitScreen({ route, navigation, api }) {
  // Ekrano kintamieji
  const { groupData, participants, userData } = route.params;
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoSubmitModal, setInfoSubmitModalVisisble] = useState(false)
  const API_URL = api
  console.log(api)


  // Gauti duomenis apie pranešimą
  useEffect(() => {
    getTexts();
  }, []);

  // Gauti duomenis apie žinutes
  const getTexts = async () => {
    try {
      const storedText1 = await AsyncStorage.getItem(`text1_${groupData.name}`);
      if (storedText1 !== null) {
        setText1(storedText1);
      } else {
        const defaultText1 = 'Labas, tu turi padovanoti dovana:';
        // const defaultText1 = 'Tex1:';
        setText1(defaultText1);
        await AsyncStorage.setItem(`text1_${groupData.name}`, defaultText1);
      }

      const storedText2 = await AsyncStorage.getItem(`text2_${groupData.name}`);
      if (storedText2 !== null) {
        setText2(storedText2);
      } else {
        const defaultText2 = 'Dovana už 20Eur. \nData: 2024-12-25';
        // const defaultText2 = 'Text2';
        setText2(defaultText2);
        await AsyncStorage.setItem(`text2_${groupData.name}`, defaultText2);
      }
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko gauti pranešimų.');
    }
  };

  // Išsaugoti 1 žinutę
  const saveText1 = async (text) => {
    try {
      await AsyncStorage.setItem(`text1_${groupData.name}`, text);
      setText1(text);
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko išsaugoti 1 pranešimo.');
    }
  };

  // Išsaugoti 2 žinutę
  const saveText2 = async (text) => {
    try {
      await AsyncStorage.setItem(`text2_${groupData.name}`, text);
      setText2(text);
    } catch (error) {
      Alert.alert('Klaida', 'Nepavyko išsaugoti 2 pranešimo.');
    }
  };

  // Vykdyti SMS siuntimą
  const handleSendSMS = async () => {
    setLoading(true)
    sendSms(userData.UUID, participants, text1, text2)
  };

  // Išsaugoti žinutės redagavimą iš modalinio lango
  const handleModalSave = (savedText1, savedText2) => {
    saveText1(savedText1);
    saveText2(savedText2);
  };

  // Siūsti SMS pranešimus
  const sendSms = async (userData, participants, text1, text2) => {
    try {
      const response = await fetch(`${API_URL}/sendMessages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData, participants, text1, text2 })
      })
      const data = await response.json();
      if (response.ok) {
        navigation.navigate('FinalScreen', { groupData, participants, userData, text1, text2 });
      } else {
        Alert.alert('Klaida:', 'Nepavyko išsiūsti pranešimų!\nKreditai nenuskaičiuoti.\nBandykite vėl!')
        setLoading(false)
      }
    } catch (error) {

    }
  };

  // Rodomi ekrano komponentai
  return (
    <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0.0, y: 0.1 }} end={{ x: 0.5, y: 1.0 }} style={styles.container}>
      <Text style={styles.header}>{groupData.name}</Text>
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome5
          onPress={() => {
            setInfoSubmitModalVisisble(true)
          }}
          name="info-circle"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.subHeading}>Dalyviai: {participants.length}</Text>
      </View>
      <View style={{ justifyContent: 'space-between', flex: 1 }}>
        <View>
          <Text style={{ marginBottom: 5 }}>Siunčiamo pranešimo pavizdys:</Text>
          <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0.0, y: 0.1 }} end={{ x: 0.5, y: 1.0 }} style={[{ borderWidth: 2, borderTopLeftRadius: 35, borderTopRightRadius: 15, padding: 20 }, styles.elevation]}>
            <Text style={{ fontSize: 16 }}>
              <Text>{text1}</Text>
              <Text style={{ fontWeight: 'bold' }}> Martynas</Text>
              <Text>.</Text>
              <Text>{text2}</Text>
            </Text>
          </LinearGradient>
          <TouchableOpacity onPress={() => { setModalVisible(true) }}>
            <LinearGradient style={[styles.sendButton, styles.elevation, { borderRadius: 0, borderTopWidth: 0, borderBottomRightRadius: 35 }]} colors={['#bfe7ff', '#95d5fc']}>
              <Text style={styles.sendButtonText}>Redaguoti</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSendSMS}>
          <LinearGradient style={[styles.sendButton, styles.elevation]} colors={['#bfe7ff', '#95d5fc']}>
            {loading ? (
              <ActivityIndicator color="black" style={{ padding: 5 }} />
            ) : (
              <Text style={styles.sendButtonText}>Išsiūsti pranešimus</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <InputModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onSave={(text1, text2) => {
          handleModalSave(text1, text2)
        }}
        initialText1={text1}
        initialText2={text2}
      />
      <InfoSubmitModal isVisible={infoSubmitModal} onClose={() => { setInfoSubmitModalVisisble(false) }}></InfoSubmitModal>
    </LinearGradient>
  );
}

// Ekrano komponentų stilius
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    fontSize: 24,
    fontWeight: '600',
    paddingBottom: 10,
    marginBottom: 10
  },
  textContainer: {

  },
  label: {
    fontWeight: 'bold'
  },
  sendButton: {
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24
  },
  elevation: {
    elevation: 10,
    shadowColor: '#000363A5'
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    color: 'black'
  },
});

export default SubmitScreen;