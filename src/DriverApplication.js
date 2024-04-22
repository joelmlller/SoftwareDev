import React, { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
import './App.css';
import { Amplify } from 'aws-amplify';
Amplify.configure(config);


const submitApplication = (sponsorId, userId, name) => {
  const accepted = "Pending";
  console.log('Submitting application with the following data:', { sponsorId, userId, name, accepted });
  fetch('/api/addApplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sponsorId, userId, name, accepted }), // Corrected parameter name here
  })
  .then(response => {
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then(data => Promise.reject(data));
      } else {
        return response.text().then(text => Promise.reject(text));
      }
    }
    return contentType && contentType.indexOf("application/json") !== -1
      ? response.json()
      : response.text();
  })
  .then(data => {
    console.log('Submission response:', data);
  })
  .catch(error => {
    console.error('Error submitting application:', error);
    // Determine if error is an object (from JSON) or text, and set message accordingly
    const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error submitting application' };
  });
};


function DriverApplication() {
  //const sponsorArray = [1,2,3];
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [sponsorArray, setSponsorArray] = useState([]);
  const [formData, setFormData] = useState({
    sponsorId: '',
    driverId: '',
    name: ''
  });

  useEffect(() => {
    fetch('/api/getSponsors')
      .then(response => response.json())
      .then(data => {
        setSponsorArray(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


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

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { sponsorId, driverId, name} = formData;
    console.log("Form data");
    console.log(formData);
    submitApplication(sponsorId, driverId, name);
  };

  

  return (
    <div>
      <div className="container">
        <h1>Applications</h1>
        <form onSubmit={handleSubmit}>
          <select 
            name="sponsorId"
            value={formData.sponsorId}
            onChange={handleChange}
            required
          >
            <option value="">Select a Sponsor</option>
            {sponsorArray.map((sponsor) => (
              <option key={sponsor.SponsorID} value={sponsor.SponsorID}>
                {sponsor.SponsorName}
              </option>
            ))}
          </select>
          <input 
            type="text"
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            placeholder="Driver ID"
            required
          />
          <input 
            type="text"
            name="name"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default DriverApplication;