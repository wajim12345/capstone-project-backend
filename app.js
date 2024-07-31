const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/configs/db');
const usersRouter = require('./src/routes/users');
const authRouter = require('./src/routes/auth');
const patientRouter = require('./src/routes/patient');
const { authenticateToken } = require('./src/middleware/authMiddleware');

const app = express();

const corsOptions = {
  origin: true
};

// Test database connection without authentication
app.get('/test-db-connection', (req, res) => {
  console.log('Received request for /test-db-connection');
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Database connection failed:', err);
      return res.status(500).json({ message: 'Database connection failed', error: err });
    }
    console.log('Database connection successful:', results);
    res.status(200).json({ message: 'Database connection successful', results });
  });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  if (req.path === '/test-db-connection') {
    return next();
  }
  authenticateToken(req, res, next);
});

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/patients', patientRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
