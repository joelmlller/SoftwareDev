// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';

var productsList = [];


var userOrders = [];
function Orders() {


    const [currentUser, setCurrentUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [userOrder, setUserOrders] = useState([]);

    async function getProduct(prodId, orderStatus){
      const response = await fetch('https://fakestoreapi.com/products/'+prodId)
      const jsonData = await response.json();
      console.log(jsonData);
      console.log(orderStatus);
      jsonData.status = orderStatus;

      setProducts(prevProducts => [...prevProducts, jsonData]);
  }

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
    if (currentUser !== null) {
    fetch('/api/getOrders')
      .then(response => response.json())
      .then(data => {
        // Transform the data to match your application's data structure
        userOrders = data.map((product) => ({
          id: product.id,
          user: product.user_id,
          product: product.product_id,
          status: product.order_status,
        }));

        console.log(userOrders);
        setUserOrders(userOrders.filter(function (el) {
          if ( el.user ===  currentUser) {
            return el;
          } 
        }))
        console.log(userOrder);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [currentUser]);
  useEffect(() => {
    if(userOrder.length > 0){
      userOrder.forEach(function (arrayItem) {
      getProduct(arrayItem.product,arrayItem.status);  
      })
    }
  }, [userOrder]);
    // Filter out the current user from the user list

  //userOrder.forEach(function (arrayItem) {

  // 

  console.log(userOrder);

  return (
    <div>
        <Navbar /> 
        <div className="container">

        {products.map((product) => (

          <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{product.title}</h3>
            <p style={{ fontWeight: 'bold' }}>Status: {product.status}</p>
            <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
            <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
          </div>
        ))}
        </div>
    </div>
  );
}

export default Orders;