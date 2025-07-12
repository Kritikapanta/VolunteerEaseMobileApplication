import { useAuth } from '@/components/AuthContext';
import { AkayaKanadaka_400Regular, useFonts } from '@expo-google-fonts/akaya-kanadaka';
import AppLoading from 'expo-app-loading';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [fontsLoaded] = useFonts({
    AkayaKanadaka_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/event');
    } else {
      router.push('/login');
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/hands.png')}
        style={styles.hands}
        resizeMode="contain"
      />

      <Text style={styles.quote}>
        Step forward, lend a hand, and be the reason something great happens.
      </Text>

      <TouchableOpacity
        style={styles.getStarted}
        onPress={handleGetStarted}
      >
        <Text style={styles.getStartedText}>Get Started ➜</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  hands: {
    width: '90%',
    height: 250,
    alignSelf: 'center',
    marginBottom: 0.3,
  },
  quote: {
    fontSize: 38,
    textAlign: 'center',
    color: '#2a2a2a',
    marginBottom: 10,
    fontFamily: 'AkayaKanadaka_400Regular',
  },
  getStarted: {
    backgroundColor: '#3A703C',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  getStartedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
