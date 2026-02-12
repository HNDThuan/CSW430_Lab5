import {
  View,
  FlatList,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useEffect, useState, useLayoutEffect } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';
import { getUser } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({ navigation }) {
  const [services, setServices] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(u => setUser(u));
  }, []);

  useLayoutEffect(() => {
    if (!user) return;

    navigation.setOptions({
      title: user.name,
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('User')}
          style={{ marginRight: 12 }}
        >
          <Text style={{ fontSize: 20, color: 'white' }}>
            <Icon name="account-circle" size={30} color="white" />
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, user]);

  const loadData = async () => {
    const res = await api.get('/services');
    setServices(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddService')}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { id: item._id })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price} đ</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 50,
    height: 40,
    width: 40,
    textAlign: 'center',
  },
  addText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 28,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    color: COLORS.text,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
