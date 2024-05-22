import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Entypo, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AddContactModal from '../components/AddContactModal';
import EditContactModal from '../components/EditContactModal';
import InfoGroupModal from '../components/InfoGroupModal';


function GroupScreen({ route, userData }) {
  // Ekrano kintamieji
  const { groupData } = route.params;
  const [participants, setParticipants] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

  const [editedParticipantIndex, setEditedParticipantIndex] = useState(null);
  const [editedParticipantName, setEditedParticipantName] = useState('');
  const [editedParticipantPhoneNumber, setEditedParticipantPhoneNumber] = useState('');

  const [infoGroupModal, setInfoGroupModalVisisble] = useState(false)

  // navigacijos kintamasis
  const navigation = useNavigation();

  // Užkrovus ekraną gauti duomenis
  useEffect(() => {
    fetchData();
  }, []);

  // Atnaujinti dalyvių skaičių
  useEffect(() => {
    setParticipantCount(participants.length);
  }, [participants]);

  // Gauti duomenis apie grupėje išsaugotus dalyvius
  const fetchData = async () => {
    try {
      const storedParticipants = await AsyncStorage.getItem(`participants_${groupData.name}`);
      if (storedParticipants) {
        setParticipants(JSON.parse(storedParticipants));
      }
    } catch (error) {
      console.error('Error fetching participants from AsyncStorage:', error);
    }
  };

  // Tikrinti pasikartojančius dalyvių duomenis
  // const checkDuplicate = (name, phoneNumber) => {
  //   const isDuplicateName = participants.some(participant => participant.name === name);
  //   const isDuplicatePhoneNumber = participants.some(participant => participant.phoneNumber === phoneNumber);
  //   return { isDuplicateName, isDuplicatePhoneNumber };
  // };

  // Pridėti dalyvi į grupės dalyvių sąrašą
  const addParticipant = async (name, phoneNumber) => {
    if (name.trim() !== '' && phoneNumber.trim() !== '') {
      const isDuplicateName = participants.some(participant => participant.name === name.trim());
      const isDuplicatePhoneNumber = participants.some(participant => participant.phoneNumber === phoneNumber.trim());

      if (isDuplicateName || isDuplicatePhoneNumber) {
        Alert.alert(
          'Įspėjimas',
          'Dalyvis su tokiu vardu ar telefono numeriu jau yra. Ar vistiek norite pridėti?',
          [
            {
              text: 'Atšaukti',
              style: 'cancel',
            },
            {
              text: 'Sutikti',
              onPress: () => {
                const newParticipant = { name: name.trim(), phoneNumber: phoneNumber.trim() };
                const newParticipantsList = [...participants, newParticipant];
                setParticipants(newParticipantsList);
                saveData(newParticipantsList);
                setIsAddModalVisible(false);
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        const newParticipant = { name: name.trim(), phoneNumber: phoneNumber.trim() };
        const newParticipantsList = [...participants, newParticipant];
        setParticipants(newParticipantsList);
        saveData(newParticipantsList);
        setIsAddModalVisible(false);
      }
    } else {
      Alert.alert('Klaida', 'Įveskite dalyvio vardą ir telefono numerį');
    }
  };

  // Ištrindi dalyvi
  const deleteParticipant = async (index) => {
    Alert.alert(
      'Ištrinti dalyvi',
      `Ar tikrai norite ištrinti dalyvi "${participants[index].name}"?`,
      [
        {
          text: 'Atšaukti',
          style: 'cancel',
        },
        {
          text: 'Sutikti',
          onPress: async () => {
            const newParticipantsList = [...participants];
            newParticipantsList.splice(index, 1);
            setParticipants(newParticipantsList);
            saveData(newParticipantsList);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Išsaugoma informacija apie dalyvius grupėje 
  const saveData = async (data) => {
    try {
      await AsyncStorage.setItem(`participants_${groupData.name}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving participants:', error);
    }
  };

  // Atidaromas Dalyvio redagavimo modalinis langas 
  const openEditModal = (index) => {
    setEditedParticipantIndex(index);
    setEditedParticipantName(participants[index].name);
    setEditedParticipantPhoneNumber(participants[index].phoneNumber);
    setIsEditModalVisible(true);
  };

  // Pateikty mygtuko funkcija, perduodami duomenys į kitą ekraną
  const handleSubmit = () => {
    navigation.navigate('SubmitScreen', { groupData, participants, userData });
  };

  // Rodomi ekrano komponentai
  return (
    <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0.0, y: 0.1 }} end={{ x: 0.5, y: 1.0 }} style={styles.container}>
      <Text style={{ width: '100%', textAlign: 'center', textTransform: 'uppercase', borderBottomWidth: 2, fontSize: 24, fontWeight: '600', paddingBottom: 10, marginBottom: 10 }}>{groupData.name}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesome5
            onPress={() => {
              setInfoGroupModalVisisble(true)
            }}
            name="info-circle"
            size={24}
            color="black"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.subHeading}>Dalyviai: {participantCount}</Text>
        </View>

        <TouchableOpacity onPress={() => setIsAddModalVisible(true)}>
          <LinearGradient colors={['#bfe7ff', '#95d5fc']} style={[{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25, borderWidth: 2 }, styles.elevation]}>
            <Entypo name="plus" size={32} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ flexGrow: 1 }}
        data={participants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableOpacity onPress={() => deleteParticipant(index)} >
                <LinearGradient colors={['#ffcfcf', '#ff9696']} style={[{ width: 100, height: 67, justifyContent: 'center', alignItems: 'flex-end', borderRadius: 35, marginLeft: -50 }, styles.elevation]}>
                  <Feather name="trash" size={24} color="#000" style={{ marginRight: 20 }} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          >
            <TouchableOpacity onPress={() => openEditModal(index)}>
              <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.1 }} style={[{ borderRadius: 50, marginBottom: 15, borderWidth: 1 }, styles.elevation, styles.participantCard]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View>
                    <Icon style={{ marginHorizontal: 10 }} name="user-alt" size={28} color="black" />
                  </View>
                  <View>
                    <Text style={{ color: 'black', fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
                    <Text style={{ color: 'black' }}>{item.phoneNumber}</Text>
                  </View>
                </View>
                <Icon style={{ marginHorizontal: 10, position: 'absolute', right: 10 }} name="edit" size={20} color="#000000" />
              </LinearGradient>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
      {participants.length > userData.credits &&
        <Text style={{ textAlign: 'center', color: 'red', paddingVertical: 20, paddingTop: 30, fontSize: 18 }}>Nepakanka kreditų!</Text>
      }
      {participants.length < 3 &&
        <Text style={{ textAlign: 'center', color: 'blue', paddingVertical: 20, paddingTop: 30, fontSize: 18 }}>Turi būti bent 3 dalyviai!</Text>
      }
      {participants.length > 2 && participants.length <= userData.credits &&
        <TouchableOpacity onPress={handleSubmit}>
          <LinearGradient style={[styles.submitButton, styles.elevation]} colors={['#bfe7ff', '#95d5fc']}>
            <Text style={styles.submitButtonText}>Pateikti</Text>
          </LinearGradient>
        </TouchableOpacity>
      }

      {/* AddContactModal */}
      <AddContactModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddContact={addParticipant}
      />

      {/* EditContactModal */}
      <EditContactModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={(name, phoneNumber) => {
          if (name.trim() !== '' && phoneNumber.trim() !== '') {
            const updatedParticipants = [...participants];
            updatedParticipants[editedParticipantIndex] = { name: name.trim(), phoneNumber: phoneNumber.trim() };
            setParticipants(updatedParticipants);
            saveData(updatedParticipants);
            setIsEditModalVisible(false);
          } else {
            Alert.alert('Error', 'Please enter participant name and phone number');
          }
        }}
        initialName={editedParticipantName}
        initialPhoneNumber={editedParticipantPhoneNumber}
      />
      <InfoGroupModal isVisible={infoGroupModal} onClose={() => { setInfoGroupModalVisisble(false) }}></InfoGroupModal>
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
  heading: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 10,
    textTransform: 'capitalize',
    borderBottomWidth: 1
  },
  subHeading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    color: 'black'
  },
  participantCard: {
    borderWidth: 2,
    borderRadius: 40,
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center'
  },
  swipeableAction: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 45,
    height: '100%',
  },
  submitButton: {
    borderRadius: 30,
    paddingVertical: 10,
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

export default GroupScreen;