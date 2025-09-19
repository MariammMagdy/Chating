const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({ path: 'config.env' });
const dbConnection = require('./config/database');

// connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
