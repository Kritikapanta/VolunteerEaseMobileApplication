import { useAuth } from '@/components/AuthContext';
import { db } from '@/firebase';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import AppLoading from 'expo-app-loading';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  description: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
}


export default function EventScreen() {
  const { isAuthenticated, userType, user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    location: '',
    date: '',
    description: '',
    imageUrl: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);


  const [abrilLoaded] = useAbrilFont({ AbrilFatface_400Regular });
  const [abhayaLoaded] = useAbhayaFont({
    AbhayaLibre_400Regular,
    AbhayaLibre_600SemiBold,
  });


  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      fetchEvents();
    }
  }, [isAuthenticated]);


  const fetchEvents = async () => {
    try {
      setRefreshing(true);
      const eventsCollection = collection(db, 'events');
      const q = query(eventsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);


      const eventsData: Event[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        eventsData.push({
          id: doc.id,
          name: data.name || '',
          location: data.location || '',
          date: data.date || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          createdBy: data.createdBy || '',
          createdAt: data.createdAt || ''
        });
      });


      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events');
    } finally {
      setRefreshing(false);
    }
  };


  const handleRefresh = () => {
    fetchEvents();
  };


  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'We need access to your photos to upload images');
          return;
        }
      }


      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });


      if (!result.canceled && result.assets?.[0]?.uri) {
        setLoading(true);
        const uri = result.assets[0].uri;
        setImage(uri);


        try {
          const cloudinaryUrl = await uploadToCloudinary(uri);
          setNewEvent(prev => ({ ...prev, imageUrl: cloudinaryUrl }));
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          Alert.alert('Error', 'Failed to upload image');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
      setLoading(false);
    }
  };


  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(currentDate);
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    setNewEvent(prev => ({ ...prev, date: formattedDate }));
  };


  const handleAddEvent = async () => {
    if (!newEvent.name || !newEvent.location || !newEvent.date || !newEvent.description) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }


    try {
      setLoading(true);
     
      await addDoc(collection(db, 'events'), {
        name: newEvent.name,
        location: newEvent.location,
        date: newEvent.date,
        description: newEvent.description,
        imageUrl: newEvent.imageUrl || null,
        createdBy: user?.uid || '',
        createdAt: new Date().toISOString(),
      });


      // Reset form
      setShowForm(false);
      setNewEvent({
        name: '',
        location: '',
        date: '',
        description: '',
        imageUrl: '',
      });
      setImage(null);


      // Refresh events
      await fetchEvents();
      Alert.alert('Success', 'Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setSelectedDate(date);
            handleDateChange(null, date);
          }}
          style={{
            width: '100%',
            padding: 12,
            border: '1px solid #3A703C',
            borderRadius: 4,
            marginBottom: 16
          }}
        />
      );
    }
    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange}
        minimumDate={new Date()}
      />
    );
  };


  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // Fallback if date parsing fails
    }
  };


  if (!abrilLoaded || !abhayaLoaded) {
    return <AppLoading />;
  }


  if (!isAuthenticated) return null;


  return (
    <View style={styles.container}>
      {userType === 'organization' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
          disabled={loading}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}


      {showForm && (
        <View style={styles.formOverlay}>
          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formHeader}>
              <Text style={[styles.formTitle, { fontFamily: 'AbrilFatface_400Regular' }]}>New Event</Text>
              <TouchableOpacity
                onPress={() => setShowForm(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#3A703C" />
              </TouchableOpacity>
            </View>


            <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Name of the event:</Text>
            <TextInput
              style={styles.input}
              value={newEvent.name}
              onChangeText={(text) => setNewEvent(prev => ({ ...prev, name: text }))}
              placeholder="Event name"
              editable={!loading}
            />


            <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Location:</Text>
            <TextInput
              style={styles.input}
              value={newEvent.location}
              onChangeText={(text) => setNewEvent(prev => ({ ...prev, location: text }))}
              placeholder="Event location"
              editable={!loading}
            />


            <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Date:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
              disabled={loading}
            >
              <Text>{newEvent.date || 'Select date'}</Text>
            </TouchableOpacity>


            {showDatePicker && renderDatePicker()}


            <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Description:</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={newEvent.description}
              onChangeText={(text) => setNewEvent(prev => ({ ...prev, description: text }))}
              placeholder="Event description"
              multiline
              editable={!loading}
            />


            <Text style={[styles.label, { fontFamily: 'AbhayaLibre_600SemiBold' }]}>Add Picture</Text>
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#3A703C" />
              ) : image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#3A703C" />
                  <Text style={styles.imagePlaceholderText}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>


            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleAddEvent}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}


      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.eventImage}
                resizeMode="cover"
              />
            )}
            <Text style={styles.eventName}>{item.name}</Text>
            <View style={styles.eventMeta}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
            <View style={styles.eventMeta}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
            </View>
            <Text style={styles.eventDescription}>{item.description}</Text>


            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => router.push('/volunteer-form')}
            >
              <Text style={styles.applyButtonText}>Apply for Volunteering</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No events available</Text>
            {userType === 'organization' && (
              <Text style={styles.emptySubText}>Tap the + button to create an event</Text>
            )}
          </View>
        }
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft:20,
    paddingRight:20,
    backgroundColor: '#fff',
  },
  formOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 10,
    padding: 30,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#D9E9DB',
    borderRadius: 8,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  formContent: {
    paddingBottom: 40,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 30,
    color: '#2E6F4B',
  },
  closeButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    right: 50,
    bottom: 20,
    backgroundColor: '#3A703C',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 4,
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
  descriptionInput: {
    height: 50,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3A703C',
    borderRadius: 1,
    padding: 10,
    marginBottom: 17,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#3A703C',
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
  disabledButton: {
    opacity: 0.6,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  eventCard: {
    backgroundColor: '#cae6ce',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 10,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 4,
    marginBottom: 12,
  },
  eventName: {
    fontSize: 20,
    color: '#2E6F4B',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#000',
    marginLeft: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 16,
    color: '#000',
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: '#3A703C',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  applyButtonText: {
        fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
