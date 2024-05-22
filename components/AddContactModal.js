import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';

const AddContactModal = ({ isVisible, onClose, onAddContact }) => {
  // Modalinio lango kintamieji
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [showContactsList, setShowContactsList] = useState(false);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

  // Užkrovus atitinkamą langą, užkrauti konktatų sąrašą
  useEffect(() => {
    if (showContactsList) {
      loadAllContacts();
    }
  }, [showContactsList]);

  // Užkrauti konktatų sąrašą
  const loadAllContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync();
        setAllContacts(data);
        setContacts(data);
      } else {
        setAllContacts([]);
        setContacts([]);
      }
    } catch (error) {
      Alert.alert('klaida', 'Kontaktų sąrašas nepasiekiamas!')
    }
  };

  // Įkrauti kontaktinius duomenis į dalyvio kontaktų įvesties laukelius
  const addContactToInputFields = (contact) => {
    if (contact && contact.name) {
      setName(contact.name);
      setPhoneNumber(formatPhoneNumber(getPhoneNumber(contact)));
      setShowContactsList(false);
    }
  };

  // Gauti telefono numerį
  const getPhoneNumber = (contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      return contact.phoneNumbers[0].number;
    }
    return '';
  };

  // Reaguoti kai keičiasi telefono numerio įvesties laukelio duomenys
  const handlePhoneNumberChange = (text) => {
    const formattedPhoneNumber = formatPhoneNumber(text);
    setPhoneNumber(formattedPhoneNumber);
    setIsPhoneNumberValid(true);
  };

  // Formotuoti telefono numerį
  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\s/g, ''); // Removes all spaces from the phone number
  };

  // Pridėti Dalyvį
  const addContact = () => {
    if (!name) {
      setIsNameValid(false);
      return;
    }
    if (!phoneNumber) {
      setIsPhoneNumberValid(false);
      return;
    }
    onAddContact(name, phoneNumber);
    setName('');
    setPhoneNumber('');
    onClose();
  };

  // Rodomi Modulinio lango komponentai
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Pridėti naują kontaktą</Text>
          <TextInput
            style={[styles.input, !isNameValid && styles.invalidInput]}
            placeholder="Vardas"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setIsNameValid(true);
            }}
          />
          <TextInput
            style={[styles.input, !isPhoneNumberValid && styles.invalidInput]}
            placeholder="Telefono numeris"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
          />
          <View style={styles.buttons}>
            <TouchableOpacity style={{ backgroundColor: '#95d5fc', borderWidth: 2, padding: 10, borderRadius: 25, marginVertical: 10 }} onPress={() => setShowContactsList(true)}>
              <Text style={styles.btnText}>Kontaktai</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginVertical: 10 }}>
              <TouchableOpacity style={styles.close} onPress={onClose}>
                <Text style={styles.btnText}>Atšaukti</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.add} onPress={addContact}>
                <Text style={styles.btnText}>Pridėti</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {showContactsList && (
          <Modal visible={showContactsList} animationType="fade" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent2}>
                <Text style={styles.modalHeading}>Kontaktų sąrašas</Text>
                <FlatList
                  style={styles.contactlist}
                  data={allContacts}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addContactToInputFields(item)}>
                      <LinearGradient style={styles.contactItemBtn} colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.1 }} >
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, }}>{item.phoneNumbers[0].number}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                />
                <View style={{ flexDirection: 'row', height: 50, marginVertical: 10 }}>
                  <TouchableOpacity style={styles.close} onPress={() => setShowContactsList(false)}>
                    <Text style={styles.btnText}>Atšaukti</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
};

// Modulinio lango komponentų stilius
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000A0',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    width: '90%',
    justifyContent: 'center',

  },
  modalContent2: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: "#000000"
  },
  input: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 10
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  close: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 25,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff9696',
  },
  add: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 25,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#95d5fc',
  },
  contacts: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 45,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#95d5fc',
  },
  contactlist: {
    width: "100%",
  },
  contactItemBtn: {
    padding: 10,
    paddingHorizontal: 20,
    width: '100%',
    borderRadius: 35,
    backgroundColor: '#95d5fc',
    marginVertical: 5,
    borderWidth: 2
  }
});

export default AddContactModal;