
import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// REGISTER API
router.post('/register', async(req,res)=>{
  try {
    const {name,email,password,role} = req.body;

    if(!name || !email || !password)
      return res.status(400).json({message:'All fields are required'});

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if(existingUser)
      return res.status(409).json({message:'User already exists'});

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    res.status(201).json({
      message:'Registration successful',
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    });

  } catch(e) {
    res.status(500).json({message:e.message});
  }
});

// LOGIN API
router.post('/login',async(req,res)=>{
  try {
    const {email,password} = req.body;

    if(!email || !password)
      return res.status(400).json({message:'Email and password are required'});

    const user = await User.findOne({
      email:email.toLowerCase().trim()
    });

    if(!user || !(await bcrypt.compare(password,user.password)))
      return res.status(401).json({message:'Invalid credentials'});

    const token = jwt.sign(
      {id:user._id,role:user.role},
      process.env.JWT_SECRET,
      {expiresIn:'8h'}
    );

    res.json({
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
      }
    });

  } catch(e) {
    res.status(500).json({message:'Login failed'});
  }
});

export default router;
