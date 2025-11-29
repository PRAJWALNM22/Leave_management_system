const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));   // allow bigger JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Models
const User = require('./models/User');
const Leave = require('./models/Leave');

// Routes
const auth = require('./routes/auth');
const leaves = require('./routes/leaves');

app.use('/api/auth', auth);
app.use('/api/leaves', leaves);

mongoose.connect(process.env.MONGO_URI)
  .then(()=> app.listen(process.env.PORT||5000, ()=> console.log('Server running')))
  .catch(err=> console.error(err));
