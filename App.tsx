import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initSchema } from './src/database/schema';
import { seedCategoriasSiVacio } from './src/repositories/CategoriaRepository';
import CuentasScreen from './src/screens/CuentasScreen';

export default function App() {
  useEffect(() => {
    initSchema();
    seedCategoriasSiVacio();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <CuentasScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

