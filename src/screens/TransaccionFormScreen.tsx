import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { obtenerCuentas } from '../repositories/CuentaRepository';
import { obtenerCategorias } from '../repositories/CategoriaRepository';
import { crearTransaccion } from '../repositories/TransaccionRepository';
import type { Cuenta, Categoria } from '../types/modelos';

type TipoTransaccion = 'gasto' | 'ingreso';

// Fecha local -> YYYY-MM-DD (sin toISOString, que usa UTC)
function formatearFecha(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function TransaccionFormScreen() {
  const navigation = useNavigation();

  const [tipo, setTipo] = useState<TipoTransaccion>('gasto');
  const [monto, setMonto] = useState('');
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cuentaId, setCuentaId] = useState<string | null>(null);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [fecha, setFecha] = useState(new Date());
  const [nota, setNota] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // Los repositories son sincronos (getAllSync), no hace falta await
    setCuentas(obtenerCuentas());
    setCategorias(obtenerCategorias());
  }, []);

  function guardar() {
    // Acepta coma o punto decimal
    const montoNumero = parseFloat(monto.replace(',', '.'));

    if (isNaN(montoNumero) || montoNumero <= 0) {
      Alert.alert('Monto invalido', 'Ingresa un monto mayor a 0.');
      return;
    }
    if (!cuentaId) {
      Alert.alert('Falta la cuenta', 'Elige una cuenta.');
      return;
    }
    if (!categoriaId) {
      Alert.alert('Falta la categoria', 'Elige una categoria.');
      return;
    }

    try {
      setGuardando(true);
      crearTransaccion(
        montoNumero,
        tipo,
        cuentaId,
        categoriaId,
        formatearFecha(fecha),
        nota.trim() === '' ? null : nota.trim()
      );
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la transaccion.');
      setGuardando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tipo */}
        <Text style={styles.etiqueta}>Tipo</Text>
        <View style={styles.fila}>
          {(['gasto', 'ingreso'] as TipoTransaccion[]).map((t) => (
            <Pressable
              key={t}
              style={[styles.chip, styles.chipGrande, tipo === t && styles.chipActivo]}
              onPress={() => setTipo(t)}
            >
              <Text style={[styles.chipTexto, tipo === t && styles.chipTextoActivo]}>
                {t === 'gasto' ? 'Gasto' : 'Ingreso'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Monto */}
        <Text style={styles.etiqueta}>Monto (S/)</Text>
        <TextInput
          style={styles.input}
          value={monto}
          onChangeText={setMonto}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />

        {/* Cuenta */}
        <Text style={styles.etiqueta}>Cuenta</Text>
        <View style={styles.grilla}>
          {cuentas.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, cuentaId === c.id && styles.chipActivo]}
              onPress={() => setCuentaId(c.id)}
            >
              <Text style={[styles.chipTexto, cuentaId === c.id && styles.chipTextoActivo]}>
                {c.nombre}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Categoria */}
        <Text style={styles.etiqueta}>Categoria</Text>
        <View style={styles.grilla}>
          {categorias.map((c) => (
            <Pressable
              key={c.id}
              style={[styles.chip, categoriaId === c.id && styles.chipActivo]}
              onPress={() => setCategoriaId(c.id)}
            >
              <Text style={[styles.chipTexto, categoriaId === c.id && styles.chipTextoActivo]}>
                {c.nombre}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Fecha */}
        <Text style={styles.etiqueta}>Fecha</Text>
        <View style={styles.fila}>
          <DateTimePicker
            value={fecha}
            mode="date"
            display="compact"
            maximumDate={new Date()}
            onChange={(_, seleccionada) => {
              if (seleccionada) setFecha(seleccionada);
            }}
          />
        </View>

        {/* Nota */}
        <Text style={styles.etiqueta}>Nota (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputNota]}
          value={nota}
          onChangeText={setNota}
          placeholder="Ej. Almuerzo"
          multiline
        />

        <Pressable
          style={[styles.boton, guardando && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
        >
          <Text style={styles.botonTexto}>{guardando ? 'Guardando...' : 'Guardar'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contenido: { padding: 16, paddingBottom: 40 },
  etiqueta: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#444' },
  fila: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  chipGrande: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  chipActivo: { backgroundColor: '#2563eb' },
  chipTexto: { color: '#333', fontSize: 15 },
  // Sin fontWeight aqui: la negrita ensancha el chip y mueve a sus vecinos
  chipTextoActivo: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputNota: { minHeight: 70, textAlignVertical: 'top' },
  boton: {
    marginTop: 28,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonDeshabilitado: { opacity: 0.6 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '700' },
});