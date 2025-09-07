/**
 * Skenario Pengujian leaderboardSlice:
 *
 * 1. fetchLeaderboard
 *    - pending: state.loading true, error null
 *    - fulfilled: leaderboards terisi, loading false, error null
 *    - rejected: leaderboards tetap, loading false, error terisi
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { fetchLeaderboard } from '../leaderboardSlice';

vi.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    getLeaderboard: vi.fn()
  }
}));

describe('leaderboardSlice', () => {
  const initialState = {
    leaderboards: [],
    loading: false,
    error: null
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle fetchLeaderboard.pending', () => {
    const action = { type: fetchLeaderboard.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchLeaderboard.fulfilled', () => {
    const leaderboards = [{ user: { id: 1, name: 'A' }, score: 100 }];
    const action = { type: fetchLeaderboard.fulfilled.type, payload: leaderboards };
    const state = reducer(undefined, action);
    expect(state.leaderboards).toEqual(leaderboards);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchLeaderboard.rejected', () => {
    const prevState = { ...initialState, leaderboards: [{ user: { id: 1 }, score: 50 }] };
    const action = { type: fetchLeaderboard.rejected.type, payload: 'err' };
    const state = reducer(prevState, action);
    expect(state.leaderboards).toEqual([{ user: { id: 1 }, score: 50 }]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });
});
