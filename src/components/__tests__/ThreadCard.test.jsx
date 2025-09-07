/*
 * Skenario Pengujian untuk Komponen ThreadCard
 * - Memastikan rendering judul dan isi thread
 * - Memastikan aksi upvote dan downvote berfungsi
 * - Memastikan penanganan suara netral
 * - Memastikan pesan kesalahan muncul jika pengguna tidak masuk saat mencoba memberikan suara
 * - Menggunakan mock store untuk Redux dan mock fungsi toast
 * - Menggunakan Vitest dan React Testing Library untuk pengujian
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThreadCard } from '../ThreadCard';
import { upVoteThread, downVoteThread, neutralizeThreadVote } from '@/states/thread/threadSlice';
import { toast } from 'sonner';

// Mock toast agar tidak benar-benar muncul
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

// Mock action creators
vi.mock('@/states/thread/threadSlice', () => ({
  upVoteThread: vi.fn((id) => ({ type: 'thread/upVote', payload: id })),
  downVoteThread: vi.fn((id) => ({ type: 'thread/downVote', payload: id })),
  neutralizeThreadVote: vi.fn((id) => ({ type: 'thread/neutralVote', payload: id }))
}));

const mockStore = configureStore([]);

describe('ThreadCard', () => {
  let store;
  const thread = {
    id: '1',
    title: 'Thread Title',
    body: '<p>Thread body content</p>',
    createdAt: new Date().toISOString(),
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 3,
    category: 'general',
    creator: {
      id: 'user-1',
      name: 'John Doe',
      avatar: ''
    }
  };

  beforeEach(() => {
    store = mockStore({
      auth: { user: { id: 'user-1', name: 'John Doe' } }
    });
    store.dispatch = vi.fn();
  });

  const renderComponent = (customThread = thread, customStore = store) => {
    return render(
      <Provider store={customStore}>
        <MemoryRouter>
          <ThreadCard thread={customThread} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('renders thread title and body', () => {
    renderComponent();

    expect(screen.getByText('Thread Title')).toBeInTheDocument();
    expect(screen.getByText('Thread body content')).toBeInTheDocument();
  });

  it('dispatches upVoteThread when clicking upvote', () => {
    renderComponent();

    const upVoteButton = screen.getByRole('button', { name: /upvote/i });
    fireEvent.click(upVoteButton);

    expect(store.dispatch).toHaveBeenCalledWith(upVoteThread('1'));
  });

  it('dispatches downVoteThread when clicking downvote', () => {
    renderComponent();

    const downVoteButton = screen.getByRole('button', { name: /downvote/i });
    fireEvent.click(downVoteButton);

    expect(store.dispatch).toHaveBeenCalledWith(downVoteThread('1'));
  });

  it('neutralizes vote if user already upvoted', () => {
    const threadWithUpVote = {
      ...thread,
      upVotesBy: ['user-1']
    };
    renderComponent(threadWithUpVote);

    const upVoteButton = screen.getByRole('button', { name: /upvote/i });
    fireEvent.click(upVoteButton);

    expect(store.dispatch).toHaveBeenCalledWith(neutralizeThreadVote('1'));
  });

  it('shows login error if user not logged in and tries to vote', () => {
    const noUserStore = mockStore({ auth: { user: null } });
    noUserStore.dispatch = vi.fn();

    renderComponent(thread, noUserStore);

    const upVoteButton = screen.getByRole('button', { name: /upvote/i });
    fireEvent.click(upVoteButton);

    expect(toast.error).toHaveBeenCalledWith(
      'Silakan login terlebih dahulu untuk memberikan suara.'
    );
    expect(noUserStore.dispatch).not.toHaveBeenCalled();
  });
});
