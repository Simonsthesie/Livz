import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://livz-backend-user.weaverize.com/users', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        console.log('User fetched:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user information', error);
      }
    };

    fetchUser();
  }, [authToken]);

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div className="user-profile">
      <img
        src={user.selfieUrl || 'default-avatar.png'} // Placeholder if no selfieUrl is provided
        alt="User Avatar"
        className="user-avatar"
      />
      <h2>{user.username}</h2>
      <div className="user-info">
        <p><i className="fas fa-envelope"></i> {user.email}</p>
        <p><i className="fas fa-user-tag"></i> {user.role}</p>
        <p><i className="fas fa-check-circle"></i> Confirmed Email: {user.confirmedEmail ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default UserProfile;
