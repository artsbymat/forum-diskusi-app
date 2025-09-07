/**
 * Skenario Pengujian threadDetailSlice:
 *
 * 1. fetchThreadDetail
 *    - pending: state.loading true, error null
 *    - fulfilled: thread terisi, loading false, error null
 *    - rejected: thread tetap, loading false, error terisi
 * 2. addThreadComment
 *    - pending: state.uploading true, error null
 *    - fulfilled: comment baru ditambahkan ke awal thread.comments, uploading false
 *    - rejected: uploading false, error terisi
 * 3. clearThreadDetail
 *    - state.thread null, loading false, error null
 * 4. upVoteThread/downVoteThread/neutralizeThreadVote (dari threadSlice)
 *    - fulfilled: upVotesBy/downVotesBy thread diupdate sesuai userId & voteType
 * 5. upVoteComment/downVoteComment/neutralizeCommentVote
 *    - fulfilled: upVotesBy/downVotesBy comment diupdate sesuai userId & voteType
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, {
  fetchThreadDetail,
  addThreadComment,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
  clearThreadDetail
} from '../threadDetailSlice';

// Mock threadSlice thunks
import * as threadSlice from '@/states/thread/threadSlice';

vi.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    getThreadDetail: vi.fn(),
    addThreadDetailComment: vi.fn(),
    upVoteComment: vi.fn(),
    downVoteComment: vi.fn(),
    neutralizeCommentVote: vi.fn()
  }
}));

// Mock threadSlice thunks for upVoteThread, downVoteThread, neutralizeThreadVote
vi.mock('@/states/thread/threadSlice', () => ({
  __esModule: true,
  upVoteThread: { fulfilled: { type: 'thread/upVoteThread/fulfilled' } },
  downVoteThread: { fulfilled: { type: 'thread/downVoteThread/fulfilled' } },
  neutralizeThreadVote: { fulfilled: { type: 'thread/neutralizeThreadVote/fulfilled' } }
}));

describe('threadDetailSlice', () => {
  const initialState = {
    thread: null,
    loading: false,
    error: null,
    uploading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  // 1. fetchThreadDetail
  it('should handle fetchThreadDetail.pending', () => {
    const action = { type: fetchThreadDetail.pending.type };
    const state = reducer(undefined, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchThreadDetail.fulfilled', () => {
    const thread = { id: 1, title: 'A', comments: [] };
    const action = { type: fetchThreadDetail.fulfilled.type, payload: thread };
    const state = reducer(undefined, action);
    expect(state.thread).toEqual(thread);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchThreadDetail.rejected', () => {
    const prevState = { ...initialState, thread: { id: 1 } };
    const action = { type: fetchThreadDetail.rejected.type, payload: 'err' };
    const state = reducer(prevState, action);
    expect(state.thread).toEqual({ id: 1 });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('err');
  });

  // 2. addThreadComment
  it('should handle addThreadComment.pending', () => {
    const action = { type: addThreadComment.pending.type };
    const state = reducer(undefined, action);
    expect(state.uploading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle addThreadComment.fulfilled', () => {
    const prevThread = { id: 1, comments: [{ id: 2, content: 'old' }] };
    const prevState = { ...initialState, thread: prevThread };
    const comment = { id: 3, content: 'new' };
    const action = { type: addThreadComment.fulfilled.type, payload: { threadId: 1, comment } };
    const state = reducer(prevState, action);
    expect(state.thread.comments[0]).toEqual(comment);
    expect(state.uploading).toBe(false);
  });

  it('should handle addThreadComment.rejected', () => {
    const prevState = { ...initialState, uploading: true };
    const action = { type: addThreadComment.rejected.type, payload: 'err' };
    const state = reducer(prevState, action);
    expect(state.uploading).toBe(false);
    expect(state.error).toBe('err');
  });

  // 3. clearThreadDetail
  it('should handle clearThreadDetail', () => {
    const prevState = { ...initialState, thread: { id: 1 }, loading: true, error: 'err' };
    const state = reducer(prevState, clearThreadDetail());
    expect(state.thread).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  // 4. upVoteThread/downVoteThread/neutralizeThreadVote
  it('should handle upVoteThread.fulfilled', () => {
    const prevThread = { id: 1, upVotesBy: [], downVotesBy: [2], comments: [] };
    const prevState = { ...initialState, thread: prevThread };
    const action = {
      type: threadSlice.upVoteThread.fulfilled.type,
      payload: { threadId: 1, vote: { userId: 2, voteType: 1 } }
    };
    const state = reducer(prevState, action);
    expect(state.thread.upVotesBy).toContain(2);
    expect(state.thread.downVotesBy).not.toContain(2);
  });

  it('should handle downVoteThread.fulfilled', () => {
    const prevThread = { id: 1, upVotesBy: [2], downVotesBy: [], comments: [] };
    const prevState = { ...initialState, thread: prevThread };
    const action = {
      type: threadSlice.downVoteThread.fulfilled.type,
      payload: { threadId: 1, vote: { userId: 2, voteType: -1 } }
    };
    const state = reducer(prevState, action);
    expect(state.thread.downVotesBy).toContain(2);
    expect(state.thread.upVotesBy).not.toContain(2);
  });

  it('should handle neutralizeThreadVote.fulfilled', () => {
    const prevThread = { id: 1, upVotesBy: [2], downVotesBy: [2], comments: [] };
    const prevState = { ...initialState, thread: prevThread };
    const action = {
      type: threadSlice.neutralizeThreadVote.fulfilled.type,
      payload: { threadId: 1, vote: { userId: 2 } }
    };
    const state = reducer(prevState, action);
    expect(state.thread.upVotesBy).not.toContain(2);
    expect(state.thread.downVotesBy).not.toContain(2);
  });

  // 5. upVoteComment/downVoteComment/neutralizeCommentVote
  it('should handle upVoteComment.fulfilled', () => {
    const comment = { id: 10, upVotesBy: [], downVotesBy: [2] };
    const prevThread = { id: 1, comments: [comment] };
    const prevState = { ...initialState, thread: prevThread };
    const action = {
      type: upVoteComment.fulfilled.type,
      payload: { threadId: 1, commentId: 10, vote: { userId: 2, voteType: 1 } }
    };
    const state = reducer(prevState, action);
    expect(state.thread.comments[0].upVotesBy).toContain(2);
    expect(state.thread.comments[0].downVotesBy).not.toContain(2);
  });

  it('should handle downVoteComment.fulfilled', () => {
    const comment = { id: 10, upVotesBy: [2], downVotesBy: [] };
    const prevThread = { id: 1, comments: [comment] };
    const prevState = { ...initialState, thread: prevThread };
    const action = {
      type: downVoteComment.fulfilled.type,
      payload: { threadId: 1, commentId: 10, vote: { userId: 2, voteType: -1 } }
    };
    const state = reducer(prevState, action);
    expect(state.thread.comments[0].downVotesBy).toContain(2);
    expect(state.thread.comments[0].upVotesBy).not.toContain(2);
  });

  it('should handle neutralizeCommentVote.fulfilled', () => {
    const comment = { id: 10, upVotesBy: [2], downVotesBy: [2] };
    const prevThread = { id: 1, comments: [comment] };
    const prevState = { ...initialState, thread: prevThread };
    const action = {
      type: neutralizeCommentVote.fulfilled.type,
      payload: { threadId: 1, commentId: 10, vote: { userId: 2 } }
    };
    const state = reducer(prevState, action);
    expect(state.thread.comments[0].upVotesBy).not.toContain(2);
    expect(state.thread.comments[0].downVotesBy).not.toContain(2);
  });
});
