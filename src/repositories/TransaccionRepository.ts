import { db } from '../database/db'; 
import { randomUUID } from 'expo-crypto';

export function crearTransaccion( monto: number, tipo: 'ingreso' | 'gasto', cuentaId: string, categoriaId: string | null, fecha: string, nota: string | null ) { 
    const id = randomUUID(); db.runSync( 
        `INSERT INTO Transaccion (id, monto, tipo, cuentaId, categoriaId, fecha, nota) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [id, monto, tipo, cuentaId, categoriaId, fecha, nota] ); const operador = tipo === 'gasto' ? '-' : '+'; 
        db.runSync( 
            `UPDATE Cuenta SET saldoActual = saldoActual ${operador} ? WHERE id = ?`, 
            [monto, cuentaId] 
        ); 
    return id; 
}

export function obtenerTransacciones() { 
    return db.getAllSync(`SELECT * FROM Transaccion ORDER BY fecha DESC`); 
}

export function obtenerTransaccionesPorCuenta(cuentaId: string) { 
    return db.getAllSync( `SELECT * FROM Transaccion WHERE cuentaId = ? ORDER BY fecha DESC`, [cuentaId] ); 
}

export function eliminarTransaccion(id: string) { 
    const transaccion = db.getFirstSync( `SELECT * FROM Transaccion WHERE id = ?`, [id] ) as any; 
    if (!transaccion) return; 
    db.runSync(`DELETE FROM Transaccion WHERE id = ?`, [id]); 
    const ajuste = transaccion.tipo === 'gasto' ? transaccion.monto : -transaccion.monto; 
    db.runSync( `UPDATE Cuenta SET saldoActual = saldoActual + ? WHERE id = ?`, [ajuste, transaccion.cuentaId] ); 
}