import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';

const InfoHomeModal = ({ isVisible, onClose }) => {
  //Atidaryti modalinį langą 
  useEffect(() => {
  }, [isVisible]);

  // Rodomas modalinis langas
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 18, fontWeight: 600, textAlign: 'center', marginBottom: 10 }}>Informacija</Text>
          <Text>Pridėkite grupę: Įveskite grupės pavadinimą ir paspauskite dešinėje esantį mėlyna (+) mygtuką.</Text>
          <Image style={{ width: '80%', objectFit: 'contain', alignSelf:'center' }} source={require('../assets/tutorial/1.png')} />
          <Text>Kopijuokite grupę: paslinkite grupės kortelę į dešinę, paspaustkite mygtuką, įveskite naują grupės pavadinimą.</Text>
          <Image style={{ width: '80%', objectFit: 'contain', alignSelf:'center' }} source={require('../assets/tutorial/2.png')} />
          <Text>Ištrinkite grupę: paslinkite grupės kortelę į kairę, paspauskite mygtuką.</Text>
          <Image style={{ width: '80%', objectFit: 'contain', alignSelf:'center' }} source={require('../assets/tutorial/3.png')} />
          <Text>Paspaudę ant grupės kortelės, atidarote pasirinktos grupės langą, galite pridėti dalyvius.</Text>
          <Image style={{ width: '80%', objectFit: 'contain', alignSelf:'center' }} source={require('../assets/tutorial/4.png')} />
          <TouchableOpacity onPress={onClose} style={[styles.button, styles.elevation, { marginTop: 20 }]}>
            <Text style={styles.submitButtonText}>Supratau</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// modalinio lango stilius
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
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  image: {
    flex: 1,
    width: '80%',
    backgroundColor: '#0553',
  },
});

export default InfoHomeModal;