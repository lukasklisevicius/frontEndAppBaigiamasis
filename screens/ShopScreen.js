import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import InfoShopScreenModal from '../components/InfoShopScreenModal';


function ShopScreen({ userData, updateUser, api }) {
  // krepšelio logika
  const [credits, setCredits] = useState(10);
  const creditPrice = 3;
  const totalPrice = (credits / 10) * creditPrice;
  const publishableKey = 'pk_test_51PIHtxEplgX5jlCdw8WbNGfIrLsrsvuVRiwiO6wDeOz2z33XVM1593Y9CCMDfrvPBzKsxcYxRhn6Pu3faDkWliby00XOWmzJRO'
  const [infoShopModal, setInfoShopModalVisisble] = useState(false)
  // mokėjimo lango inicijavimo komponentai
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const API_URL = api

  // prideda kreditų į krepšelį
  const addCredits = () => {
    if (credits <= 200) {
      setCredits(credits + 10);
    }
    if (credits > 190) {
      setCredits(200)
    }
  };

  // atima kreditų kieki iš krepšelio
  const subtractCredits = () => {
    if (credits >= 10) {
      setCredits(credits - 10);
    }
    if (credits <= 10) {
      setCredits(10)
    }
  };

  // siunčiami mokėjimo parametrai į serverį
  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UUID: userData.UUID, cost: totalPrice, credits: credits })
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };


  // inicijuojama mokėjimo forma
  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: false,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
    if (!error) {
      setLoading(true);
      openPaymentSheet()
    }
  };


  // Atidaroma mokėjimo forma
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert('Atšauta:', 'Jūsų užsakymas atšauktas.');
    } else {
      Alert.alert('Sėkmingas apsipirkimas:', 'Jūsų užsakymas įvykdytas.');
      updateUser()

    }
  };


  // rodomas ekranas
  return (
    <StripeProvider publishableKey={publishableKey}>
      <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#d9effc']} start={{ x: 0.0, y: 0.1 }} end={{ x: 0.5, y: 1.0 }} style={styles.container}>
        <View style={{ width: '100%' }}>
          <View style={styles.headerContainer}>
            <FontAwesome5
              onPress={() => {
                setInfoShopModalVisisble(true);
              }}
              name="info-circle"
              size={24}
              color="black"
              style={styles.infoIcon}
            />
            <Text style={styles.header}>Parduotuvė</Text>
          </View>

          <View style={styles.creditContainer}>
            <TouchableOpacity onPress={subtractCredits}>
              <LinearGradient
                colors={['#ffcfcf', '#ff9696']}
                style={[styles.gradientButton, styles.elevation]}
              >
                <Entypo name="minus" size={32} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.creditsView}>
              <FontAwesome5
                style={styles.coinIcon}
                name="coins"
                size={24}
                color="black"
              />
              <Text style={styles.creditsText}>{credits}</Text>
            </View>
            <TouchableOpacity onPress={addCredits}>
              <LinearGradient
                colors={['#bfe7ff', '#95d5fc']}
                style={[styles.gradientButton, styles.elevation]}
              >
                <Entypo name="plus" size={32} color="#000" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.priceText}>
            <Text>Kaina: </Text>
            <Text style={{ fontWeight: '600' }}>{totalPrice.toFixed(2)}</Text>
            <Text> €</Text>
          </Text>
        </View>
        <View style={{ width: '100%' }}>
          <TouchableOpacity onPress={initializePaymentSheet}>
            <LinearGradient style={[styles.submitButton, styles.elevation]} colors={['#bfe7ff', '#95d5fc']}>
              <Text style={styles.submitButtonText}>Įsigyti</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <InfoShopScreenModal isVisible={infoShopModal} onClose={() => { setInfoShopModalVisisble(false) }}></InfoShopScreenModal>
      </LinearGradient>
    </StripeProvider>
  );
}

// ekrano komponentų stilius
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 35,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 2,
    width: '100%',
    marginBottom: 20,
    paddingBottom: 5,
  },
  infoIcon: {
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  creditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 20,
    backgroundColor: '#00000010',
    borderRadius: 35,
  },
  gradientButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 2,
  },
  creditsView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    marginRight: 10,
  },
  creditsText: {
    fontSize: 24,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 20,
    backgroundColor: '#bfe7ffB5',
    width: '100%',
    padding: 20,
    textAlign: 'center',
    borderRadius: 35,
  },
  submitButton: {
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    width: '100%',
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

export default ShopScreen;
