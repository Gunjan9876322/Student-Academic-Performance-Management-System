import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema({
  rollNo:{type:String,required:true,unique:true,trim:true},
  name:{type:String,required:true,trim:true},
  email:{type:String,lowercase:true,trim:true},
  department:{type:String,default:'CSE'},
  semester:{type:Number,min:1,max:12,default:1}
},{timestamps:true});
export default mongoose.model('Student',studentSchema);
