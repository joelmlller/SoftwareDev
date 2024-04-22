const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const app = express();
const config = require('../../config.js');

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

app.post('/api/createUserInMySQL', (req, res) => {
  const { user_id, name, email, phone_number, userType, sponsor, sponsorPointRatio } = req.body; // Get user details from request body

  const query = `INSERT INTO users (user_id, name, email, phone_number, usertype, sponsor, sponsorPointRatio) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [user_id, name, email, phone_number, userType, sponsor, sponsorPointRatio], (err, results) => {
    if (err) {
      console.error('Error adding user to MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send(`User ${user_id} added successfully to MySQL database.`);
  });
});


app.get('/api/getUsers', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});


app.get('/api/getSponsors', (req, res) => {
  connection.query('SELECT * FROM Sponsor', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});



app.get('/api/getSponsorNames', (req, res) => {
  connection.query('SELECT * FROM Sponsor', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});



app.get('/api/getUserApplication/:sponsor', (req, res) => {

  const sponsor = req.params.sponsor;

  connection.query('SELECT * FROM applications WHERE sponsor_id = ?', [sponsor], (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the array
  });
});

app.post('/api/addApplication', (req, res) => {
  const { sponsorId, userId, name, accepted } = req.body;
  const query = 'INSERT INTO applications (sponsor_id, user_id, name, accepted) VALUES (?, ?, ?, ?)';

  connection.query(query, [sponsorId, userId, name, accepted], (err, results) => {
    if (err) {
      console.error('Error adding application to MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send('Application added successfully');
  });
});


// Endpoint to update user status
app.post('/api/acceptApplication', (req, res) => {
  const { userId, sponsorId } = req.body;
  const query = 'UPDATE applications SET accepted = "Accepted" WHERE user_id = ? AND sponsor_id = ?';

  connection.query(query, [userId, sponsorId], (err, results) => {
    if (err) {
      console.error('Error updating status in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      // No user found with the provided ID
      return res.status(404).send('User not found');
    }
    res.status(200).send(`Status updated successfully for user ${userId}.`);
  });
});


// Endpoint to decline an application
app.post('/api/declineApplication', (req, res) => {
  const { userId, sponsorId } = req.body;
  const query = 'UPDATE applications SET accepted = "Declined" WHERE user_id = ? AND sponsor_id = ?';


  connection.query(query, [userId, sponsorId], (err, results) => {
    if (err) {
      console.error('Error declining application in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      // No user found with the provided ID
      return res.status(404).send('User not found');
    }
    res.status(200).send(`Application declined successfully for user ${userId}.`);
  });
});



app.get('/api/getCart', (req, res) => {
  connection.query('SELECT * FROM cart', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of cart data
  });
});
app.get('/api/getOrders', (req, res) => {
  connection.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of cart data
  });
});


app.get('/api/getSponsors/:userId', (req, res) => {

  const userId = req.params.userId;

  connection.query('SELECT * FROM driver_sponsor WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});

app.get('/api/getCatalog/:sponsorId', (req, res) => {

  const sponsorId = req.params.sponsorId;

  connection.query('SELECT * FROM catalogs WHERE sponsor_id = ?', [sponsorId], (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results); // Return the entire array of user data
  });
});


app.delete('/api/removeFromCatalog', (req, res) => {
  const { sponsorId, productId } = req.body;

  connection.query('DELETE FROM catalogs WHERE sponsor_id = ? AND product_id = ?', [sponsorId, productId], (err, result) => {
    if (err) {
      console.error('Error deleting data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Product not found in catalog');
      return;
    }
    res.send('Product removed successfully');
  });
});

app.delete('/api/removeFromCart', (req, res) => {
  const { userId, productId } = req.body;

  connection.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId], (err, result) => {
    if (err) {
      console.error('Error deleting data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Product not found in cart');
      return;
    }
    res.send('Product removed successfully');
  });
});
app.delete('/api/removeUsersCart', (req, res) => {
  const { userId } = req.body;

  connection.query('DELETE FROM cart WHERE user_id= ?', [userId], (err, result) => {
    if (err) {
      console.error('Error deleting data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('User cart not deleted');
      return;
    }
    res.send('User cart deleted');
  });
});

app.post('/api/addToCatalog', (req, res) => {
  const { sponsorId, productId } = req.body;
  const query = 'INSERT IGNORE INTO catalogs (sponsor_id, product_id) VALUES (?, ?)';

  connection.query(query, [sponsorId, productId], (err, results) => {
    if (err) {
      console.error('Error adding sponsor product to MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(200).send('Sponsor product already exists');
    }
    res.status(201).send('Sponsor product added successfully');
  });
});
app.post('/api/addToCart', (req, res) => {
  const { userId, productId } = req.body;
  const query = 'INSERT IGNORE INTO cart (user_id, product_id) VALUES (?, ?)';

  connection.query(query, [userId, productId], (err, results) => {
    if (err) {
      console.error('Error adding product to cart in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(200).send('product already exists in cart');
    }
    res.status(201).send('User product added successfully');
  });
});
app.post('/api/addToOrders', (req, res) => {
  const { userId } = req.body;
  const query = 'INSERT IGNORE INTO orders (user_id, product_id) SELECT user_id, product_id FROM cart WHERE user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error adding products to orders in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      return res.status(200).send('products already exists in cart');
    }
    res.status(201).send('User products added successfully');
  });
});

// Endpoint to update user points
app.post('/api/updatePoints', (req, res) => {
  const { userId, newPoints } = req.body;
  const query = 'UPDATE users SET points = ? WHERE user_id = ?';

  connection.query(query, [newPoints, userId], (err, results) => {
    if (err) {
      console.error('Error updating user points in MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (results.affectedRows === 0) {
      // No user found with the provided ID
      return res.status(404).send('User not found');
    }
    res.status(200).send(`Points updated successfully for user ${userId}.`);
  });
});

app.post('/api/sponsorInMySQL', (req, res) => {
  const { sponsorID, sponsorName, sponsorPointRatio, isActive } = req.body; // Get sponsor details from request body

  const query = `INSERT INTO Sponsor (SponsorID, SponsorName, SponsorPointRatio, IsActive) VALUES (?, ?, ?, ?)`;

  connection.query(query, [sponsorID, sponsorName, sponsorPointRatio, isActive], (err, results) => {
    if (err) {
      console.error('Error adding sponsor to MySQL database:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send(`Sponsor ${sponsorName} added successfully to MySQL database.`);
  });
});



// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'dashboard/build')));

app.get('/api/about', (req, res) => {
  connection.query('SELECT * FROM about_page_data', (err, results) => {
    if (err) {
      console.error('Error fetching data: ' + err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    const aboutData = results[0];
    aboutData.release_date = new Date(aboutData.release_date).toLocaleDateString();
    res.json(aboutData);
  });
});

//Assistant API call
app.post('/api/consultPoint', async (req, res) => {
  req.setTimeout(50000); // Extending timeout for incoming

  try {
    const { driverActionDescription, sponsorPointRatio } = req.body;
    const advice = await getPointAdvice(driverActionDescription, sponsorPointRatio);
    res.json({ advice });
  } catch (error) {
    console.error('Error processing request:', error.message, error.stack);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



// For all other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/build', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
