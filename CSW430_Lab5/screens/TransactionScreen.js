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

const formatDate = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function TransactionScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);

    const loadTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (e) {
            console.log('Error loading transactions:', e);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTransactions();
        }, []),
    );

    const renderTransaction = ({ item }) => {
        const serviceNames = item.services
            ? item.services.map(s => `- ${s.name}`).join('\n')
            : '';
        const isCancelled = item.status === 'cancelled';

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('TransactionDetail', { id: item._id })}>
                <View style={styles.cardHeader}>
                    <Text style={styles.transactionId}>
                        {item.id} - {formatDate(item.createdAt)}
                    </Text>
                    {isCancelled && (
                        <Text style={styles.cancelledBadge}>Cancelled</Text>
                    )}
                </View>
                <Text style={styles.services} numberOfLines={3}>
                    {serviceNames}
                </Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.customerName}>
                        Customer: {item.customer?.name}
                    </Text>
                    <Text style={styles.price}>{formatMoney(item.price)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={item => item._id}
                renderItem={renderTransaction}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
            <TouchableOpacity style={styles.fab}>
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    transactionId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
    },
    cancelledBadge: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 13,
    },
    services: {
        fontSize: 13,
        color: COLORS.gray,
        marginBottom: 6,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerName: {
        fontSize: 13,
        color: COLORS.gray,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.primary,
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
