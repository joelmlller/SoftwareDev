import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import Navbar from './navbar';
import './App.css';
import { FaCalendarAlt, FaCode, FaUserFriends, FaInfoCircle } from 'react-icons/fa'; // Importing icons

Amplify.configure(config);

function AboutUs() {
  const [aboutData, setAboutData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/about')
      .then(response => {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        return response.json();
      })
      .then(data => setAboutData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [navigate]);

  // Function to select icon based on data type
  const getIcon = (type) => {
    switch (type) {
      case 'team_number':
        return <FaUserFriends />;
      case 'version_number':
        return <FaCode />;
      case 'release_date':
        return <FaCalendarAlt />;
      case 'product_name':
      case 'product_description':
        return <FaInfoCircle />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="about-container">
        <h1>About Us</h1>
        <div className="about-card">
          {Object.entries(aboutData).map(([key, value]) => (
            <div key={key} className="about-item">
              <span className="icon">{getIcon(key)}</span>
              <div className="about-info">
                <span className="about-title">{key.replace(/_/g, ' ')}:</span>
                <span className="about-detail">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(AboutUs);
