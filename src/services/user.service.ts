// File: src/services/user.service.ts
import { API_BASE_URL } from '@/constants/config';
import type { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_STORAGE_KEY = '@terserah_jwt_token';
const USER_STORAGE_KEY = '@terserah_user_session';

// ==========================================
// 1. MANAJEMEN SESI & TOKEN (AsyncStorage)
// ==========================================

// Simpan Token JWT dan Data User ke HP
export async function saveAuthSession(token: string, user: User): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_STORAGE_KEY, token],
    [USER_STORAGE_KEY, JSON.stringify(user)],
  ]);
}

// Ambil Token JWT yang Tersimpan
export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_STORAGE_KEY);
}

// Ambil User yang Sedang Login dari HP
export async function getCurrentUser(): Promise<User> {
  const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    throw new Error('Belum ada sesi login aktif');
  }
  return JSON.parse(raw);
}

// LOGOUT: Hapus Token dan Data Sesi dari HP
export async function logoutUser(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
}

// ==========================================
// 2. FUNGSI AUTENTIKASI (Login & Register)
// ==========================================

// LOGIN: Menerima email/username dan password
export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Email atau kata sandi salah');
  }

  const user: User = {
    id: data.user.id,
    name: data.user.username,
    email: data.user.email,
  };

  await saveAuthSession(data.token, user);
  return user;
}

// REGISTER: Pendaftaran akun baru
export async function registerUser(username: string, email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Pendaftaran akun gagal');
  }

  const user: User = {
    id: data.user.id,
    name: data.user.username,
    email: data.user.email,
  };

  await saveAuthSession(data.token, user);
  return user;
}

// ==========================================
// 3. PENGATURAN PROFIL & KATA SANDI
// ==========================================

// Perbarui Nama & Email di Profil
export async function updateUserProfile(userId: string, name: string, email: string): Promise<User> {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name, email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memperbarui profil');
  }

  const updatedUser: User = {
    id: data.id,
    name: data.name,
    email: data.email,
    avatarUrl: data.avatarUrl,
  };

  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}

// Ubah Kata Sandi Akun (Saat User Sudah Login di Profil)
export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/users/change-password/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal memperbarui kata sandi');
  }
}

// Reset Kata Sandi (Sebelum Login / Lupa Sandi Menggunakan Email)
export async function resetPassword(email: string, newPassword: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/users/reset-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mereset kata sandi');
  }
}
// Ganti Foto Profil (upload multipart)
export async function updateUserAvatar(userId: string, localUri: string): Promise<User> {
  const token = await getAuthToken();

  const form = new FormData();
  form.append('avatar', {
    uri: localUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as unknown as Blob);

  const res = await fetch(`${API_BASE_URL}/profile/${userId}/avatar`, {
    method: 'PUT',
    // Jangan set Content-Type manual, biar boundary multipart diisi otomatis.
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Gagal mengunggah foto profil');
  }

  const current = await getCurrentUser();
  const updatedUser: User = { ...current, avatarUrl: data.avatarUrl };
  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}