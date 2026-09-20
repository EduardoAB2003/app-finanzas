// src/database/db.ts
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('finanzas.db');