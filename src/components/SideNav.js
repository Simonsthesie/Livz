import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const SideNav = ({ onLogout, isOpen, toggleSideNav }) => {
  const [userData, setUserData] = useState(null);
  const authToken = localStorage.getItem('authToken'); // Récupérer authToken du localStorage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://livz-backend-user.weaverize.com/users', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserData(response.data);
        console.log(response.data); // Affiche les informations de l'utilisateur dans la console
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [authToken]);

  useEffect(() => {
    document.body.classList.toggle('blur-background', isOpen);
    return () => {
      document.body.classList.remove('blur-background');
    };
  }, [isOpen]);

  if (!userData) {
    return <div>Loading user information...</div>;
  }

  const { username, selfieUrl } = userData;

  return (
    <aside className={`sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-gradient-dark ${isOpen ? 'g-sidenav-pinned' : ''}`} id="sidenav-main">
      <div className="sidenav-header d-flex justify-content-between align-items-center">
        <a className="navbar-brand m-0 d-flex align-items-center" href="#">
            <img src="/assets/img/Livz.png" className="navbar-brand-img w-100 h-100" alt="company_logo" />
        </a>
        <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-xl-none" aria-hidden="true" id="iconSidenav" onClick={toggleSideNav}></i>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div className="collapse navbar-collapse w-auto" id="sidenav-collapse-main">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link text-white active bg-gradient-primary" to="/all-events">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">event</i>
              </div>
              <span className="nav-link-text ms-1">Tous les événements</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link text-white" to="/my-events">
              <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                <i className="material-icons opacity-10">event_note</i>
              </div>
              <span className="nav-link-text ms-1">Mes événements</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <hr className="horizontal light mt-0 mb-2" />
      <div className="sidenav-footer position-absolute w-100 bottom-0 mb-3">
        <div className="d-flex align-items-center justify-content-between px-3">
          {selfieUrl ? (
            <img src={selfieUrl} className="avatar avatar-sm" alt="profile" style={{ width: '30px', height: '30px' }} />
          ) : (
            <i className="fa fa-user-circle fa-lg text-white"></i>
          )}
          <span className="ms-1 font-weight-bold text-white" style={{ fontSize: '14px' }}>{username}</span>
          <div className="d-flex align-items-center">
            <button className="btn btn-icon btn-outline-primary" onClick={onLogout} style={{ padding: '5px' }}>
              <i className="material-icons" style={{ fontSize: '20px' }}>logout</i>
            </button>
            <NavLink to="/settings" className="btn btn-icon btn-outline-secondary ms-2" style={{ padding: '5px' }}>
              <i className="material-icons" style={{ fontSize: '20px' }}>settings</i>
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
