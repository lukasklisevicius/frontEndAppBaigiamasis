import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet} from 'react-native';

const InputModal = ({ visible, setVisible, onSave, initialText1, initialText2 }) => {
  // Modalinio lango kintamieji
  const [text1, setText1] = useState(initialText1);
  const [text2, setText2] = useState(initialText2);

  // Įvesties laukai užpildomį duomenimis
  useEffect(() => {
    setText1(initialText1);
    setText2(initialText2);
  }, [visible, initialText1, initialText2]);

  // Atnaujinti duomenys išsaugojami
  const handleSave = () => {
      onSave(text1, text2);
      setVisible(false);
  };

  // Rodomi modalinio lango komponentai
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeading}>Redaguoti žinutę</Text>
          <TextInput
            style={styles.input}
            maxLength={68}
            value={text1}
            onChangeText={(text) => setText1(text)}
          />
          <Text style={{ fontWeight: 600 }}>Sugeneruotas dalyvio vardas</Text>
          <TextInput
            maxLength={68}
            style={styles.input}
            value={text2}
            onChangeText={(text) => setText2(text)}
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setVisible(false)}>
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

// Modalinio lango komponentų stilius
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
    width: '90%',
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

export default InputModal;