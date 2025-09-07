import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import HomePage from '@/pages/Home';
import LeaderboardPage from '@/pages/Leaderboard';
import NewThreadPage from '@/pages/CreateNewThread';
import DetailThread from '@/pages/DetailThread';
import NotFound from '@/pages/NotFound';
import { Navigation } from '@/components/Navigation';

import { Toaster } from '@/components/ui/sonner';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '@/states/auth/authSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Toaster richColors />
        <Navigation user={user} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/threads/:id" element={<DetailThread />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {user && <Route path="/new" element={<NewThreadPage />} />}
        </Routes>
      </Router>
    </>
  );
}

export default App;
