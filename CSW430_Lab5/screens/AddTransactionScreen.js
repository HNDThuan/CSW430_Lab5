import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import api from '../api/api';
import { COLORS } from '../theme/color';
import { Dropdown } from 'react-native-element-dropdown';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function AddTransactionScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedServices, setSelectedServices] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [custRes, svcRes] = await Promise.all([
                api.get('/customers'),
                api.get('/services'),
            ]);
            setCustomers(custRes.data);
            setServices(svcRes.data);
        } catch (e) {
            console.log('Error loading data:', e);
        }
    };
    console.log("services:", services)

    const toggleService = (serviceId, isChecked) => {
        setSelectedServices(prev => {
            const updated = { ...prev };
            if (isChecked) {
                updated[serviceId] = {
                    _id: serviceId,
                    quantity: 1,
                };
            } else {
                delete updated[serviceId];
            }
            return updated;
        });
    };

    const updateQuantity = (serviceId, delta) => {
        setSelectedServices(prev => {
            const updated = { ...prev };
            if (updated[serviceId]) {
                const newQty = Math.max(1, updated[serviceId].quantity + delta);
                updated[serviceId] = { ...updated[serviceId], quantity: newQty };
            }
            return updated;
        });
    };

    const getTotalPrice = () => {
        let total = 0;
        Object.keys(selectedServices).forEach(serviceId => {
            const service = services.find(s => s._id === serviceId);
            if (service) {
                total += service.price * selectedServices[serviceId].quantity;
            }
        });
        return total;
    };

    const handleSubmit = async () => {
        if (!selectedCustomer) {
            Alert.alert('Error', 'Please select a customer');
            return;
        }

        const selectedList = Object.values(selectedServices);
        if (selectedList.length === 0) {
            Alert.alert('Error', 'Please select at least one service');
            return;
        }

        try {
            const servicesPayload = selectedList.map(s => ({
                _id: s._id,
                quantity: s.quantity,
            }));

            await api.post('/transactions', {
                customerId: selectedCustomer,
                services: servicesPayload,
            });

            Alert.alert('Success', 'Transaction added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (e) {
            Alert.alert('Error', 'Failed to add transaction');
            console.log('Add transaction error:', e);
        }
    };

    const customerDropdownData = customers.map(c => ({
        label: c.name + ' - ' + c.phone,
        value: c._id,
    }));

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Customer Dropdown */}
                <Text style={styles.label}>Customer *</Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={customerDropdownData}
                    labelField="label"
                    valueField="value"
                    placeholder="Select customer"
                    value={selectedCustomer}
                    onChange={item => setSelectedCustomer(item.value)}
                />

                {/* Services List */}
                {services.map(service => {
                    const isSelected = !!selectedServices[service._id];
                    return (
                        <View key={service._id} style={styles.serviceItem}>
                            <BouncyCheckbox
                                size={25}
                                fillColor={COLORS.primary}
                                unFillColor={COLORS.white}
                                isChecked={isSelected}
                                onPress={isChecked =>
                                    toggleService(service._id, isChecked)
                                }
                                disableBuiltInState={false}
                                text={service.name}
                                textStyle={[
                                    styles.serviceName,
                                    isSelected && styles.serviceNameSelected,
                                    { textDecorationLine: 'none' },
                                ]}
                            />

                            {isSelected && (
                                <View style={styles.serviceControls}>
                                    <View style={styles.quantityRow}>
                                        <View style={styles.quantityControls}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() =>
                                                    updateQuantity(service._id, -1)
                                                }>
                                                <Text style={styles.qtyBtnText}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.qtyValue}>
                                                {selectedServices[service._id]?.quantity || 1}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() =>
                                                    updateQuantity(service._id, 1)
                                                }>
                                                <Text style={styles.qtyBtnText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.executorLabel}>Executor</Text>
                                    </View>
                                    <Text style={styles.servicePrice}>
                                        Price:{' '}
                                        <Text style={{ color: COLORS.primary }}>
                                            {formatMoney(
                                                service.price *
                                                (selectedServices[service._id]
                                                    ?.quantity || 1),
                                            )}
                                        </Text>
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Summary Button */}
            <TouchableOpacity style={styles.summaryButton} onPress={handleSubmit}>
                <Text style={styles.summaryButtonText}>
                    See summary: ({formatMoney(getTotalPrice())})
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const formatMoney = amount => {
    if (!amount && amount !== 0) return '0 đ';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 6,
    },
    dropdown: {
        backgroundColor: COLORS.white,
        borderRadius: 4,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    placeholderStyle: {
        color: COLORS.gray,
        fontSize: 15,
    },
    selectedTextStyle: {
        color: COLORS.text,
        fontSize: 15,
    },
    serviceItem: {
        backgroundColor: COLORS.white,
        borderRadius: 4,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    serviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceName: {
        fontSize: 15,
        color: COLORS.text,
        flex: 1,
    },
    serviceNameSelected: {
        fontWeight: 'bold',
    },
    serviceControls: {
        marginTop: 8,
        paddingLeft: 36,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
    },
    qtyBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: '#ddd',
    },
    qtyBtnText: {
        fontSize: 18,
        color: COLORS.text,
    },
    qtyValue: {
        paddingHorizontal: 12,
        fontSize: 15,
        color: COLORS.text,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 6,
    },
    executorLabel: {
        color: COLORS.gray,
        fontSize: 14,
    },
    servicePrice: {
        fontSize: 14,
        color: COLORS.text,
    },
    summaryButton: {
        backgroundColor: COLORS.primary,
        padding: 14,
        margin: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    summaryButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
