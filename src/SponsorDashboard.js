import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Navbar from './navbar';
import Profile from './Profile';
import Points from './DriverPoints';
import SponsorCatalog from './SponsorCatalog';
import SponsorApplications from './SponsorApplications';
import Report from './genReport';
import SponsorCreateUser from './sponsorCreateUser';
//import SponsorPointRatio from './SponsorPointRatio';


import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function SponsorDashboard() {
  const [activeView, setActiveView] = useState('profile');

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
          <Navbar />
      <div className="container">
        <h1>Sponsor Dashboard</h1>
        <nav>
          <button onClick={() => changeView('profile')}>Profile</button>
          <button onClick={() => changeView('points')}>Assign Points To Drivers</button>
          <button onClick={() => changeView('catalog')}>Sponsor Catalog</button>
          <button onClick={() => changeView('report')}>Generate A Report</button>
          <button onClick={() => changeView('applications')}>Applications</button>
          <button onClick={() => changeView('SponsorCreateUser')}>Create A User</button>
        </nav>
        {activeView === 'profile' && <Profile />}
        {activeView === 'points' && <Points />}
        {activeView === 'catalog' && <SponsorCatalog />}
        {activeView === 'report' && <Report />}
        {activeView === 'applications' && <SponsorApplications />}
        {activeView === 'SponsorCreateUser' && <SponsorCreateUser />}
      </div>
    </div>
  );
}

export default withAuthenticator(SponsorDashboard);
