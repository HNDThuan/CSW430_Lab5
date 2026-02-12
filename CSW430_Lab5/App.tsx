import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddServiceScreen from './screens/AddServiceScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import EditServiceScreen from './screens/EditServiceScreen';
import UserScreen from './screens/UserScreen';
import { enableScreens } from 'react-native-screens';
import { MenuProvider } from 'react-native-popup-menu';
import { COLORS } from './theme/color';
enableScreens();

const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="Home" component={HomeScreen} />
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
      </NavigationContainer>
    </MenuProvider>
  );
}
