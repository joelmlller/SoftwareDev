import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="container">
        <h1>Welcome to TruckStar Rewards</h1>
        <p>Driving Excellence in the Trucking Industry</p>
        <section className="content">
          <p>
            TruckStar Rewards is a unique incentive program designed to improve the on-road performance of truck drivers. Our program allows companies to award points to drivers for good driving behavior, which can be redeemed for products from a curated catalog. Join us in promoting safer roads and happier drivers!
          </p>
          <div className="driver-option">
            <p>Are you already a driver?</p>
            <Link to="/home" className="btn">Go to Home</Link>
          </div>
        </section>
      </div>
      <footer className="footer">
        <p>&copy; 2024 TruckStar Rewards. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
