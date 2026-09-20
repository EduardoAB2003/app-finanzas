import { db } from '../database/db'; 
import { randomUUID } from 'expo-crypto';

export function crearCategoria(nombre: string, icono: string | null, esPersonalizada: boolean) { 
    const id = randomUUID(); 
    db.runSync( 
        `INSERT INTO Categoria (id, nombre, icono, esPersonalizada) VALUES (?, ?, ?, ?)`, 
        [id, nombre, icono, esPersonalizada ? 1 : 0] 
    ); 
    return id; 
}

export function obtenerCategorias() { 
    return db.getAllSync(`SELECT * FROM Categoria`); 
} 

export function actualizarCategoria(id: string, nombre: string, icono: string | null) { 
    db.runSync( 
        `UPDATE Categoria SET nombre = ?, icono = ? WHERE id = ?`, 
        [nombre, icono, id] 
    ); 
}

export function eliminarCategoria(id: string) { 
    db.runSync(`DELETE FROM Categoria WHERE id = ?`, [id]); 
}

export function seedCategoriasSiVacio() {
  const categorias = db.getAllSync(`SELECT * FROM Categoria`);
  if (categorias.length === 0) {
    const predefinidas = ['Comida', 'Transporte', 'Servicios', 'Educación', 'Entretenimiento', 'Varios'];
    predefinidas.forEach((nombre) => {
      db.runSync(
        `INSERT INTO Categoria (id, nombre, esPersonalizada) VALUES (?, ?, 0)`,
        [randomUUID(), nombre]
      );
    });
  }
}