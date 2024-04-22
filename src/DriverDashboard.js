import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar';
import Profile from './Profile';
import PointsOverview from './PointsOverview';
import ProductCatalog from './ProductCatalog';
import DriverApplication from './DriverApplication';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
          <Navbar />
          <div className="container">
        <h1>Driver Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Points Overview</button>
          <button onClick={() => changeView('catalog')}>Product Catalog</button>
          <button onClick={() => changeView('driver_application')}>Driver Application</button>
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <PointsOverview />}
        {activeView === 'catalog' && <ProductCatalog />}
        {activeView === 'driver_application' && <DriverApplication />}
    </div>
      </div>
  );
}

export default withAuthenticator(DriverDashboard);
