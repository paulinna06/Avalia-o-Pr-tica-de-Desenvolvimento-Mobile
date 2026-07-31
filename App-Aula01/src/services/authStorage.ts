// src/services/authStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USERS_KEY = '@weatherapp:users';
const SESSION_KEY = '@weatherapp:session';

// --- Usuários cadastrados localmente ---

async function getUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();

  const exists = users.some((u) => u.email === normalizedEmail);
  if (exists) {
    return { success: false, message: 'Este e-mail já está cadastrado.' };
  }

  const newUser: User = { name: name.trim(), email: normalizedEmail, password };
  users.push(newUser);
  await saveUsers(users);
  console.log('[AuthStorage] Usuário cadastrado. Lista atual:', users);

  return { success: true, message: 'Cadastro realizado com sucesso!' };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; message: string; user?: User }> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await getUsers();
  console.log('[AuthStorage] Tentando logar com:', normalizedEmail, '| Usuários salvos:', users);

  const user = users.find(
    (u) => u.email === normalizedEmail && u.password === password
  );

  if (!user) {
    return { success: false, message: 'E-mail ou senha inválidos.' };
  }

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true, message: 'Login realizado com sucesso!', user };
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}