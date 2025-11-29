/**
 * Authentication Routes
 * Handles user registration and login
 * - POST /register - Create new user account
 * - POST /login - Authenticate user and return JWT token
 * - GET /me - Get current user information (optional)
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  const {name,email,password,role} = req.body;
  const hashed = await bcrypt.hash(password,10);
  try{
    const u = await User.create({name,email,password:hashed,role});
    res.json({msg:'ok'});
  }catch(e){ res.status(400).json({error:e.message}); }
});

router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({error:'No user'});
  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(400).json({error:'Invalid'});
  const token = jwt.sign({id:user._id,role:user.role,name:user.name}, process.env.JWT_SECRET);
  res.json({token,role:user.role, name:user.name});
});

router.get('/me', async (req,res)=>{
  const auth = req.header('Authorization');
  if(!auth) return res.json(null);
  try{
    const token = auth.split(' ')[1];
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const u = await User.findById(data.id).select('-password');
    res.json(u);
  }catch(e){ res.json(null); }
});

module.exports = router;
