import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import InfoModal from './InfoModal';

function Header({ isHomeScreen, userData }) {
  // Antraštės kintamieji
  const navigation = useNavigation();
  const [isInfoModalVisible, setInfoModalVisisble] = useState(false)

  // Rodomi antraštės komponentai
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#95d5fc" color="white" barStyle="light-content" />
      {userData && (
        <View
          style={styles.header}
        >
          <LinearGradient
            colors={['transparent', '#0207fa15']}
            style={styles.backgroundHead}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text
              onPress={() => {
                navigation.navigate('Home');
              }}
              style={{ color: 'black', fontSize: 32, textAlign: 'center', fontWeight: 600 }}
            >
              Gifters SMS
            </Text>
            <Entypo
              onPress={() => {
                navigation.navigate('Shop');
              }}
              name="shop"
              size={24}
              color="black"
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopColor: 'black',
              borderTopWidth: 2,
              paddingTop: 10,
            }}
          >
            <View>
              {isHomeScreen ?
                <FontAwesome5
                  onPress={() => {
                    setInfoModalVisisble(true)
                  }}
                  name="info-circle"
                  size={24}
                  color="black"
                /> :
                <FontAwesome name="arrow-left" size={24} color="black" onPress={() => {
                  navigation.goBack();
                }} />
              }
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome5
                  name="coins"
                  size={24}
                  color="black"
                  onPress={() => {
                    navigation.navigate('Shop');
                  }}
                />
                <Text
                  style={{ color: 'black', fontSize: 20, fontWeight: 600, marginLeft: 20 }}
                  onPress={() => {
                    navigation.navigate('Shop');
                  }}
                >
                  {userData.credits}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      <InfoModal isVisible={isInfoModalVisible} onClose={() => { setInfoModalVisisble(false) }}></InfoModal>
    </View>
  );
}

// Antraštės komponento stilius
const styles = StyleSheet.create({
  container: {},
  header: {
    backgroundColor: '#95d5fc',
    marginTop: Constants.statusBarHeight + 15,
    paddingVertical: 20,
    paddingBottom: 30,
    paddingHorizontal: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 3,
  },

  backgroundHead: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default Header;