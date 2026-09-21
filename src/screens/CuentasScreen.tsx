import { useState, useCallback } from 'react';
import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerCuentas, crearCuenta, actualizarCuenta, eliminarCuenta } from '../repositories/CuentaRepository';
import CuentaForm from '../components/CuentaForm';

interface Cuenta {
  id: string;
  nombre: string;
  tipo: string;
  saldoInicial: number;
  saldoActual: number;
  icono: string | null;
}

export default function CuentasScreen() {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [cuentaEditando, setCuentaEditando] = useState<Cuenta | null>(null);

  const cargarCuentas = useCallback(() => {
    setCuentas(obtenerCuentas() as Cuenta[]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarCuentas();
    }, [cargarCuentas])
  );

  function cerrarFormulario() {
    setFormularioVisible(false);
    setCuentaEditando(null);
    cargarCuentas();
  }

  function manejarGuardar(nombre: string, tipo: string, saldoInicial: number) {
    if (cuentaEditando) {
      actualizarCuenta(cuentaEditando.id, nombre, tipo);
    } else {
      crearCuenta(nombre, tipo, saldoInicial);
    }
    cerrarFormulario();
  }

  function manejarEliminar() {
    if (cuentaEditando) {
      eliminarCuenta(cuentaEditando.id);
    }
    cerrarFormulario();
  }

  function renderCuenta({ item }: { item: Cuenta }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setCuentaEditando(item);
          setFormularioVisible(true);
        }}
      >
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>
        <Text style={styles.saldo}>S/ {item.saldoActual.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cuentas}
        keyExtractor={(item) => item.id}
        renderItem={renderCuenta}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no tienes cuentas. Crea la primera con el botón +</Text>
        }
        contentContainerStyle={cuentas.length === 0 && styles.vacioContainer}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setFormularioVisible(true)}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
      <CuentaForm
        visible={formularioVisible}
        cuentaInicial={cuentaEditando ?? undefined}
        onGuardar={manejarGuardar}
        onCancelar={cerrarFormulario}
        onEliminar={cuentaEditando ? manejarEliminar : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  nombre: { fontSize: 16, fontWeight: '600' },
  tipo: { fontSize: 13, color: '#888', marginTop: 2 },
  saldo: { fontSize: 22, fontWeight: 'bold', marginTop: 8 },
  vacio: { textAlign: 'center', color: '#888', paddingHorizontal: 32 },
  vacioContainer: { flex: 1, justifyContent: 'center' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabTexto: { color: '#fff', fontSize: 30, lineHeight: 32 },
});