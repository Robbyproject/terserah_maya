// File: src/services/user.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '@/constants/config';
import type { User } from '@/types';

const TOKEN_STORAGE_KEY = '@terserah_jwt_token';
const USER_STORAGE_KEY = '@terserah_user_session';

// ==========================================
// 0. VALIDASI STANDAR (§1 Kontrak API)
// ==========================================

export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const STRONG_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const AUTH_VALIDATION_MESSAGES = {
  usernameLength: 'Nama harus 3–30 karakter & hanya boleh huruf, angka, atau underscore (_).',
  emailInvalid: 'Format email tidak valid.',
  passwordWeak: 'Kata sandi minimal 8 karakter & harus kombinasi huruf + angka + simbol.',
  passwordMismatch: 'Konfirmasi kata sandi tidak cocok.',
};

export type OtpPurpose = 'register' | 'reset';

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function parseResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // Abaikan jika body bukan JSON
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || fallbackMessage,
      res.status,
      data?.code
    );
  }

  return data as T;
}

// ==========================================
// 1. MANAJEMEN SESI & TOKEN (AsyncStorage)
// ==========================================

export async function saveAuthSession(token: string, user: User): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_STORAGE_KEY, token],
    [USER_STORAGE_KEY, JSON.stringify(user)],
  ]);
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_STORAGE_KEY);
}

export async function getCurrentUser(): Promise<User> {
  const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    throw new Error('Belum ada sesi login aktif');
  }
  return JSON.parse(raw);
}

export async function logoutUser(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
}

// ==========================================
// 2. REGISTER & OTP (§2 Kontrak API)
// ==========================================

export type RegisterResponse = {
  message: string;
  email: string;
};

/**
 * POST /users/register
 * Tidak menerbitkan JWT; mengirim kode OTP 6 digit ke email user (HTTP 202).
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password, // Jangan di-trim sesuai §1
    }),
  });

  return parseResponse<RegisterResponse>(res, 'Pendaftaran akun gagal.');
}

/**
 * POST /users/verify-otp
 * Verifikasi kode OTP 6 digit untuk register -> menerbitkan JWT & auto-login (HTTP 200).
 */
export async function verifyOtp(
  email: string,
  code: string,
  purpose: OtpPurpose = 'register'
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE_URL}/users/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      code: code.trim(),
      purpose,
    }),
  });

  const data = await parseResponse<{
    token: string;
    user: { id: string; username: string; email: string };
  }>(res, 'Kode verifikasi salah atau kedaluwarsa.');

  const user: User = {
    id: data.user.id,
    name: data.user.username,
    email: data.user.email,
  };

  await saveAuthSession(data.token, user);
  return { user, token: data.token };
}

/**
 * POST /users/resend-otp
 * Kirim ulang kode OTP (cooldown 60 detik -> 429 jika terlalu cepat).
 */
export async function resendOtp(
  email: string,
  purpose: OtpPurpose
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      purpose,
    }),
  });

  return parseResponse<{ message: string }>(
    res,
    'Gagal mengirim ulang kode verifikasi.'
  );
}

// ==========================================
// 3. LOGIN (§3 Kontrak API)
// ==========================================

/**
 * POST /users/login
 * Jika 403 EMAIL_NOT_VERIFIED, melempar ApiError dengan err.code === 'EMAIL_NOT_VERIFIED'.
 */
export async function loginUser(emailOrUsername: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailOrUsername.trim(),
      password, // Jangan di-trim sesuai §1
    }),
  });

  const data = await parseResponse<{
    token: string;
    user: { id: string; username: string; email: string };
  }>(res, 'Email atau kata sandi salah!');

  const user: User = {
    id: data.user.id,
    name: data.user.username,
    email: data.user.email,
  };

  await saveAuthSession(data.token, user);
  return user;
}

// ==========================================
// 4. GANTI PASSWORD & LUPA PASSWORD (§4 Kontrak API)
// ==========================================

/**
 * PUT /users/change-password/:userId (Saat SUDAH login dari Profil - §4.1)
 */
export async function changeUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/users/change-password/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  return parseResponse<{ message: string }>(res, 'Gagal memperbarui kata sandi.');
}

/**
 * POST /users/forgot-password (Langkah 1 Lupa Password - §4.2)
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  return parseResponse<{ message: string }>(
    res,
    'Gagal mengirim permintaan reset kata sandi.'
  );
}

/**
 * POST /users/reset-password (Langkah 2 Lupa Password dengan Kode OTP - §4.2)
 */
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/users/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      code: code.trim(),
      newPassword,
    }),
  });

  return parseResponse<{ message: string }>(
    res,
    'Kode verifikasi salah atau kedaluwarsa.'
  );
}

// ==========================================
// 5. PROFIL (§5 Kontrak API)
// ==========================================

export async function updateUserProfile(
  userId: string,
  name: string,
  email: string
): Promise<User> {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
  });

  const data = await parseResponse<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }>(res, 'Gagal memperbarui profil.');

  const updatedUser: User = {
    id: data.id,
    name: data.name,
    email: data.email,
    avatarUrl: data.avatarUrl,
  };

  await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
}