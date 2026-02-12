import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';

export default function AddServiceScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const addService = async () => {
    if (!name || !price) {
      Alert.alert('Please fill all fields');
      return;
    }

    await api.post('/services', { name, price });
    Alert.alert('Added');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service Name *</Text>
      <TextInput
        placeholder="Service name"
        placeholderTextColor={COLORS.gray}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Price *</Text>
      <TextInput
        placeholder="Price"
        placeholderTextColor={COLORS.gray}
        keyboardType="numeric"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={addService}>
        <Text style={styles.buttonText}>ADD</Text>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
