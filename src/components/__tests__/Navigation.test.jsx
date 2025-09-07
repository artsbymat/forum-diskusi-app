/**
 * Skenario test Navigation component:
 *
 * - Menampilkan judul "Forum Diskusi"
 * - Menampilkan tombol navigasi "Beranda" dan "Leaderboard"
 * - Jika user ada:
 *   - Menampilkan avatar dan nama user
 *   - Menampilkan tombol "Keluar"
 *   - Mengklik "Keluar" akan memanggil dispatch(logout()) dan navigate('/')
 * - Jika user tidak ada:
 *   - Menampilkan tombol "Masuk" (kecuali di halaman /login atau /register)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from '../Navigation';
import { logout } from '@/states/auth/authSlice';

// Mock redux dispatch
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
    Link: actual.Link
  };
});

// Mock logout action
vi.mock('@/states/auth/authSlice', () => ({
  logout: vi.fn(() => ({ type: 'auth/logout' }))
}));

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('menampilkan judul forum', () => {
    render(
      <MemoryRouter>
        <Navigation user={null} />
      </MemoryRouter>
    );
    expect(screen.getByText('Forum Diskusi')).toBeInTheDocument();
  });

  it('menampilkan tombol navigasi Beranda dan Leaderboard', () => {
    render(
      <MemoryRouter>
        <Navigation user={null} />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('button', { name: /beranda/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /leaderboard/i }).length).toBeGreaterThan(0);
  });

  it('menampilkan avatar dan tombol keluar jika user login', () => {
    const user = { id: 'u-1', name: 'John Doe', avatar: '' };
    render(
      <MemoryRouter>
        <Navigation user={user} />
      </MemoryRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keluar/i })).toBeInTheDocument();
  });

  it('mengklik keluar akan dispatch logout dan navigate ke /', () => {
    const user = { id: 'u-1', name: 'John Doe', avatar: '' };
    render(
      <MemoryRouter>
        <Navigation user={user} />
      </MemoryRouter>
    );
    const logoutButton = screen.getByRole('button', { name: /keluar/i });
    fireEvent.click(logoutButton);
    expect(mockDispatch).toHaveBeenCalledWith(logout());
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('menampilkan tombol masuk jika user tidak login', () => {
    render(
      <MemoryRouter>
        <Navigation user={null} />
      </MemoryRouter>
    );
    expect(screen.getByRole('button', { name: /masuk/i })).toBeInTheDocument();
  });
});
