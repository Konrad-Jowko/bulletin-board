const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const passportConfig = require('./config/passport');

const postsRoutes = require('./routes/posts.routes');
const loginRoutes = require('./routes/login.routes');

const app = express();

/* MIDDLEWARE */
app.use(fileUpload({
  createParentPath: true,
}));

app.use(session({ secret: 'turnip' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use(express.json({
  limit: '50mb',
}));

app.use(express.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true,
}));

/* API ENDPOINTS */
app.use('/api', postsRoutes);
app.use('/auth', loginRoutes);


/* API ERROR PAGES */
app.use('/api', (req, res) => {
  res.status(404).send({ post: 'Not found...' });
});

/* REACT WEBSITE */
app.use(express.static(path.join(__dirname, '../build')));
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

/* SET UP DATABASE ADRESS */

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if(NODE_ENV === 'production') dbUri = `mongodb+srv://${process.env.login}:${process.env.password}@newwavedb.iibtz.mongodb.net/${process.env.database}?retryWrites=true&w=majority`;
else if(NODE_ENV === 'test') dbUri = 'mongodb://localhost:27017/bulletinBoardtest';
else dbUri = 'mongodb://localhost:27017/bulletinBoard';

/* MONGOOSE */
mongoose.connect(`mongodb+srv://${process.env.login}:${process.env.password}@newwavedb.iibtz.mongodb.net/${process.env.database}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
  console.log('Successfully connected to the database');
});
db.on('error', err => console.log('Error: ' + err));

/* START SERVER */
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Server is running on port: '+port);
});
