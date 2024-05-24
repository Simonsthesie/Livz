import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventListPage from './pages/EventListPage';
import PhotoGalleryPage from './pages/PhotoGalleryPage';

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
        element={authToken ? <Navigate to="/events" /> : <LoginPage onLogin={handleLogin} />}
      />
      <Route
        path="/sign-up"
        element={<RegisterPage />}
      />
      <Route
        path="/events"
        element={authToken ? <EventListPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/events/:eventId/photos"
        element={authToken ? <PhotoGalleryPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;
