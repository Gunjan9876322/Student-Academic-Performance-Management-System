import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  student:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},
  subject:{type:String,required:true},
  exam:{type:String,required:true},
  obtained:{type:Number,required:true,min:0},
  maximum:{type:Number,required:true,min:1}
},{timestamps:true});
export default mongoose.model('Mark',schema);
