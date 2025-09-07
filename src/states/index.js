import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import threadReducer from './thread/threadSlice';
import threadDetailReducer from './threadDetail/threadDetailSlice';
import leaderboardReducer from './leaderboard/leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    thread: threadReducer,
    threadDetail: threadDetailReducer,
    leaderboard: leaderboardReducer
  }
});

export default store;
