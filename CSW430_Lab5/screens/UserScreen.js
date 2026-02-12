import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getUser, removeToken, removeUser } from '../utils/storage';
import { COLORS } from '../theme/color';

export default function UserScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await removeToken();
          await removeUser();
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Text style={styles.info}>Name: {user.name}</Text>
          <Text style={styles.info}>Phone: {user.phone}</Text>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  info: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 32,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
