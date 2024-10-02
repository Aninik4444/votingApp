const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
const PORT = process.env.PORT;
app.use(bodyParser.json());

// Import the router files
const userRoutes = require('./routes/userRoutes');
// use the routers
app.use('/user',userRoutes); 


app.listen(PORT, ()=>{
    console.log('Listening on port 3000');
  }) 