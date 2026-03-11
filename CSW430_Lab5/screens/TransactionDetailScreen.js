import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';

const formatMoney = amount => {
    if (!amount && amount !== 0) return '0 đ';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const formatDateTime = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = n => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function TransactionDetailScreen({ route }) {
    const { id } = route.params;
    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        const loadTransaction = async () => {
            try {
                const res = await api.get(`/transactions/${id}`);
                setTransaction(res.data);
            } catch (e) {
                console.log('Error loading transaction:', e);
            }
        };
        loadTransaction();
    }, [id]);

    if (!transaction) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const servicesTotal = transaction.services
        ? transaction.services.reduce(
            (sum, s) => sum + s.price * (s.quantity || 1),
            0,
        )
        : 0;

    const discount = transaction.price - servicesTotal;

    return (
        <ScrollView style={styles.container}>
            {/* General Information */}
            <Text style={styles.sectionTitle}>General information</Text>
            <View style={styles.section}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Transaction code</Text>
                    <Text style={styles.infoValue}>{transaction.id}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Customer</Text>
                    <Text style={styles.infoValue}>
                        {transaction.customer?.name} - {transaction.customer?.phone}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Creation time</Text>
                    <Text style={styles.infoValue}>
                        {formatDateTime(transaction.createdAt)}
                    </Text>
                </View>
            </View>

            {/* Services List */}
            <Text style={styles.sectionTitle}>Services list</Text>
            <View style={styles.section}>
                {transaction.services &&
                    transaction.services.map((service, index) => (
                        <View key={service._id || index} style={styles.serviceRow}>
                            <Text style={styles.serviceName} numberOfLines={2}>
                                {service.name}
                            </Text>
                            <Text style={styles.serviceQty}>x{service.quantity || 1}</Text>
                            <Text style={styles.servicePrice}>
                                {formatMoney(service.price)}
                            </Text>
                        </View>
                    ))}
                <View style={[styles.serviceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{formatMoney(servicesTotal)}</Text>
                </View>
            </View>

            {/* Cost */}
            <Text style={styles.sectionTitle}>Cost</Text>
            <View style={styles.section}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Amount of money</Text>
                    <Text style={styles.infoValue}>{formatMoney(servicesTotal)}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Discount</Text>
                    <Text style={styles.infoValue}>
                        {discount < 0 ? formatMoney(discount) : formatMoney(0)}
                    </Text>
                </View>
                <View style={[styles.infoRow, styles.paymentRow]}>
                    <Text style={styles.paymentLabel}>Total payment</Text>
                    <Text style={styles.paymentValue}>
                        {formatMoney(transaction.price)}
                    </Text>
                </View>
            </View>
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
        paddingVertical: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.gray,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
    },
    serviceName: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    serviceQty: {
        fontSize: 14,
        color: COLORS.gray,
        marginHorizontal: 12,
    },
    servicePrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'right',
        minWidth: 80,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 4,
        paddingTop: 8,
    },
    totalLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'right',
        minWidth: 80,
    },
    paymentRow: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginTop: 4,
        paddingTop: 8,
    },
    paymentLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    paymentValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
});
