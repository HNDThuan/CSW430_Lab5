import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddServiceScreen from './screens/AddServiceScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import EditServiceScreen from './screens/EditServiceScreen';
import UserScreen from './screens/UserScreen';
import CustomerScreen from './screens/CustomerScreen';
import AddCustomerScreen from './screens/AddCustomerScreen';
import TransactionScreen from './screens/TransactionScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';

import { enableScreens } from 'react-native-screens';
import { MenuProvider } from 'react-native-popup-menu';
import { COLORS } from './theme/color';

import Icon from 'react-native-vector-icons/MaterialIcons';

enableScreens();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{
          title: 'Add Service',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen name="Detail" component={ServiceDetailScreen} />
      <Stack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{
          title: 'Edit Service',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{
          title: 'User Profile',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

function TransactionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TransactionMain"
        component={TransactionScreen}
        options={{
          title: 'Transaction',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          title: 'Transaction detail',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

function CustomerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerMain"
        component={CustomerScreen}
        options={{
          title: 'Customer',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        options={{
          title: 'Add customer',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingMain"
        component={UserScreen}
        options={{
          title: 'Setting',
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Transaction') iconName = 'receipt-long';
          else if (route.name === 'Customer') iconName = 'people';
          else if (route.name === 'Setting') iconName = 'settings';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
      })}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Transaction" component={TransactionStack} />
      <Tab.Screen name="Customer" component={CustomerStack} />
      <Tab.Screen name="Setting" component={SettingStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
