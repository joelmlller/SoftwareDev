export function checkoutCart(userId,cost,currentPoints){

    var newPoints = currentPoints - cost;
    if(currentPoints > cost){
        // Ensure newPoints is within the allowed range before sending it to the server
        const adjustedPoints = Math.min(Math.max(parseInt(newPoints, 10), 0), 1000000);

        fetch('/api/updatePoints', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newPoints: adjustedPoints }),
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
            console.log('Update response:', data);
        })
        .catch(error => {
            console.error('Error updating points:', error);
        });




    console.log("adding user cart: " + userId);
    
    fetch('/api/addToOrders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
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
      const successStatus = { success: true, message: 'Cart ordered.' };
    })
    .catch(error => {
      console.error('Error ordering cart:', error);
      // Determine if error is an object (from JSON) or text, and set message accordingly
      const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error ordering cart' };
    });




    console.log("deleting user cart: " + userId);
    
    fetch('/api/removeUsersCart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
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
      const successStatus = { success: true, message: 'User cart deleted' };
    })
    .catch(error => {
      console.error('Error deleting cart:', error);
      // Determine if error is an object (from JSON) or text, and set message accordingly
      const errorMessage = { success: false, message: typeof error === 'string' ? error : error.message || 'Error deleting cart' };
    });
    window.location.reload();
    }
    else{
        alert("not enough points");
    }
}