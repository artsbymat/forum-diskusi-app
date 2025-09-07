/**
 * Skenario Pengujian threadSlice:
 *
 * 1. fetchThreads
 *    - pending: state.loading true, error null
 *    - fulfilled: threads terisi, loading false, error null
 *    - rejected: threads tetap, loading false, error terisi
 * 2. fetchUsers
 *    - pending: state.loading true, error null
 *    - fulfilled: users terisi, loading false, error null
 *    - rejected: users tetap, loading false, error terisi
 * 3. fetchThreadsAndUsers
 *    - pending: state.loading true, error null
 *    - fulfilled: threads & users terisi, loading false, error null
 *    - rejected: threads & users tetap, loading false, error terisi
 * 4. addThread
 *    - pending: state.posting true, error null
 *    - fulfilled: thread baru ditambahkan ke awal threads, posting false
 *    - rejected: posting false, error terisi
 * 5. upVoteThread
 *    - fulfilled: upVotesBy thread diupdate sesuai userId & voteType
 * 6. downVoteThread
 *    - fulfilled: downVotesBy thread diupdate sesuai userId & voteType
 * 7. neutralizeThreadVote
 *    - fulfilled: userId dihapus dari upVotesBy & downVotesBy
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, {
  fetchThreads,
  fetchUsers,
  fetchThreadsAndUsers,
  addThread,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote
} from '../threadSlice';

vi.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    getAllThreads: vi.fn(),
    getAllUsers: vi.fn(),
    addThread: vi.fn(),
    upVoteThread: vi.fn(),
    downVoteThread: vi.fn(),
    neutralizeThreadVote: vi.fn()
  }
}));

describe('threadSlice', () => {
  const initialState = {
    threads: [],
    users: [],
    loading: false,
    posting: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  // 1. fetchThreads
  it('should handle fetchThreads.pending', () => {
    const action = { type: fetchThreads.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchThreads.fulfilled', () => {
    const threads = [{ id: 1, title: 'A' }];
    const action = { type: fetchThreads.fulfilled.type, payload: threads };
    const state = reducer(undefined, action);
    expect(state.threads).toEqual(threads);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchThreads.rejected', () => {
    const action = { type: fetchThreads.rejected.type, payload: 'err' };
    const prevState = { ...initialState, threads: [{ id: 1 }] };
    const state = reducer(prevState, action);
    expect(state.threads).toEqual([{ id: 1 }]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });

  // 2. fetchUsers
  it('should handle fetchUsers.pending', () => {
    const action = { type: fetchUsers.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUsers.fulfilled', () => {
    const users = [{ id: 1, name: 'User' }];
    const action = { type: fetchUsers.fulfilled.type, payload: users };
    const state = reducer(undefined, action);
    expect(state.users).toEqual(users);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUsers.rejected', () => {
    const action = { type: fetchUsers.rejected.type, payload: 'err' };
    const prevState = { ...initialState, users: [{ id: 1 }] };
    const state = reducer(prevState, action);
    expect(state.users).toEqual([{ id: 1 }]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });

  // 3. fetchThreadsAndUsers
  it('should handle fetchThreadsAndUsers.pending', () => {
    const action = { type: fetchThreadsAndUsers.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchThreadsAndUsers.fulfilled', () => {
    const threads = [{ id: 1, title: 'A' }];
    const users = [{ id: 1, name: 'User' }];
    const action = { type: fetchThreadsAndUsers.fulfilled.type, payload: { threads, users } };
    const state = reducer(undefined, action);
    expect(state.threads).toEqual(threads);
    expect(state.users).toEqual(users);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchThreadsAndUsers.rejected', () => {
    const action = { type: fetchThreadsAndUsers.rejected.type, payload: 'err' };
    const prevState = { ...initialState, threads: [{ id: 1 }], users: [{ id: 2 }] };
    const state = reducer(prevState, action);
    expect(state.threads).toEqual([{ id: 1 }]);
    expect(state.users).toEqual([{ id: 2 }]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });

  // 4. addThread
  it('should handle addThread.pending', () => {
    const action = { type: addThread.pending.type };
    const state = reducer(undefined, action);
    expect(state.posting).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle addThread.fulfilled', () => {
    const users = [{ id: 1, name: 'User' }];
    const prevState = { ...initialState, users, threads: [{ id: 2 }] };
    const thread = { id: 3, title: 'Baru', ownerId: 1 };
    const action = { type: addThread.fulfilled.type, payload: thread };
    const state = reducer(prevState, action);
    expect(state.threads[0].id).toBe(3);
    expect(state.threads[0].creator).toEqual(users[0]);
    expect(state.posting).toBe(false);
  });

  it('should handle addThread.rejected', () => {
    const action = { type: addThread.rejected.type, payload: 'err' };
    const prevState = { ...initialState, posting: true };
    const state = reducer(prevState, action);
    expect(state.posting).toBe(false);
    expect(state.error).toBe('err');
  });

  // 5. upVoteThread
  it('should handle upVoteThread.fulfilled', () => {
    const thread = { id: 1, upVotesBy: [], downVotesBy: [2], ownerId: 1 };
    const prevState = { ...initialState, threads: [thread] };
    const action = {
      type: upVoteThread.fulfilled.type,
      payload: { threadId: 1, vote: { userId: 2, voteType: 1 } }
    };
    const state = reducer(prevState, action);
    expect(state.threads[0].upVotesBy).toContain(2);
    expect(state.threads[0].downVotesBy).not.toContain(2);
  });

  // 6. downVoteThread
  it('should handle downVoteThread.fulfilled', () => {
    const thread = { id: 1, upVotesBy: [2], downVotesBy: [], ownerId: 1 };
    const prevState = { ...initialState, threads: [thread] };
    const action = {
      type: downVoteThread.fulfilled.type,
      payload: { threadId: 1, vote: { userId: 2, voteType: -1 } }
    };
    const state = reducer(prevState, action);
    expect(state.threads[0].downVotesBy).toContain(2);
    expect(state.threads[0].upVotesBy).not.toContain(2);
  });

  // 7. neutralizeThreadVote
  it('should handle neutralizeThreadVote.fulfilled', () => {
    const thread = { id: 1, upVotesBy: [2], downVotesBy: [2], ownerId: 1 };
    const prevState = { ...initialState, threads: [thread] };
    const action = {
      type: neutralizeThreadVote.fulfilled.type,
      payload: { threadId: 1, vote: { userId: 2 } }
    };
    const state = reducer(prevState, action);
    expect(state.threads[0].upVotesBy).not.toContain(2);
    expect(state.threads[0].downVotesBy).not.toContain(2);
  });
});
