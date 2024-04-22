import React, { useState, useEffect } from 'react';
import Navbar from './navbar'; // Import the Navbar component
import { addToCart } from "./addToCart.js";

function ProductSearch({ currentUser }) {
  var newList = [];
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => response.json())
      .then((data) => {
        // Transform the data to match your application's data structure
        const allItems = data.map((product) => ({
          id: product.id,
          name: product.title,
          price: Math.round(product.price * 100), // Convert price to points (assuming 1 point = $0.01)
          availability: 'In stock', // Fake Store API doesn't provide availability, so we'll just assume everything is in stock
          description: product.description,
          image: product.image,
        }));
        setProducts(allItems);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  var d = localStorage.getItem("searchinput");
  newList = products.filter(function (el) {
    if (el.name.toLowerCase().indexOf(d) > -1) {
      return el;
    }
  });

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Product Catalog</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {newList.map((product) => (
            <div key={product.id} style={{ width: '300px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', boxSizing: 'border-box' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{product.name}</h3>
              <p style={{ fontWeight: 'bold' }}>Points: {product.price}</p>
              <p style={{ fontStyle: 'italic' }}>Availability: {product.availability}</p>
              <p>Description: {product.description.length > 100 ? product.description.substring(0, 97) + '...' : product.description}</p>
              <button onClick={() => { addToCart(currentUser, product.id) }}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductSearch;
