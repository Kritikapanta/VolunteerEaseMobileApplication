import { useAuth } from '@/components/AuthContext';
import { db } from '@/firebase';
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
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function VolunteerForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: user?.displayName || '',
    phoneNumber: '',
    nationality: '',
    email: user?.email || '',
    age: ''
  });

  const [abrilLoaded] = useAbrilFont({ AbrilFatface_400Regular });
  const [abhayaLoaded] = useAbhayaFont({
    AbhayaLibre_400Regular,
    AbhayaLibre_600SemiBold,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.phoneNumber || !formData.nationality || !formData.email || !formData.age) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isNaN(Number(formData.age))) {
      Alert.alert('Error', 'Age must be a number');
      return;
    }

    try {
      await addDoc(collection(db, 'volunteers'), {
        userId: user?.uid,
        ...formData,
        age: Number(formData.age),
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Volunteer application submitted successfully');
      router.back();
    } catch (error) {
      console.error('Error submitting volunteer form:', error);
      Alert.alert('Error', 'Failed to submit volunteer application');
    }
  };

  if (!abrilLoaded || !abhayaLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={[styles.title, { fontFamily: 'AbrilFatface_400Regular' }]}>
            Volunteering Form
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#3A703C" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Enter your Name:
        </Text>
        <TextInput
          style={styles.input}
          value={formData.username}
          onChangeText={(text) => handleChange('username', text)}
          placeholder="Your full name"
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Phone Number:
        </Text>
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={(text) => handleChange('phoneNumber', text)}
          placeholder="Your phone number"
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Nationality:
        </Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(text) => handleChange('nationality', text)}
          placeholder="Your nationality"
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Email:
        </Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>
          Age:
        </Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => handleChange('age', text)}
          placeholder="Your age"
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Form</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 10,
  },
  formContainer: {
    width: '85%',
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
    marginBottom: 20,
  },
  title: {
    fontSize:28,
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
});