const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongose = require('mongoose');
//import router 
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//connect to DB
mongose.connect(process.env.DB_CONNECT,{useNewUrlParser : true},() => console.log('connected to db!'));

//middleware 
app.use(express.json());
//router middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('server up and running')); 
