import * as SQLite from 'expo-sqlite';
import { Order, OrderPayload } from '../types/order'; // Supondo que você tenha esses tipos
import { User } from '../types/user'; // Supondo que você tenha esses tipos

// Abre o banco de dados de forma síncrona. 
// O objeto 'db' fica disponível para todas as funções neste arquivo.
const db = SQLite.openDatabaseSync('connectcar_db.db');

// --- FUNÇÃO DE INICIALIZAÇÃO ---
// Cria as tabelas se elas não existirem.
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
      status TEXT NOT NULL,
      "scheduled_for" TEXT NOT NULL
    );
  `);
  console.log("Banco de dados inicializado com sucesso!");
};

// --- FUNÇÕES DE USUÁRIO (Mantidas como você fez) ---
export const addUser = async (name: string, email: string, password: string) => {
  return await db.runAsync(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
};

export const updateUserName = async (userId: number, newName: string) => {
  return await db.runAsync('UPDATE users SET name = ? WHERE id = ?', [newName, userId]);
};

export const updateUserPassword = async (userId: number, newPassword: string) => {
  return await db.runAsync('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return user ?? null;
};


// --- FUNÇÕES DE PEDIDOS (CORRIGIDAS E COMPLETAS) ---

/**
 * Adiciona um novo pedido ao banco de dados.
 * Converte o objeto de detalhes do pedido em uma string JSON para armazenar na coluna 'payload'.
 */
export const addOrder = async (orderId: string, payload: OrderPayload, scheduledFor: string) => {
  const payloadString = JSON.stringify(payload);
  const statusInicial = 'Pendente';

   return await db.runAsync(
    'INSERT INTO orders (id, payload, status, scheduled_for) VALUES (?, ?, ?, ?)',
    [orderId, payloadString, statusInicial, scheduledFor]
  );
};

/**
 * Busca todos os pedidos, opcionalmente filtrando por status.
 * Converte a string JSON do 'payload' de volta para um objeto ao ler os dados.
 */
export const getOrders = async (scheduledFor: string): Promise<Order[]> => {
  let query = 'SELECT * FROM orders WHERE scheduled_for = ?';
  const params = [scheduledFor];

  const results = await db.getAllAsync<any>(query, params);
  return results.map(item => ({
    ...item,
    payload: JSON.parse(item.payload),
  }));
};

/**
 * Busca um único pedido pelo seu ID.
 * Também converte o 'payload' de JSON para objeto.
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    const result = await db.getFirstAsync<any>(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
    );

    if (!result) {
        return null;
    }

    return {
        ...result,
        payload: JSON.parse(result.payload), // E aqui também!
    };
};

/**
 * Atualiza o status de um pedido existente.
 */
export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  return await db.runAsync('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
};

export const getActiveOrdersCount = async (): Promise<number> => {
  const query = `SELECT count(*) as count FROM orders WHERE status = 'Pendente' OR status = 'Em trânsito'`;
  
  // Usamos getFirstAsync porque esperamos apenas uma linha como resultado (a contagem)
  const result = await db.getFirstAsync<{ count: number }>(query);
  
  return result?.count ?? 0;
};