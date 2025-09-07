import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchThreads = createAsyncThunk(
  'thread/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const threads = await api.getAllThreads();
      return threads;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUsers = createAsyncThunk('thread/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const users = await api.getAllUsers();
    return users;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Tambah thread baru
export const addThread = createAsyncThunk(
  'thread/addThread',
  async ({ title, category, body }, { rejectWithValue }) => {
    try {
      const thread = await api.addThread({ title, category, body });
      return thread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Ambil threads + users
export const fetchThreadsAndUsers = createAsyncThunk(
  'thread/fetchThreadsAndUsers',
  async (_, { rejectWithValue }) => {
    try {
      const [threads, users] = await Promise.all([api.getAllThreads(), api.getAllUsers()]);
      const threadsList = threads.map((thread) => ({
        ...thread,
        creator: users.find((user) => user.id === thread.ownerId)
      }));
      return { threads: threadsList, users };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// threadSlice.js
export const upVoteThread = createAsyncThunk(
  'thread/upVoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      const vote = await api.upVoteThread(threadId);
      return { threadId, vote };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const downVoteThread = createAsyncThunk(
  'thread/downVoteThread',
  async (threadId, { rejectWithValue }) => {
    try {
      const vote = await api.downVoteThread(threadId);
      return { threadId, vote };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const neutralizeThreadVote = createAsyncThunk(
  'thread/neutralizeThreadVote',
  async (threadId, { rejectWithValue }) => {
    try {
      const vote = await api.neutralizeThreadVote(threadId);
      return { threadId, vote };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  threads: [],
  users: [],
  loading: false,
  posting: false,
  error: null
};

const threadSlice = createSlice({
  name: 'thread',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch threads only
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
        state.error = null;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch users only
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch threads and users
      .addCase(fetchThreadsAndUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadsAndUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload.threads;
        state.users = action.payload.users;
        state.error = null;
      })
      .addCase(fetchThreadsAndUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Thread
      .addCase(addThread.pending, (state) => {
        state.posting = true;
        state.error = null;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.posting = false;
        const newThread = {
          ...action.payload,
          creator: state.users.find((u) => u.id === action.payload.ownerId)
        };
        state.threads.unshift(newThread);
      })
      .addCase(addThread.rejected, (state, action) => {
        state.posting = false;
        state.error = action.payload;
      })
      .addCase(upVoteThread.fulfilled, (state, action) => {
        const { threadId, vote } = action.payload;
        const thread = state.threads.find((t) => t.id === threadId);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== vote.userId);
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== vote.userId);
          if (vote.voteType === 1) thread.upVotesBy.push(vote.userId);
        }
      })
      .addCase(downVoteThread.fulfilled, (state, action) => {
        const { threadId, vote } = action.payload;
        const thread = state.threads.find((t) => t.id === threadId);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== vote.userId);
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== vote.userId);
          if (vote.voteType === -1) thread.downVotesBy.push(vote.userId);
        }
      })
      .addCase(neutralizeThreadVote.fulfilled, (state, action) => {
        const { threadId, vote } = action.payload;
        const thread = state.threads.find((t) => t.id === threadId);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== vote.userId);
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== vote.userId);
        }
      });
  }
});

export default threadSlice.reducer;
