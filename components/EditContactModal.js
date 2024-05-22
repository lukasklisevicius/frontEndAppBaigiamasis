import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const EditContactModal = ({ isVisible, onClose, onSave, initialName, initialPhoneNumber }) => {
  // Modulinio lango kintamieji
  const [name, setName] = useState(initialName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  // Atidarius modulinį langą, į įvesties laukelius įkrauti dalyvio kontaktinius duomenis
  useEffect(() => {
    setName(initialName);
    setPhoneNumber(initialPhoneNumber);
  }, [isVisible, initialName, initialPhoneNumber]);

  // išsaugoti
  const handleSave = () => {
    onSave(name, phoneNumber);
  };

  // Rodomi modulinio lango komponentai
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Redaguoti dalyvio duomenis</Text>
          <TextInput
            style={styles.input}
            placeholder="Vardas"
            maxLength={20}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefono numeris"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="numeric"
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Atšaukti</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Išsaugoti</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: '#000000A5',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    marginHorizontal: 5,
    alignItems: 'center',
    marginTop: 10,

  },
  cancelButton: {
    backgroundColor: '#ff9696',
  },
  saveButton: {
    backgroundColor: '#95d5fc',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  },
});

export default EditContactModal;