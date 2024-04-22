import React, { useEffect, useState } from 'react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
Amplify.configure(config);

function SponsorApplications() {

  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [aboutData, setAboutData] = useState([]);
  
  //getting current user info
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => {
        setAboutData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const currentUserData = aboutData.find(user => user.user_id === currentUser);
  console.log(currentUserData);

  useEffect(() => {
    if (currentUserData && currentUserData.sponsor) {
      fetch(`/api/getUserApplication/${currentUserData.sponsor}`)
        .then(response => response.json())
        .then(data => {
          setApplicationData(data);
          setHeaders(Object.keys(data[0]));
          setRows(data.map(item => Object.values(item)));
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [currentUserData, successMessage]); // Refresh data when successMessage changes

 const handleAccept = (userId) => {
    const sponsorId = currentUserData.sponsor;
    fetch('/api/acceptApplication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, sponsorId }), // Send userId and userStatus
    })
    .then(response => {
      if (response.ok) {
        // Handle success
        setSuccessMessage('Status updated successfully.');
        console.log(`Status updated successfully for user ${userId}.`);
      } else {
        // Handle error
        console.error('Error updating status:', response.statusText);
      }
    })
    .catch(error => console.error('Error updating status:', error));
  };

const handleDecline = (userId) => {
    const sponsorId = currentUserData.sponsor; 
    fetch('/api/declineApplication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, sponsorId }), // Send userId and userStatus
    })
    .then(response => {
      if (response.ok) {
        // Handle success
        setSuccessMessage('Status updated successfully.');
        console.log(`Status updated successfully for user ${userId}.`);
      } else {
        // Handle error
        console.error('Error updating status:', response.statusText);
      }
    })
    .catch(error => console.error('Error updating status:', error));
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage('');
        // Refresh data after success message disappears
        fetch('/api/getUserApplication')
          .then(response => response.json())
          .then(data => {
            setApplicationData(data);
            setHeaders(Object.keys(data[0]));
            setRows(data.map(item => Object.values(item)));
          })
          .catch(error => console.error('Error fetching data:', error));
      }, 3000); // Clear success message after 3 seconds
    }
  }, [successMessage]);

  return (
    <div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="container">
        <h1>Application List</h1>
        <table>
          <thead>
            <tr>
              {headers.map(header => <th key={header}>{header}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
                <td>
                  <button onClick={() => handleAccept(row[2])}>Accept</button>
                  <button onClick={() => handleDecline(row[2])}>Decline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SponsorApplications;
