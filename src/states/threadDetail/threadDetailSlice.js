import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { upVoteThread, downVoteThread, neutralizeThreadVote } from '@/states/thread/threadSlice';

function updateVoteArray(item, userId, voteType) {
  item.upVotesBy = item.upVotesBy.filter((id) => id !== userId);
  item.downVotesBy = item.downVotesBy.filter((id) => id !== userId);
  if (voteType === 1) item.upVotesBy.push(userId);
  if (voteType === -1) item.downVotesBy.push(userId);
}

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const detail = await api.getThreadDetail(threadId);
      return detail;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addThreadComment = createAsyncThunk(
  'threadDetail/addThreadComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const comment = await api.addThreadDetailComment({ threadId, content });
      return { threadId, comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const upVoteComment = createAsyncThunk(
  'threadDetail/upVoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      const vote = await api.upVoteComment(threadId, commentId);
      return { threadId, commentId, vote };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const downVoteComment = createAsyncThunk(
  'threadDetail/downVoteComment',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      const vote = await api.downVoteComment(threadId, commentId);
      return { threadId, commentId, vote };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const neutralizeCommentVote = createAsyncThunk(
  'threadDetail/neutralizeCommentVote',
  async ({ threadId, commentId }, { rejectWithValue }) => {
    try {
      const vote = await api.neutralizeCommentVote(threadId, commentId);
      return { threadId, commentId, vote };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  thread: null,
  loading: false,
  error: null,
  uploading: false
};

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    clearThreadDetail(state) {
      state.thread = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch thread detail
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
        state.error = null;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add comment
      .addCase(addThreadComment.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(addThreadComment.fulfilled, (state, action) => {
        state.uploading = false;
        if (state.thread && state.thread.comments) {
          state.thread.comments.unshift(action.payload.comment);
        }
      })
      .addCase(addThreadComment.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(upVoteThread.fulfilled, (state, action) => {
        const { threadId, vote } = action.payload;
        if (state.thread && state.thread.id === threadId) {
          updateVoteArray(state.thread, vote.userId, vote.voteType);
        }
      })
      .addCase(downVoteThread.fulfilled, (state, action) => {
        const { threadId, vote } = action.payload;
        if (state.thread && state.thread.id === threadId) {
          updateVoteArray(state.thread, vote.userId, vote.voteType);
        }
      })
      .addCase(neutralizeThreadVote.fulfilled, (state, action) => {
        const { threadId, vote } = action.payload;
        if (state.thread && state.thread.id === threadId) {
          updateVoteArray(state.thread, vote.userId, 0);
        }
      })

      // Comment votes
      .addCase(upVoteComment.fulfilled, (state, action) => {
        const { commentId, vote } = action.payload;
        const comment = state.thread?.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== vote.userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== vote.userId);
          if (vote.voteType === 1) comment.upVotesBy.push(vote.userId);
        }
      })
      .addCase(downVoteComment.fulfilled, (state, action) => {
        const { commentId, vote } = action.payload;
        const comment = state.thread?.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== vote.userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== vote.userId);
          if (vote.voteType === -1) comment.downVotesBy.push(vote.userId);
        }
      })
      .addCase(neutralizeCommentVote.fulfilled, (state, action) => {
        const { commentId, vote } = action.payload;
        const comment = state.thread?.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== vote.userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== vote.userId);
        }
      });
  }
});

export const { clearThreadDetail } = threadDetailSlice.actions;
export default threadDetailSlice.reducer;
