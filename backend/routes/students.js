import {Router} from 'express';
import Student from '../models/Student.js';
import {protect,allow} from '../auth.js';
const router=Router();
router.use(protect);
router.get('/',async(req,res)=>res.json(await Student.find().sort({name:1})));
router.post('/',allow('admin'),async(req,res)=>{
  try{const s=await Student.create(req.body);res.status(201).json(s);}
  catch(e){res.status(400).json({message:e.code===11000?'Roll number already exists':e.message});}
});
router.get('/:id',async(req,res)=>{const s=await Student.findById(req.params.id);if(!s)return res.status(404).json({message:'Student not found'});res.json(s);});
router.put('/:id',allow('admin'),async(req,res)=>{const s=await Student.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!s)return res.status(404).json({message:'Student not found'});res.json(s);});
router.delete('/:id',allow('admin'),async(req,res)=>{const s=await Student.findByIdAndDelete(req.params.id);if(!s)return res.status(404).json({message:'Student not found'});res.json({message:'Student deleted'});});
export default router;
