import express from "express";
const router = express.Router();
import {GetAllTrainers , GetTrainerById ,CreateTrainer} from '../controllers/Trainer.controllers.js';

router.get('/',GetAllTrainers);
router.get('/:trainerID', GetTrainerById); 
router.post('/', CreateTrainer);
// Add routes for update and delete

export default router;