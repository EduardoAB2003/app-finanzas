import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initSchema } from './src/database/schema';
import { seedCategoriasSiVacio } from './src/repositories/CategoriaRepository';
import CuentasScreen from './src/screens/CuentasScreen';
import TransaccionFormScreen from './src/screens/TransaccionFormScreen';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initSchema();
    seedCategoriasSiVacio();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Cuentas"
            component={CuentasScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NuevaTransaccion"
            component={TransaccionFormScreen}
            options={{ title: 'Nueva transacción' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

