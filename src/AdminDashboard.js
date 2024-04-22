// DriverDashboard.js
import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Navbar from './navbar';
import './App.css';
import Report from './genReport';
import AdminCreate from './adminCreateUser';
import ModifyUser from './adminModifyUser';
import CreateSponsor from './adminCreateSponsor'; // Import CreateSponsor component

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function DriverDashboard() {
  const [activeView, setActiveView] = useState('');

  const changeView = (view) => {
    setActiveView(view);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Admin Dashboard</h1>
        <button onClick={() => changeView('report')}>Audit Log</button>
        <button onClick={() => changeView('admincreate')}>Create A User</button>
        <button onClick={() => changeView('modifyuser')}>Modify A User</button>
        <button onClick={() => changeView('createsponsor')}>Create A Sponsor</button>
      </div>
      {activeView === 'report' && <Report />}
      {activeView === 'admincreate' && <AdminCreate />}
      {activeView === 'modifyuser' && <ModifyUser />}
      {activeView === 'createsponsor' && <CreateSponsor />}
    </div>
  );
}

export default withAuthenticator(DriverDashboard);
