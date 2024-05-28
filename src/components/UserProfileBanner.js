// src/components/UserProfileBanner.js
import React from 'react';
import '../styles/UserProfileBanner.css';

const UserProfileBanner = ({ username, selfieUrl }) => {
  const displayName = username ? username : 'participant(e) de l\'événement';
  return (
    <div className="user-profile-banner">
      {selfieUrl ? (
        <img src={selfieUrl} alt={`${displayName}'s profile`} className="profile-image" />
      ) : (
        <i className="fas fa-user profile-placeholder"></i>
      )}
      <span className="username">{displayName}</span>
    </div>
  );
};

export default UserProfileBanner;
