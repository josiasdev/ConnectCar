import * as SQLite from 'expo-sqlite';
import { User } from '../types/user';



export interface Order {
  id: string;
  payload: any;
  status: 'pending' | 'completed' | 'in_progress';
}

export interface DeliveryProof {
  id?: number; // Opcional pois é autoincrementado
  order_id: string;
  signature_path: string | null;
  photo_path: string | null;
  notes: string | null;
  created_at: string;
  synced: 0 | 1; // 0 para não sincronizado, 1 para sincronizado
}

const db = SQLite.openDatabaseSync('connectcar.db');


export const initDatabase = async () => {

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS delivery_proofs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      signature_path TEXT,
      photo_path TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0
    );

    
  `);
  console.log("Banco de dados inicializado com sucesso!");
};



export const addUser = async (name: string, email: string, password: string): Promise<SQLite.SQLiteRunResult> => {
  const result = await db.runAsync(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  console.log("Usuário adicionado");
  return result;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?', 
    [email]
  );
  return user ?? null;
};

export const addOrUpdateOrdersBatch = async (orders: Order[]): Promise<void> => {
  await db.withTransactionAsync(async () => {
    for (const order of orders) {
      await db.runAsync(
        'INSERT OR REPLACE INTO orders (id, payload, status) VALUES (?, ?, ?)',
        [order.id, JSON.stringify(order.payload), order.status]
      );
    }
  });
  console.log(`${orders.length} pedidos salvos no banco de dados local.`);
};


export const getOrders = async (status?: Order['status']): Promise<Order[]> => {
    let query = 'SELECT * FROM orders';
    const params: string[] = [];

    if (status) {
        query += ' WHERE status = ?';
        params.push(status);
    }

    const results = await db.getAllAsync<any>(query, params);
    // O payload é armazenado como JSON, então precisamos fazer o parse ao ler.
    return results.map(item => ({...item, payload: JSON.parse(item.payload)}));
};



export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<SQLite.SQLiteRunResult> => {
    return await db.runAsync('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
};


export const addDeliveryProof = async (proof: Omit<DeliveryProof, 'id' | 'created_at' | 'synced'>): Promise<SQLite.SQLiteRunResult> => {
    const createdAt = new Date().toISOString();
    return await db.runAsync(
        'INSERT INTO delivery_proofs (order_id, signature_path, photo_path, notes, created_at) VALUES (?, ?, ?, ?, ?)',
        [proof.order_id, proof.signature_path, proof.photo_path, proof.notes, createdAt]
    );
};

export const getUnsyncedProofs = async (): Promise<DeliveryProof[]> => {
    return await db.getAllAsync<DeliveryProof>('SELECT * FROM delivery_proofs WHERE synced = 0 ORDER BY created_at ASC');
};

export const markProofAsSynced = async (proofId: number): Promise<SQLite.SQLiteRunResult> => {
    return await db.runAsync('UPDATE delivery_proofs SET synced = 1 WHERE id = ?', [proofId]);
};

