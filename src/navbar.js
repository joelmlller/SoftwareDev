import React, { useEffect, useState } from 'react';
import './navbar.css';
import { signOut, getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

import { Amplify } from 'aws-amplify';
Amplify.configure(config);

async function handleSignOut() {
  try {
    await signOut({ global: true });
    window.location.href='/'; // Redirect to the landing page after sign out
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

function CustomNavbar() {
  const [username, setUsername] = useState(null);
  const [aboutData, setAboutData] = useState([]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const user = await getCurrentUser();
        setUsername(user.username);
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
  const currentUserData = aboutData.find(user => user.user_id === username);

  return (
    <div className="wrapper">
      <nav>
        <div id="logo" onClick={() => {window.location.href='/home'}}>
          <img src={require('./images/applogo.png')} alt="Logo" width="70px" height="70px" />
          <h2>TruckStar Rewards</h2>      
        </div>
        <div id="searchbar">
          <input id='searchtxt' type="text" placeholder="Search.." />
          <button type="submit" onClick={() => {          
            localStorage.setItem("searchinput", document.getElementById('searchtxt').value);
            window.location.href='/search';
            }}><i className="fa fa-search"></i></button>
        </div>
        <div className="links">
          <div className="navlinks" onClick={() => {window.location.href='/about'}}>
            <h4>about</h4>
          </div>
          <div className="navlinks" onClick={() => {window.location.href='/orders'}}>
            <h4>returns <br /> & orders</h4>
          </div>

            {currentUserData ? (
              currentUserData.usertype === 'driver' ? (
              <div id="pointDiv">
                  <p>points</p>
              <div id="points">{currentUserData.points}</div>
              </div>
              ):(
                <div></div>
              )
            ) : (
              <div></div>
            )} 
            
          <div id="cart" onClick={() => {window.location.href='/cart'}}>
            <img src={require('./images/emptyCart.png')} alt="Cart" width="50px" height="50px" />
            <h3 id="cartitems"></h3>
            <span className="tooltiptext">Cart</span>
          </div>
          <div id="profile">
            <div><img id="userimg"  src={require('./images/user.png')} alt="user Profile" width="50px" height="50px" /></div>
            <div id="circle"></div>
            <div id="dropdown">
              <ul>
                <li><h4 onClick={() => {window.location.href='/dashboard'}} >Dashboard</h4></li>
                <li><h4 onClick={handleSignOut}>Sign Out</h4></li>
              </ul>
            </div>
            {username && <span>{username}</span>}
          </div>

        </div>
      </nav>
    </div>
  );
}

export default CustomNavbar;
