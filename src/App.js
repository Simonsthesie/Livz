import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MyEvents from './pages/MyEvents';
import PhotoGalleryPage from './pages/PhotoGalleryPage';
import Slideshow from './components/Slideshow';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');

  const handleLogin = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token);
  };

  const handleLogout = () => {
    setAuthToken('');
    localStorage.removeItem('authToken');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={authToken ? <Navigate to="/all-events" /> : <LoginPage onLogin={handleLogin} />}
      />
      <Route
        path="/sign-up"
        element={<RegisterPage />}
      />
      <Route
        path="/all-events"
        element={authToken ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      <Route
        path="/my-events"
        element={authToken ? <MyEvents onLogout={handleLogout} /> : <Navigate to="/login" />}
      />
      <Route
        path="/events/:eventId/photos"
        element={authToken ? <PhotoGalleryPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/slideshow"
        element={authToken ? <Slideshow /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;