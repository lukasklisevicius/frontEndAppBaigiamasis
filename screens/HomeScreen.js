import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, FontAwesome6, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Pridėkite useFocusEffect iš React Navigation
import InfoHomeModal from '../components/InfoHomeModal';

function HomeScreen({ userData, updateUser }) {
  // Pagrindinio home ekrano kintamieji
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [participantsCount, setParticipantsCount] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigation = useNavigation();
  // const [demoModalShown, setDemoModalShown] = useState(false)
  const [infoHomeModal, setInfoHomeModalVisisble] = useState(false)

  // Gauti duomenis apie grupes
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const storedGroups = await AsyncStorage.getItem('groups');
          if (storedGroups) {
            setGroups(JSON.parse(storedGroups));
          }
        } catch (error) {
          console.error('Error fetching groups from AsyncStorage:', error);
        }
      };

      fetchData();
    }, [])
  );

  // Gauti duomenis apie grupėse esančių dalyvių skaičių
  useEffect(() => {
    updateUser();
    const updateParticipantsCount = async () => {
      const updatedParticipantsCount = {};
      await Promise.all(
        groups.map(async (group) => {
          const storedParticipants = await AsyncStorage.getItem(`participants_${group.name}`);
          if (storedParticipants) {
            const parsedParticipants = JSON.parse(storedParticipants);
            updatedParticipantsCount[group.name] = parsedParticipants.length;
          } else {
            updatedParticipantsCount[group.name] = 0;
          }
        })
      );
      setParticipantsCount(updatedParticipantsCount);
    };

    updateParticipantsCount();
  }, [groups]);


  // Pridėti grupę
  const addGroup = async () => {
    Keyboard.dismiss();
    if (groupName.trim() !== '') {
      const isDuplicateName = groups.some(group => group.name === groupName.trim());

      if (isDuplicateName) {
        Alert.alert('Klaida!', 'Tokia grupė jau egzistuoja!');

      } else {
        const newGroup = {
          name: groupName.trim(),
          participantCount: 0,
          hasMessaged: false,
        };

        const newGroupsList = [...groups, newGroup];
        setGroups(newGroupsList);

        try {
          await AsyncStorage.setItem('groups', JSON.stringify(newGroupsList));
        } catch (error) {
          console.error('Error saving groups list:', error);
        }

        setGroupName('');
      }
    } else {
      Alert.alert('Klaida!', 'Įveskite grupės pavadinimą!');
    }
  };

  // Ištrinti grupę
  const deleteGroup = async (name) => {
    Alert.alert(
      'Ištrinti grupę',
      `Ar tikrai norite ištrinti grupę "${name}"?`,
      [
        {
          text: 'Atšaukti',
          style: 'cancel',
        },
        {
          text: 'Ištrinti',
          onPress: async () => {
            const newGroupsList = groups.filter(group => group.name !== name);
            setGroups(newGroupsList);

            try {
              await AsyncStorage.setItem('groups', JSON.stringify(newGroupsList));
            } catch (error) {
              console.error('Error saving groups list:', error);
            }
            await deleteParticipants(name);
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Ištrinant grupę reikia iš trinti ir joje esančius dalyvius
  const deleteParticipants = async (groupName) => {
    try {
      await AsyncStorage.removeItem(`participants_${groupName}`);
    } catch (error) {
      console.error('Error deleting participants:', error);
    }
  };

  // Perėjimas į grupės ekraną
  const navigateToGroupDetails = (groupData) => {
    navigation.navigate('GroupScreen', { groupData });
  };

  // grupės kopjavimas
  const copyGroup = async (group) => {
    setSelectedGroup(group);
    setModalVisible(true);
  };

  // Grupės kopijavimas valdymas
  const handleCopyGroup = async () => {
    setModalVisible(false);
    if (selectedGroup) {
      const newGroupName = groupName.trim();
      if (newGroupName) {
        const participants = await AsyncStorage.getItem(`participants_${selectedGroup.name}`);
        if (participants) {
          const newGroupNameParticipants = JSON.parse(participants);
          await AsyncStorage.setItem(`participants_${newGroupName}`, JSON.stringify(newGroupNameParticipants));
        }
        const copiedGroup = {
          name: newGroupName,
          participantCount: selectedGroup.participantCount,
          hasMessaged: false,
        };

        const newGroupsList = [...groups, copiedGroup];
        setGroups(newGroupsList);

        try {
          await AsyncStorage.setItem('groups', JSON.stringify(newGroupsList));
        } catch (error) {
          console.error('Error saving groups list:', error);
        }
      }
    }
  };


  // Demo modulis
  // if(!demoModalShown){
  //   return(
  //     <View style={{marginTop:200, paddingHorizontal:55}}>
  //     <Text style={{textAlign:'center', fontSize:18, fontWeight:600, marginBottom:10}}>Dėmesio!</Text>
  //     <Text style={{textAlign:'center'}}>Tai yra bandomoji programėlės versija</Text>
  //     <TouchableOpacity onPress={()=>setDemoModalShown(true)} style={[styles.button, styles.elevation, {marginTop:20}]}>
  //       <Text style={styles.submitButtonText}>Supratau</Text>
  //     </TouchableOpacity>
  //     </View>
  //   )
  // }

  // Rodomi ekrano komponentai
  return (
    <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0.0, y: 0.1 }} end={{ x: 0.5, y: 1.0 }} style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.elevation, { width: '80%' }]}
          placeholder="Grupės pavadinimas"
          maxLength={20}
          value={groupName}
          onChangeText={text => setGroupName(text)}
        />
        <TouchableOpacity onPress={addGroup}>
          <LinearGradient colors={['#bfe7ff', '#95d5fc']} style={[{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 25, borderWidth: 2 }, styles.elevation]}>
            <Entypo name="plus" size={32} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <FontAwesome5
          onPress={() => {
            setInfoHomeModalVisisble(true)
          }}
          name="info-circle"
          size={24}
          color="black"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.heading}>
          Grupės:
        </Text>
      </View>
      <FlatList
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={() => (
              <TouchableOpacity onPress={() => copyGroup(item)}>
                <LinearGradient colors={['#bfe7ff', '#95d5fc']} style={[{ width: 100, height: 70, justifyContent: 'center', borderRadius: 35, marginRight: -50 }, styles.elevation]}>
                  <FontAwesome6 name="copy" size={24} color="#000" style={{ marginLeft: 20 }} />
                </LinearGradient>
              </TouchableOpacity>
            )}
            renderRightActions={() => (
              <TouchableOpacity onPress={() => deleteGroup(item.name)} style={[]}>
                <LinearGradient colors={['#ffcfcf', '#ff9696']} style={[{ width: 100, height: 70, justifyContent: 'center', alignItems: 'flex-end', borderRadius: 35, marginLeft: -50 }, styles.elevation]}>
                  <Feather name="trash" size={24} color="#000" style={{ marginRight: 20 }} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          >
            <TouchableOpacity onPress={() => navigateToGroupDetails(item)}>
              <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.1 }} style={[{ borderRadius: 50, marginBottom: 15, borderWidth: 2 }, styles.elevation]}>
                <View style={styles.groupCard}>
                  <View style={{ flexDirection: 'row', padding: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <FontAwesome5 name="user-friends" size={32} color="black" />
                      <View>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', borderTopRightRadius: 15, borderTopLeftRadius: 15, paddingHorizontal: 15, textTransform: 'capitalize' }}>{item.name}</Text>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between' }}>
                          <Text style={{ color: 'black' }}>{`Dalyviai: ${participantsCount[item.name] || 0}`}</Text>
                        </View>
                      </View>
                    </View>
                    <View>

                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 18, color: '#000', fontWeight: 600, marginBottom: 20 }}>Kopijuoti grupę</Text>
            <TextInput
              style={[styles.input, { width: '100%' }]}
              placeholder="Naujas grupės pavadinimas"
              value={groupName}
              maxLength={20}
              onChangeText={text => setGroupName(text)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ borderWidth: 2, padding: 10, paddingHorizontal: 20, borderRadius: 25, backgroundColor: '#ff9696', width: '45%' }}>
                <Text style={{ color: '#000', fontWeight: 600, textAlign: 'center' }}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCopyGroup} style={{ borderWidth: 2, padding: 10, paddingHorizontal: 20, borderRadius: 25, backgroundColor: '#95d5fc', width: '45%' }}>
                <Text style={{ color: '#000', fontWeight: 600, textAlign: 'center' }}>Kopijuoti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <InfoHomeModal isVisible={infoHomeModal} onClose={() => { setInfoHomeModalVisisble(false) }}></InfoHomeModal>
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
  inputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  input: {
    color: 'black',
    fontSize: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
    textTransform: 'uppercase'
  },
  groupCard: {
    borderRadius: 15,
  },
  swipeableAction: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 70,
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000A5'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  elevation: {
    shadowOpacity: 0.85,
    shadowRadius: 5,
    elevation: 6,
    shadowColor: '#000363',
  },
  button: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 25,
    backgroundColor: '#95d5fc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
});

export default HomeScreen;