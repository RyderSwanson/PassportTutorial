import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, getUserProfile, loading, error } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [getUserProfile]);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div className="error">Not logged in</div>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-info">
        <div className="profile-field">
          <span className="field-label">Username:</span>
          <span className="field-value">{user.username}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Email:</span>
          <span className="field-value">{user.email}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Account Created:</span>
          <span className="field-value">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="profile-note">
        <p>This is a protected route, only accessible when authenticated.</p>
      </div>
    </div>
  );
};

export default Profile;
