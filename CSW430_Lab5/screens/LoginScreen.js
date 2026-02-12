import { View, TextInput, Button, Alert } from 'react-native';
import api from '../api/api';
import { saveToken, saveUser } from '../utils/storage';
import { useState } from 'react';
import { COLORS } from '../theme/color';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await api.post('/auth', {
        phone,
        password,
      });
      await saveToken(res.data.token);
      await saveUser({
        phone: phone,
        name: res.data.name,
      });

      navigation.replace('Home');
    } catch (e) {
      Alert.alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Login</Text>

      <TextInput
        placeholder="Phone"
        placeholderTextColor={'black'}
        style={styles.input}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={'black'}
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
