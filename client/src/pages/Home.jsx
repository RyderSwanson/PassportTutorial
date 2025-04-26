import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <h1>Welcome to Passport.js Authentication Tutorial</h1>
      <div className="home-content">
        {user ? (
          <div>
            <h2>Hello, {user.username}!</h2>
            <p>You are now logged in.</p>
            <Link to="/profile" className="btn">
              View Your Profile
            </Link>
          </div>
        ) : (
          <div>
            <p>Please login or register to access protected routes.</p>
            <div className="auth-buttons">
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
