//adds a product to a sponsor's catalog
export function addToCart(userId,productId){
    console.log("adding" + productId);
    
    fetch('/api/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    })
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(data => Promise.reject(data));
        } else {
          return response.text().then(text => Promise.reject(text));
        }
      }
      return contentType && contentType.indexOf("application/json") !== -1
        ? response.json()
        : response.text();
    })
    .then(data => {
      console.log('Response:', data);
      const successStatus = { success: true, message: 'Cart updated successfully.' };
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      // Determine if error is an object (from JSON) or text, and set message accordingly
      const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error submitting application' };
    });
  }
  