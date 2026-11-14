import {Router} from 'express';
import Attendance from '../models/Attendance.js';
import {protect,allow} from '../auth.js';
const router=Router(); router.use(protect);
router.get('/',async(req,res)=>{const filter={};if(req.query.student)filter.student=req.query.student;res.json(await Attendance.find(filter).populate('student','rollNo name').sort({date:-1}));});
router.post('/',allow('admin','faculty'),async(req,res)=>{try{const item=await Attendance.create(req.body);res.status(201).json(item);}catch(e){res.status(400).json({message:e.code===11000?'Attendance already recorded for this date and subject':e.message});}});
export default router;
