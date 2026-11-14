import mongoose from 'mongoose'; import bcrypt from 'bcryptjs'; import dotenv from 'dotenv'; import User from './models/User.js';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
const email='admin@sapms.local';
if(!await User.findOne({email})){
 const password=await bcrypt.hash('Admin@12345',10);
 await User.create({name:'System Admin',email,password,role:'admin'});
 console.log('Seeded admin: admin@sapms.local / Admin@12345');
}else console.log('Admin already exists');
await mongoose.disconnect();
