const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const db = require('./src/configs/db');
var usersRouter = require('./src/routes/users');
var authRouter = require('./src/routes/auth')
var patientRouter = require('./src/routes/patient')

var app = express();

require('./src/configs/db');

const corsOptions = {
  origin: true
}
// **Added code for testing database connection**
app.get('/test-db-connection', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database connection failed', error: err });
    }
    res.status(200).json({ message: 'Database connection successful', results });
  });
});
// **End of added code**

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// use middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

// define the routes
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/patients', patientRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
