// src/repositories/CuentaRepository.ts
import { db } from '../database/db';
import { randomUUID } from 'expo-crypto'; // npx expo install expo-crypto

export function crearCuenta(nombre: string, tipo: string, saldoInicial: number) {
  const id = randomUUID();
  db.runSync(
    `INSERT INTO Cuenta (id, nombre, tipo, saldoInicial, saldoActual) VALUES (?, ?, ?, ?, ?)`,
    [id, nombre, tipo, saldoInicial, saldoInicial]
  );
  return id;
}

export function obtenerCuentas() {
    return db.getAllSync(`SELECT * FROM Cuenta`);
}

export function actualizarCuenta(id: string, nombre: string, tipo: string) { 
    db.runSync( `UPDATE Cuenta SET nombre = ?, tipo = ? WHERE id = ?`, [nombre, tipo, id] ); 
}

export function eliminarCuenta(id: string) { 
    db.runSync(`DELETE FROM Cuenta WHERE id = ?`, [id]); 
}

