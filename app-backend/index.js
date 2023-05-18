const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult, param } = require('express-validator');
const mysql = require('mysql');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'open_fabric_db',
});

// JWT Secret Key
const secretKey = 'openFabricKey78906';

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/login', (req, res) => {
  // Mock login logic
  console.log(req.body);
  console.log(req.params);
  const { username, password } = req.body;

  if (username === 'admin' && password === 'password') {
    const user = { username: 'admin' };
    const token = jwt.sign(user, secretKey);
    return res.json({ token });
  }
  res.sendStatus(402);
});

app.get('/products', authenticateToken , (req, res) => {
  // Fetch all products
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(responseObject(200,results));
  });
});

app.post(
  '/products',
  authenticateToken,
  [
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 0 }),
  ],
  (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Insert product into database
    const { name, price, quantity, model, color } = req.body;
    connection.query(
      'INSERT INTO products (name, price, quantity, model, color) VALUES (?, ?, ?, ?, ?)',
      [name, price, quantity, model, color],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        res.json(responseObject(200));
      }
    );
  }
);

app.put(
  '/products/:id',
  authenticateToken,
  [
    body('id').isInt({ min: 1 }),
    body('name').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 0 }),
  ],
  (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Update product in database
    const { id, name, price, quantity, model, color } = req.body;
    connection.query(
      'UPDATE products SET name = ?, price = ?, quantity = ? , model = ? , color = ? WHERE id = ?',
      [name, price, quantity, model, color, id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        if (result.affectedRows === 0) {
          return res.sendStatus(404);
        }
        res.json(responseObject(200,result));
      }
    );
  }
);

app.get(
  '/products/:id',
  authenticateToken,
  [
    param('id').isInt(),
  ],
  (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Update product in database
    const { id } = req.params;
    connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        }
        if (result.affectedRows === 0) {
          return res.sendStatus(404);
        }
        res.json(responseObject(200,result));
      }
    );
  }
);

app.delete('/products/:id', authenticateToken, (req, res) => {
  // Delete product from database
  const { id } = req.params;
  connection.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    if (result.affectedRows === 0) {
      return res.sendStatus(404);
    }
    res.json(responseObject(200,result));
  });
});


function responseObject(status = 200, data = null, message = ''){
  return {
    status : status,
    message: message,
    data:data
  }
}

// Include the Swagger documentation routes
require('./swagger')(app);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
