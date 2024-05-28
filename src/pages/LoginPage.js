import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Import CSS for additional styles

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('https://livz-backend-user.weaverize.com/auth/login', { email, password });
      const token = data.token;
      onLogin(token);
      if (rememberMe) {
        localStorage.setItem('authToken', token);
      }
      navigate('/events');
    } catch (error) {
      console.error('Erreur de connexion', error);
    }
  };

  return (
    <div className={`container-fluid min-vh-100 d-flex align-items-center justify-content-center ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="row w-100">
        <div className="col-lg-4 col-md-6 col-12 mx-auto">
          <div className={`card shadow-lg ${isDarkMode ? 'bg-dark-mode text-light-mode' : 'bg-white text-dark'}`}>
            <div className={`card-header text-center ${isDarkMode ? 'bg-dark-mode' : ''}`}>
              <img src="/assets/img/Livz.png" alt="Logo de l'entreprise" className="img-fluid mb-3" style={{ maxWidth: '150px' }} />
              <h4 className="card-title">Se connecter</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="input-group input-group-outline mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group input-group-outline mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-check form-switch d-flex align-items-center mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label ms-3 mb-0" htmlFor="rememberMe">Se souvenir de moi</label>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary w-100">Se connecter</button>
                </div>
              </form>
              <div className="text-center pt-3">
                <p className="mb-0">
                  Vous n'avez pas de compte ? <a href="/sign-up" className="text-primary">S'inscrire</a>
                </p>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="darkModeToggle"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <label className="form-check-label ms-3 mb-0" htmlFor="darkModeToggle">
                    {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
