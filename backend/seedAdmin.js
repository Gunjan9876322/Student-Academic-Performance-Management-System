
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'admin@sapms.com';
    const password = 'Admin@123';

    const existing = await User.findOne({ email });

    if (existing) {
      console.log('Admin already exists!');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: 'SAPMS Admin',
      email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
