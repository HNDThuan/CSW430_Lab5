import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useState } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';

export default function AddCustomerScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleAdd = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter customer name');
            return;
        }
        if (!phone.trim()) {
            Alert.alert('Error', 'Please enter phone number');
            return;
        }

        try {
            await api.post('/customers', { name, phone });
            Alert.alert('Success', 'Customer added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (e) {
            Alert.alert('Error', 'Failed to add customer');
            console.log('Add customer error:', e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Customer name *</Text>
            <TextInput
                style={styles.input}
                placeholder="Input your customer's name"
                placeholderTextColor={COLORS.gray}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Phone *</Text>
            <TextInput
                style={styles.input}
                placeholder="Input phone number"
                placeholderTextColor={COLORS.gray}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 4,
        padding: 12,
        fontSize: 15,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 4,
        marginTop: 24,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
