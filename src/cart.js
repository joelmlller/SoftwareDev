// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './navbar'; // Import the Navbar component
import { getCurrentUser } from 'aws-amplify/auth';
import { deleteFromCart } from "./deleteFromCart.js";
import { checkoutCart } from "./checkoutCart.js";

function ShopCart() {
  var userCarts = [];

  const [currentUser, setCurrentUser] = useState(null);
  const [aboutData, setAboutData] = useState([]);
  const [products, setProducts] = useState([]);
  const [userCart, setUserCarts] = useState([]);
  const [totalCost, updateTotal] = useState(0);

  async function getProduct(prodId){
    const response = await fetch('https://fakestoreapi.com/products/'+prodId)
    const jsonData = await response.json();
    console.log(jsonData);
    setProducts(prevProducts => [...prevProducts, jsonData]);
    console.log(jsonData.price);
    updateTotal(prevCost => prevCost + jsonData.price);
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
  fetch('/api/getUsers')
    .then(response => response.json())
    .then(data => {
      setAboutData(data);
    })
    .catch(error => console.error('Error fetching data:', error));
}, []);

// Filter out the current user from the user list
const currentUserData = aboutData.find(user => user.user_id === currentUser);

useEffect(() => {
  if (currentUser !== null) {
  fetch('/api/getCart')
    .then(response => response.json())
    .then(data => {
      // Transform the data to match your application's data structure
      userCarts = data.map((product) => ({
        id: product.id,
        user: product.user_id,
        product: product.product_id,
      }));

      console.log(userCarts);
      setUserCarts(userCarts.filter(function (el) {
        if ( el.user ===  currentUser) {
          return el;
        } 
      }))
      console.log(userCart);
    })
    .catch(error => console.error('Error fetching data:', error));
  }
}, [currentUser]);
useEffect(() => {
  if(userCart.length > 0){
    userCart.forEach(function (arrayItem) {
    getProduct(arrayItem.product);  
    })
  }
}, [userCart]);
  // Filter out the current user from the user list

//userOrder.forEach(function (arrayItem) {

// 

console.log(products);

  console.log(totalCost);

  return (
    <div>
    <Navbar /> 
    <div className="container">

    {products.map((product) => (

      <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
        <img src={product.image} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
        <h3>{product.title}</h3>
        <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
        <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
        <button  onClick={() => {deleteFromCart(currentUser,product.id)}} >Delete</button>
      </div>
    ))}
    <div style={{ padding: 20, display: 'inline-block'}}>
      <h3>Total Price: {totalCost}</h3>
      <button onClick={() => {checkoutCart(currentUser,totalCost,currentUserData.points)}}>Checkout</button>
    </div>
    
    </div>
</div>
  );
}

export default ShopCart;