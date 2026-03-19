import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

const formatMoney = amount => {
    if (!amount && amount !== 0) return '0 đ';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const formatDateTime = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear().toString().slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CustomerDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [customer, setCustomer] = useState(null);

    const loadCustomer = async () => {
        try {
            const res = await api.get(`/Customers/${id}`);
            setCustomer(res.data);
        } catch (e) {
            console.log('Error loading customer:', e);
        }
    };

    useEffect(() => {
        loadCustomer();
    }, [id]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: COLORS.primary },
            headerTintColor: '#fff',
            headerTitle: 'Customer detail',
            headerRight: () => (
                <Menu>
                    <MenuTrigger>
                        <Text style={styles.menu}>⋮</Text>
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption
                            onSelect={() =>
                                navigation.navigate('EditCustomer', { customer })
                            }>
                            <Text style={styles.menuItem}>Edit</Text>
                        </MenuOption>
                        <MenuOption onSelect={handleDelete}>
                            <Text style={[styles.menuItem, { color: 'red' }]}>
                                Delete
                            </Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            ),
        });
    }, [navigation, customer]);

    const handleDelete = () => {
        Alert.alert(
            'Alert',
            'Are you sure you want to remove this client? This will not be possible to return',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'DELETE',
                    style: 'destructive',
                    onPress: confirmDelete,
                },
            ],
            { cancelable: true },
        );
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/Customers/${id}`);
            Alert.alert('Success', 'Customer deleted successfully');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to delete customer');
            console.log('Delete customer error:', e);
        }
    };

    if (!customer) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* General Information */}
            <Text style={styles.sectionTitle}>General information</Text>
            <View style={styles.section}>
                <Text style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name: </Text>
                    <Text style={styles.infoValue}>{customer.name}</Text>
                </Text>
                <Text style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone: </Text>
                    <Text style={styles.infoValue}>{customer.phone}</Text>
                </Text>
                <Text style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total spent: </Text>
                    <Text style={[styles.infoValue, { color: COLORS.primary }]}>
                        {formatMoney(customer.totalSpent)}
                    </Text>
                </Text>
                <Text style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Time: </Text>
                    <Text style={styles.infoValue}>
                        {formatDateTime(customer.createdAt)}
                    </Text>
                </Text>
                <Text style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Last update: </Text>
                    <Text style={styles.infoValue}>
                        {formatDateTime(customer.updatedAt)}
                    </Text>
                </Text>
            </View>

            {/* Transaction History */}
            <Text style={styles.sectionTitle}>Transaction history</Text>
            {customer.transactions && customer.transactions.length > 0 ? (
                customer.transactions.map((trans, index) => (
                    <View key={trans._id || index} style={styles.transactionCard}>
                        <Text style={styles.transId}>
                            {trans.id} - {formatDateTime(trans.createdAt)}
                        </Text>
                        {trans.services &&
                            trans.services.map((service, sIndex) => (
                                <Text key={sIndex} style={styles.serviceName}>
                                    - {service.name}
                                </Text>
                            ))}
                        <Text style={styles.transPrice}>
                            {formatMoney(trans.price)}
                        </Text>
                    </View>
                ))
            ) : (
                <View style={styles.section}>
                    <Text style={styles.emptyText}>No transactions yet</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.primary,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    section: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    infoRow: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: COLORS.text,
    },
    infoValue: {
        color: COLORS.text,
    },
    transactionCard: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },
    transId: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    serviceName: {
        fontSize: 13,
        color: COLORS.gray,
        marginBottom: 2,
    },
    transPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'right',
        marginTop: 4,
    },
    emptyText: {
        color: COLORS.gray,
        fontSize: 14,
        textAlign: 'center',
        paddingVertical: 12,
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
