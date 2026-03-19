import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useState, useCallback } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const formatMoney = amount => {
    if (!amount || amount === 0) return '0 đ';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const getLoyaltyColor = loyalty => {
    if (loyalty === 'member') return COLORS.primary;
    return COLORS.primary;
};

export default function CustomerScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);

    const loadCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (e) {
            console.log('Error loading customers:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadCustomers();
        }, []),
    );

    const renderCustomer = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CustomerDetail', { id: item._id })}>
            <View style={styles.cardContent}>
                <Text style={styles.label}>
                    Customer: <Text style={styles.value}>{item.name}</Text>
                </Text>
                <Text style={styles.label}>
                    Phone: <Text style={styles.value}>{item.phone}</Text>
                </Text>
                <Text style={styles.label}>
                    Total money:{' '}
                    <Text style={[styles.money, { color: COLORS.primary }]}>
                        {formatMoney(item.totalSpent)}
                    </Text>
                </Text>
            </View>
            <View style={styles.loyaltyContainer}>
                <Icon
                    name="person"
                    size={24}
                    color={getLoyaltyColor(item.loyalty)}
                />
                <Text style={[styles.loyaltyText, { color: getLoyaltyColor(item.loyalty) }]}>
                    {item.loyalty === 'member' ? 'Member' : 'Guest'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={customers}
                keyExtractor={item => item._id}
                renderItem={renderCustomer}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddCustomer')}>
                <Icon name="add" size={30} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: COLORS.white,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 2,
    },
    value: {
        fontWeight: 'bold',
    },
    money: {
        fontWeight: 'bold',
    },
    loyaltyContainer: {
        alignItems: 'center',
        marginLeft: 12,
    },
    loyaltyText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});
