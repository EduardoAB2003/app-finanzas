import { useState } from 'react';
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface CuentaFormProps {
  visible: boolean;
  cuentaInicial?: { nombre: string; tipo: string; saldoInicial: number };
  onGuardar: (nombre: string, tipo: string, saldoInicial: number) => void;
  onCancelar: () => void;
  onEliminar?: () => void;
}

const TIPOS = ['efectivo', 'cuenta bancaria', 'tarjeta de crédito', 'tarjeta de débito', 'otro'];

export default function CuentaForm({ visible, cuentaInicial, onGuardar, onCancelar, onEliminar }: CuentaFormProps) {
  const [nombre, setNombre] = useState(cuentaInicial?.nombre ?? '');
  const [tipo, setTipo] = useState(cuentaInicial?.tipo ?? TIPOS[0]);
  const [saldoInicial, setSaldoInicial] = useState(
    cuentaInicial ? String(cuentaInicial.saldoInicial) : ''
  );

  function manejarGuardar() {
    const monto = parseFloat(saldoInicial) || 0;
    onGuardar(nombre, tipo, monto);
  }

  function manejarEliminar() {
    Alert.alert(
      '¿Eliminar cuenta?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onEliminar },
      ]
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.fondo}>
            <View style={styles.card}>
              <Text style={styles.titulo}>
                {cuentaInicial ? 'Editar cuenta' : 'Nueva cuenta'}
              </Text>

              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej. Efectivo"
              />

              <Text style={styles.label}>Tipo</Text>
              <View style={styles.chips}>
                {TIPOS.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.chip, tipo === t && styles.chipSeleccionado]}
                    onPress={() => setTipo(t)}
                  >
                    <Text style={tipo === t ? styles.chipTextoSeleccionado : styles.chipTexto}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {!cuentaInicial && (
                <>
                  <Text style={styles.label}>Saldo inicial</Text>
                  <TextInput
                    style={styles.input}
                    value={saldoInicial}
                    onChangeText={setSaldoInicial}
                    keyboardType="numeric"
                    placeholder="0.00"
                    inputAccessoryViewID="saldoInputAccessory"
                  />
                </>
              )}

              {cuentaInicial && onEliminar && (
                <TouchableOpacity style={styles.botonEliminar} onPress={manejarEliminar}>
                  <Text style={styles.botonEliminarTexto}>Eliminar cuenta</Text>
                </TouchableOpacity>
              )}

              <View style={styles.botones}>
                <TouchableOpacity style={styles.botonCancelar} onPress={onCancelar}>
                  <Text>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botonGuardar} onPress={manejarGuardar}>
                  <Text style={styles.botonGuardarTexto}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID="saldoInputAccessory">
          <View style={styles.accesorio}>
            <TouchableOpacity onPress={Keyboard.dismiss}>
              <Text style={styles.accesorioTexto}>Listo</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  card: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 13, color: '#666', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#eee' },
  chipSeleccionado: { backgroundColor: '#2563eb' },
  chipTexto: { color: '#333', fontSize: 13 },
  chipTextoSeleccionado: { color: '#fff', fontSize: 13 },
  botones: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 12 },
  botonCancelar: { padding: 12 },
  botonGuardar: { backgroundColor: '#2563eb', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8 },
  botonGuardarTexto: { color: '#fff', fontWeight: '600' },
  botonEliminar: { marginTop: 16, alignItems: 'center' },
  botonEliminarTexto: { color: '#dc2626', fontWeight: '600' },
  accesorio: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    alignItems: 'flex-end',
  },
  accesorioTexto: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
    paddingHorizontal: 12,
  },
});