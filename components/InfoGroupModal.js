import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';


const InfoGroupModal = ({ isVisible, onClose }) => {
  //Atidaryti modalinį langą 
  useEffect(() => {
  }, [isVisible]);

  // Rodomas modalinis langas
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 18, fontWeight: 600, textAlign: 'center', marginBottom: 10 }}>Informacija</Text>
          <Text>Pridėkite dalyvį: paspauskite dešinėje esantį mėlyna (+) mygtuką. Atidaromas modalinis langas.</Text>
          <Image style={{ width: '100%', objectFit: 'contain' }} source={require('../assets/tutorial/5.png')} />
          <Text>Redaguokite dalyvio duomenis: paspauskite ant dalyvio kortelės.</Text>
          <Image style={{ width: '100%', objectFit: 'contain' }} source={require('../assets/tutorial/6.png')} />
          <Text>Ištrinkite dalyvį: paslinkite grupės kortelę į kairę, atidengiate mygtuką, paspaudus ant mygtuko pasirinktas dalyvis yra ištrinamas.</Text>
          <Image style={{ width: '100%', objectFit: 'contain' }} source={require('../assets/tutorial/7.png')} />
          <Text>Pateikite dalyvių sąrašą: paspauskite mygtuką "Pateikti". Būsite perkeliamas į žinutės formatavimo langą.</Text>
          <Image style={{ width: '100%', objectFit: 'contain' }} source={require('../assets/tutorial/10.png')} />
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
    width: '100%',
    backgroundColor: '#0553',
  },
});

export default InfoGroupModal;