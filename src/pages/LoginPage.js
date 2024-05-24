import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Scrollbar from 'smooth-scrollbar';
import '../styles/LoginPage.css'; // Import CSS for light and dark modes

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

  useEffect(() => {
    const handleResize = () => {
      const sidenav = document.querySelector('#sidenav');
      const referenceButtons = document.querySelector('#reference-buttons');

      if (sidenav) {
        // Your existing logic for sidenav
      } else {
        console.warn('sidenav element not found');
      }

      if (referenceButtons) {
        // Your existing logic for referenceButtons
      } else {
        console.warn('referenceButtons element not found');
      }
    };

    const loadScripts = () => {
      const scripts = [
        '/assets/js/core/popper.min.js',
        '/assets/js/core/bootstrap.min.js',
        '/assets/js/plugins/perfect-scrollbar.min.js',
        '/assets/js/plugins/smooth-scrollbar.min.js',
        'https://buttons.github.io/buttons.js'
      ];

      scripts.forEach((src) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      });
    };

    const initScrollbar = () => {
      const win = navigator.platform.indexOf('Win') > -1;
      if (win && document.querySelector('#sidenav-scrollbar')) {
        const options = {
          damping: '0.5'
        };
        Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
      }
    };

    loadScripts();
    initScrollbar();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`container-fluid min-vh-100 d-flex align-items-center justify-content-center ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="row w-100">
        <div className="col-lg-6 col-md-8 col-12 mx-auto">
          <div className={`card shadow-lg ${isDarkMode ? 'bg-dark-mode text-light-mode' : 'bg-white text-dark'}`}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <img src="/assets/img/Livz.png" alt="Logo de l'entreprise" className="img-fluid" style={{ maxWidth: '150px' }} />
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="font-weight-bolder text-center text-info text-gradient">Bon retour</h3>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="darkModeToggle"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <label className="form-check-label" htmlFor="darkModeToggle">
                    {isDarkMode ? 'Mode clair' : 'Mode sombre'}
                  </label>
                </div>
              </div>
              <p className="text-center mb-4">Entrez votre email et mot de passe pour vous connecter</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="email-addon"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Mot de passe"
                    aria-label="Mot de passe"
                    aria-describedby="password-addon"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">Se souvenir de moi</label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-info bg-gradient-info w-100 mt-2">Se connecter</button>
                </div>
              </form>
              <div className="text-center pt-4">
                <p className="text-sm">
                  Vous n'avez pas de compte ?
                  <a href="/sign-up" className="text-info text-gradient font-weight-bold"> S'inscrire</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
