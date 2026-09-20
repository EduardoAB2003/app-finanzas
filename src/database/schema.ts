// src/database/schema.ts
import { db } from './db';

export function initSchema() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS Cuenta (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL,
      saldoInicial REAL NOT NULL,
      saldoActual REAL NOT NULL,
      icono TEXT
    );

    CREATE TABLE IF NOT EXISTS Categoria (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      icono TEXT,
      esPersonalizada INTEGER NOT NULL DEFAULT 0,
      limitePresupuesto REAL
    );

    CREATE TABLE IF NOT EXISTS Transaccion (
      id TEXT PRIMARY KEY,
      monto REAL NOT NULL,
      tipo TEXT NOT NULL,
      cuentaId TEXT NOT NULL,
      cuentaDestinoId TEXT,
      categoriaId TEXT,
      fecha TEXT NOT NULL,
      nota TEXT,
      esRecurrente INTEGER NOT NULL DEFAULT 0,
      frecuencia TEXT,
      FOREIGN KEY (cuentaId) REFERENCES Cuenta(id),
      FOREIGN KEY (categoriaId) REFERENCES Categoria(id)
    );
  `);
}