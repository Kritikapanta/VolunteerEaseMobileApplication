import { AuthProvider, useAuth } from '@/components/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Slot, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {isAuthenticated ? (
        <View style={styles.userContainer}>
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="person-circle-outline" size={24} color="#3A703C" />
            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            <Ionicons name="ellipsis-vertical" size={16} color="#3A703C" />
          </TouchableOpacity>
          {showMenu && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9E9DB',
  },
  header: {
    height: 100,
    paddingHorizontal: 30,
    marginTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    position: 'relative',
  },
  logo: {
    width: 90,
    height: 80,
  },
  loginButton: {
    backgroundColor: '#3C8D3E',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  userContainer: {
    position: 'relative',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  userName: {
    color: '#3A703C',
    fontWeight: 'bold',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  menuItem: {
    padding: 8,
  },
  menuText: {
    color: '#3A703C',
  },
});