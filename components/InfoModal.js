import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';

const InfoModal = ({ isVisible, onClose }) => {

  //Atidaryti modalinį langą 
  useEffect(() => {
  }, [isVisible]);

  // Rodomas modalinis langas
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ fontSize: 18, fontWeight: 600, textAlign: 'center', marginBottom: 10 }}>Informacija</Text>
          <Text style={{ marginBottom: 5 }}>Ši "Gifters SMS" programėlė skirta slaptūjų kalėdų senelių paskirstymui.</Text>
          <Text style={{ marginBottom: 5 }}>Programėlėje galima sukurti grupes, grupėje pridėti dalyvių sąrašą. Paskui suformuoti trumposios žinutės SMS pranešimą. Dalyviai yra atsitiktinai sumaišomi ir jiems yra išsiunčiami pranešimai.</Text>
          <Text style={{ marginBottom: 5, fontWeight: 600 }}>1 kreditas yra lygus 1 pranešimui.</Text>
          <Text style={{ marginBottom: 5 }}>Kreditų galima įsigyti programėlės parduotuvėje</Text>
          <Text style={{ marginBottom: 5, borderBottomWidth: 1 }}>Navigacija:</Text>
          <Text style={{ fontWeight: 600, fontSize: 16 }}>Gifters SMS</Text>
          <Text style={{ marginBottom: 5 }}>Programėlės pavadinimas, grįžimo į pirminį ekraną mygtukas</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Entypo name="shop" size={18} color="black" />
            <Text style={{ marginBottom: 5, marginLeft: 5 }}>Parduotuvės navigacijos mygtukas</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="coins" size={18} color="black" />
            <Text style={{ fontSize: 14, fontWeight: '600', marginLeft: 5 }}>5</Text>
            <Text style={{ marginBottom: 5, marginLeft: 5 }}>Turimi kreditai</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <FontAwesome name="arrow-left" size={18} color="black" />
            <Text style={{ marginBottom: 5, marginLeft: 5 }}>Grįžimo atgal mygtukas</Text>
          </View>
          <Text style={{ marginBottom: 5, borderBottomWidth: 1 }}>Įspėjimas:</Text>
          <Text style={{ color: 'red' }}>Neištrinkite telefone saugojamos mobiliosios programėlės atminties! Atmintyje saugoma prisijungimo informacija. Praradus išsaugota prisijungimo informacija, prarasite ir kreditus</Text>
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
});

export default InfoModal;