/**
 * Skenario pengujian untuk authSlice:
 *
 * 1. Register User
 *    - Berhasil: state.user terisi, loading false, error null
 *    - Gagal: state.user null, loading false, error terisi
 * 2. Login User
 *    - Berhasil: state.user terisi, loading false, error null
 *    - Gagal: state.user null, loading false, error terisi
 * 3. Fetch Profile
 *    - Berhasil: state.user terisi, loading false, error null
 *    - Gagal: state.user null, loading false, error terisi
 * 4. Logout
 *    - state.user menjadi null, token dihapus
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { registerUser, loginUser, fetchProfile, logout } from '../authSlice';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    register: vi.fn(),
    login: vi.fn(),
    putAccessToken: vi.fn(),
    getOwnProfile: vi.fn()
  }
}));

describe('authSlice', () => {
  const initialState = {
    user: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test scenarios will be implemented here
  it('should have initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  // Register User - Success
  it('should handle registerUser.fulfilled', () => {
    const user = { id: 1, name: 'test', email: 'test@mail.com' };
    const action = { type: registerUser.fulfilled.type, payload: { user } };
    const state = reducer(undefined, action);
    expect(state).toEqual({
      user,
      loading: false,
      error: null
    });
  });

  // Register User - Failed
  it('should handle registerUser.rejected', () => {
    const action = { type: registerUser.rejected.type, payload: 'Register error' };
    const state = reducer(undefined, action);
    expect(state).toEqual({
      user: null,
      loading: false,
      error: 'Register error'
    });
  });

  // Register User - Pending
  it('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Login User - Success
  it('should handle loginUser.fulfilled', () => {
    const user = { id: 2, name: 'login', email: 'login@mail.com' };
    const action = { type: loginUser.fulfilled.type, payload: { user } };
    const state = reducer(undefined, action);
    expect(state).toEqual({
      user,
      loading: false,
      error: null
    });
  });

  // Login User - Failed
  it('should handle loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type, payload: 'Login error' };
    const state = reducer(undefined, action);
    expect(state).toEqual({
      user: null,
      loading: false,
      error: 'Login error'
    });
  });

  // Login User - Pending
  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Fetch Profile - Success
  it('should handle fetchProfile.fulfilled', () => {
    const user = { id: 3, name: 'profile', email: 'profile@mail.com' };
    const action = { type: fetchProfile.fulfilled.type, payload: { user } };
    const state = reducer(undefined, action);
    expect(state).toEqual({
      user,
      loading: false,
      error: null
    });
  });

  // Fetch Profile - Failed
  it('should handle fetchProfile.rejected', () => {
    const prevState = { user: { id: 1 }, loading: false, error: null };
    const action = { type: fetchProfile.rejected.type, payload: 'Profile error' };
    const state = reducer(prevState, action);
    expect(state).toEqual({
      user: null,
      loading: false,
      error: 'Profile error'
    });
  });

  // Fetch Profile - Pending
  it('should handle fetchProfile.pending', () => {
    const action = { type: fetchProfile.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  // Logout
  it('should handle logout', () => {
    const prevState = { user: { id: 1 }, loading: false, error: null };
    const state = reducer(prevState, logout());
    expect(state.user).toBeNull();
    expect(api.putAccessToken).toHaveBeenCalledWith('');
  });
});
