import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.tsx';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Settings from './pages/Settings.tsx';
import Profile from './pages/Profile.tsx';
import Navbar from './components/Navbar.tsx';
import { useAuth } from './store/useAuth.store.ts';
import SignupVerify from './pages/SignupVerify.tsx';
import { useTheme } from './store/useTheme.store.ts';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuth();

  const { theme } = useTheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex ite justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div
      data-theme={theme}
      style={
        {
          '--rounded-box': '1rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem'
        } as React.CSSProperties
      }
    >
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/signup/verify"
          element={!authUser ? <SignupVerify /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/settings"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
