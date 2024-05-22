import { StatusBar } from 'expo-status-bar';
import { Alert, DevSettings, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'
import ShopScreen from './screens/ShopScreen';
import Header from './components/Header';
import GroupScreen from './screens/GroupScreen';
import SubmitScreen from './screens/SubmitScreen';
import FinalScreen from './screens/FinalScreen';

export default function App() {
  // Programos kintamieji
  const Stack = createStackNavigator();
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Užkraunant programėlę gaunami vartotojo duomenys
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          setUserId(storedUserId);
          fetchUser(storedUserId);
        } else {
          const newUserId = uuidv4();
          await AsyncStorage.setItem('userId', newUserId);
          setUserId(newUserId);
          createUser(newUserId);
        }
      } catch (error) {
        console.error('Klaida gaunant vartotojo ID:', error);
      } finally {
        setLoading(false);
      }
    };

    // Kviečiama funkcija kad būtų gaunami vartotojo duomenys 
    fetchUserId();

    // Stebėti interneto ryšį
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        Alert.alert('Nėra interneto', 'Įjunkite interneto ryšį!');
      } else if (state.isConnected === true) {
        fetchUser(userId);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // Gauti vartotojo duomenis
  const fetchUser = async (userId) => {
    try {
      // const response = await fetch(`https://giftersms-pcukbfonwq-lz.a.run.app/user/${userId}`);
      const response = await fetch(`http://10.0.2.2:8080/user/${userId}`)
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
      } else {
        // console.error('Klaida gaunant vartotojo duomenis:', data.error);
        // Alert.alert('Klaida!', 'Klaida gaunant vartotojo duomenis.')
      }
    } catch (error) {
      // console.error('Klaida gaunant vartotojo duomenis:', error);
      Alert.alert('Klaida!', 'Klaida gaunant vartotjo duomenis.')
    }
  };

  // Sukurti vartotoją
  const createUser = async (userId) => {
    try {
      // change fetch url!!!!!!!!!!!!!!!!!
      const response = await fetch('http://10.0.2.2:8080/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Vartotojas sukurtas sėkmingai');
      } else {
        console.error('Klaida kuriant naują vartotoją:', data.error);
        Alert.alert('Klaida!', 'klaida kuriant jūsų vartotoją.')
      }
    } catch (error) {
      console.error('Klaida kuriant naują vartotoją:', error);
      Alert.alert('Klaida!', 'Klaida kuriant jūsų vartotoją.')
    }
  };

  // Atnaujinti vartotojo duomenis programėlėje
  const updateUser = async () => {
    // Fetch updated user data and update state
    fetchUser(userId);
    // console.log('user updated!')
  };

  // Jei programėlė kraunasi rodyti Laukimo komponentą
  if (loading) {
    return (
      <View >
        <StatusBar backgroundColor="#95d5fc" color="white" barStyle="light-content" />
        <Text>Palaukite...</Text>
      </View>
    );
  }

  // Programėlės Struktūra
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation, route }) => ({
          header: (props) => (
            <Header {...props} isHomeScreen={route.name === 'Home'} userData={userData} />
          ),
        })}
      >
        <Stack.Screen name="Home" options={{
          title: "Home",
        }}>
          {props => <HomeScreen {...props} userData={userData} updateUser={updateUser} />}
        </Stack.Screen>
        <Stack.Screen name="Shop" options={{
          title: "Shop",
        }}>
          {props => <ShopScreen {...props} userData={userData} updateUser={updateUser} />}
        </Stack.Screen>
        <Stack.Screen name="GroupScreen">
          {props => <GroupScreen {...props} userData={userData} />}
        </Stack.Screen>
        <Stack.Screen name="SubmitScreen">
          {props => <SubmitScreen {...props} userData={userData} />}
        </Stack.Screen>
        <Stack.Screen
          name="FinalScreen"
          options={{
            headerShown: false,
            gestureEnabled: false,
            headerLeft: () => null,
          }}
        >
          {props => <FinalScreen {...props} userData={userData} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({

});