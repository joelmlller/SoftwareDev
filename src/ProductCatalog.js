import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { addToCart } from "./addToCart.js";
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

function UniqueSponsorCatalog({ sponsor }) {
  const [products, setProducts] = useState([]);
  const [catalogData, setCatalogData] = useState([]);//Getting sponsor catalog product ids
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

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  //Getting all products in catalog for specific sponsor ID and store in array
  useEffect(() => { 
    fetch(`/api/getCatalog/${sponsor}`)
      .then(response => response.json())
      .then(data => {
        console.log("Data");
        console.log(data);
        setCatalogData(data.map(product => product.product_id));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (catalogData.length > 0) {  // Check to prevent running before data is fetched
      fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
          console.log("This is the catalog data");
          console.log(catalogData);
          const filteredData = data.filter(product => catalogData.includes(product.id));
          console.log("Filtered data");
          console.log(filteredData);
          const transformedData = filteredData.map((product) => ({
            id: product.id,
            name: product.title,
            price: Math.round(product.price * 100), // Convert price to points
            availability: 'In stock',
            description: product.description,
            image: product.image,
          }));
          setProducts(transformedData);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [catalogData]); // Include catalogData in the dependency array

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Catalog</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map((product) => (
          <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.name}</h3>
            <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
            <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
            <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
            <button onClick={() => {addToCart(currentUser,product.id)}}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}


function ProductCatalog() {
  const [activeView, setActiveView] = useState('profile');
  const [currentUser, setCurrentUser] = useState(null);
  const [aboutData, setAboutData] = useState([]);
  const [sponsorData, setSponsorData] = useState([]);
  const [sponsorArray, setSponsorArray] = useState([]);
  const [filteredSponsors, setFilteredSponsors] = useState([]);

  useEffect(() => {
    fetch('/api/getSponsors')
      .then(response => response.json())
      .then(data => {
        setSponsorArray(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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

  // Filter out the current user from the user list
  const currentUserData = aboutData.find(user => user.user_id === currentUser);

  //Getting list of sponsors for specific driver
  useEffect(() => {
    if (currentUserData && currentUserData.user_id) {  // Check to prevent running before data is fetched
      fetch(`/api/getSponsors/${currentUserData.user_id}`)
        .then(response => response.json())
        .then(data => {
          setSponsorData(data.map(user => user.sponsor_id));
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [currentUserData]);

  const changeView = (view) => {
    setActiveView(view);
  };

  const handleDropdownChange = (event) => {
    setActiveView(event.target.value);
  };

  
  useEffect(() => {
    if (sponsorArray && sponsorData) {  // Check to prevent running before data is fetched
      const data = sponsorArray.filter(sponsor => sponsorData.includes(sponsor.SponsorID));
      setFilteredSponsors(data);
    }
  }, [sponsorArray, sponsorData]);

  return (
        <div>
            <div className="container">
                <h1>Catalog</h1>
                <nav>
                    <select onChange={handleDropdownChange} value={activeView}>
                        <option value="">Select a Sponsor</option>
                        {filteredSponsors.map((sponsor, index) => (
                          <option key={index} value={sponsor.SponsorID}>
                              {sponsor.SponsorName}
                          </option>
                        ))}
                    </select>
                </nav>
                {/* Dynamically render UniqueCatalog based on activeView */}
                {sponsorData.map((sponsor) => {
                    if (parseInt(activeView) === sponsor) {
                        return <UniqueSponsorCatalog key={sponsor} sponsor={sponsor} />;
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export default withAuthenticator(ProductCatalog);
