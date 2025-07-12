import { useAuth } from '@/components/AuthContext';
import {
  AbhayaLibre_400Regular,
  AbhayaLibre_600SemiBold,
  useFonts as useAbhayaFont,
} from '@expo-google-fonts/abhaya-libre';
import {
  AbrilFatface_400Regular,
  useFonts as useAbrilFont,
} from '@expo-google-fonts/abril-fatface';
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [abrilLoaded] = useAbrilFont({ AbrilFatface_400Regular });
  const [abhayaLoaded] = useAbhayaFont({
    AbhayaLibre_400Regular,
    AbhayaLibre_600SemiBold,
  });

  if (!abrilLoaded || !abhayaLoaded) {
    return <AppLoading />;
  }

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/event');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={[styles.title, { fontFamily: 'AbrilFatface_400Regular' }]}>
            Log In
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#3A703C" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Email:
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Password:
        </Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontFamily: 'AbhayaLibre_400Regular' }]}>
          If you don't have an account, please {' '}
          <Text
            onPress={() => router.push('/signup')}
            style={[styles.signupText, { fontFamily: 'AbhayaLibre_600SemiBold' }]}
          >
            Signup
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 100,
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#D9E9DB',
    borderRadius: 5,
    padding: 20,
    marginBottom: 30,
    borderColor: '#3A703C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: '#2E6F4B',
  },
  closeButton: {
    padding: 8,
  },
  label: {
    color: '#000',
    marginBottom: 10,
    fontSize: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3A703C',
    borderRadius: 1,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3A703C',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 20,
    borderColor: '#000',
    width: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#000',
    fontSize: 24,
    textAlign:'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  signupText: {
    color: '#1B73FF',
    fontSize: 24,
    textDecorationLine: 'underline',
  },
});