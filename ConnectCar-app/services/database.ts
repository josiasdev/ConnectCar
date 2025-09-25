import * as SQLite from 'expo-sqlite';
import { User } from '../types/user';

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