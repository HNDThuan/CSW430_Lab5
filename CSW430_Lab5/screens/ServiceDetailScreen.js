import { View, Text, StyleSheet } from 'react-native';
import { use, useEffect, useLayoutEffect, useState } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { Service } from '../interface/service';
import { Alert } from 'react-native';

export default function ServiceDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [service, setService] = useState(null);

  useEffect(() => {
    api.get(`/services/${id}`).then(res => {
      setService(res.data);
    });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: '#fff',
      headerTitle: 'Service detail',
      headerRight: () => (
        <Menu>
          <MenuTrigger>
            <Text style={styles.menu}>⋮</Text>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption
              onSelect={() => navigation.navigate('EditService', { service })}
            >
              <Text style={styles.menuItem}>Edit</Text>
            </MenuOption>
            <MenuOption onSelect={handleDelete}>
              <Text style={[styles.menuItem, { color: 'red' }]}>Delete</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      ),
    });
  }, [navigation, service]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
      { cancelable: true },
    );
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/services/${service._id}`);
      Alert.alert('Deleted');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Delete failed');
    }
  };

  if (!service) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.row}>
        <Text style={styles.label}>Service name: </Text>
        {service.name}
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>Price: </Text>
        {service.price.toLocaleString()} đ
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>Creator: </Text>
        {service.creator || 'Hung'}
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>Time: </Text>
        {service.createdAt || '12/03/2023 22:56:59'}
      </Text>

      <Text style={styles.row}>
        <Text style={styles.label}>Final update: </Text>
        {service.updatedAt || '12/03/2023 22:56:59'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  row: {
    marginBottom: 10,
    fontSize: 15,
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
  },
  menu: {
    color: '#fff',
    fontSize: 22,
    paddingHorizontal: 16,
  },
  menuItem: {
    padding: 12,
    fontSize: 16,
  },
});
