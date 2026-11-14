import {Router} from 'express';
import Mark from '../models/Mark.js';
import {protect,allow} from '../auth.js';
const router=Router(); router.use(protect);
router.get('/',async(req,res)=>{const filter={};if(req.query.student)filter.student=req.query.student;res.json(await Mark.find(filter).populate('student','rollNo name').sort({createdAt:-1}));});
router.post('/',allow('admin','faculty'),async(req,res)=>{
  try{if(Number(req.body.obtained)>Number(req.body.maximum))return res.status(400).json({message:'Obtained marks cannot exceed maximum marks'});const m=await Mark.create(req.body);res.status(201).json(m);}
  catch(e){res.status(400).json({message:e.message});}
});
export default router;
