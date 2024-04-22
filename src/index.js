import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import Home from './home';
import AboutUs from './about';
import DriverDashboard from './DriverDashboard';
import AdminDashboard from './AdminDashboard';
import SponsorDashboard from './SponsorDashboard'; // Ensure this import is added
import ProductSearch from './ProductSearch';
import ShopCart from './cart';
import Orders from './orders';

import { getCurrentUser } from 'aws-amplify/auth'; // Import getCurrentUser

const App = () => {
  const [aboutData, setAboutData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user.username);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false once user data is fetched (or failed to fetch)
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

  // Assuming user_id is the correct identifier and matches currentUser
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while fetching user data
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/cart" element={<ShopCart />} />
        {/* Adjusted routing logic to include SponsorDashboard */}
        {currentUserData ? (
          currentUserData.usertype === 'admin' ? (
            <Route path="/dashboard" element={<AdminDashboard />} />
          ) : currentUserData.usertype === 'sponsor' ? (
            <Route path="/dashboard" element={<SponsorDashboard />} /> // SponsorDashboard route
          ) : (
            <Route path="/dashboard" element={<DriverDashboard />} />
          )
        ) : (
          <Route path="/dashboard" element={<DriverDashboard />} /> // Render DriverDashboard when currentUserData is null
        )}
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
