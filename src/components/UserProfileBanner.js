// src/components/UserProfileBanner.js
import React from 'react';
import '../styles/UserProfileBanner.css';

const UserProfileBanner = ({ username, selfieUrl }) => {
  return (
    <div className="user-profile-banner">
      <img src={selfieUrl} alt={`${username}'s profile`} className="profile-image" />
      <span className="username">{username}</span>
    </div>
  );
};

export default UserProfileBanner;
