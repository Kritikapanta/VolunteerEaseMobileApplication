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
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const { signup } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'user' | 'organization'>('user');

  const [abrilLoaded] = useAbrilFont({ AbrilFatface_400Regular });
  const [abhayaLoaded] = useAbhayaFont({
    AbhayaLibre_400Regular,
    AbhayaLibre_600SemiBold,
  });

  if (!abrilLoaded || !abhayaLoaded) {
    return <AppLoading />;
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const handleSignup = async () => {
    if (!username.trim()) {
      return Alert.alert('Validation Error', 'Please enter your name or organization name.');
    }

    if (!validateEmail(email)) {
      return Alert.alert('Validation Error', 'Please enter a valid email address.');
    }

    if (password.length < 8) {
      return Alert.alert('Validation Error', 'Password must be at least 8 characters.');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Validation Error', 'Passwords do not match.');
    }

    try {
      await signup(username.trim(), email.trim(), password, userType);
      router.replace('/event');
    } catch (e: any) {
      Alert.alert('Signup Error', e.message || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={[styles.title, { fontFamily: 'AbrilFatface_400Regular' }]}>Sign Up</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#3A703C" />
          </TouchableOpacity>
        </View>

        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setUserType('organization')}
          >
            <View
              style={[
                styles.radioCircle,
                userType === 'organization' && styles.radioCircleSelected,
              ]}
            >
              {userType === 'organization' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioText}>Organization</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setUserType('user')}>
            <View
              style={[styles.radioCircle, userType === 'user' && styles.radioCircleSelected]}
            >
              {userType === 'user' && <View style={styles.radioInnerCircle} />}
            </View>
            <Text style={styles.radioText}>User</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          {userType === 'organization' ? 'Organization Name:' : 'Full Name:'}
        </Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Password:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Confirm Password:
        </Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontFamily: 'AbhayaLibre_400Regular' }]}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={[styles.loginText, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 0,
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#D9E9DB',
    borderRadius: 5,
    padding: 20,
    marginBottom: 40,
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
    marginBottom: 10,
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
    marginBottom: 5,
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3A703C',
    borderRadius: 1,
    padding: 10,
    marginBottom: 17,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  radioContainer: {
    color: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: '#000',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  radioText: {
    color: '#000',
    fontSize: 16,
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
    marginBottom: 1,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footerText: {
    color: '#000',
    fontSize: 22,
  },
  loginText: {
    color: '#1B73FF',
    fontWeight: 'bold',
    fontSize: 22,
    textDecorationLine: 'underline',
  },
});