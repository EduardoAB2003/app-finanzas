// src/types/modelos.ts
// Forma de las filas tal como las devuelve SQLite.

export type Cuenta = {
  id: string;
  nombre: string;
  tipo: string;
  saldoInicial: number;
  saldoActual: number;
};

export type Categoria = {
  id: string;
  nombre: string;
  icono: string | null;
  esPersonalizada: number; // SQLite no tiene boolean: 0 = predefinida, 1 = personalizada
};