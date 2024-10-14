import Trainer from '../models/Trainer.model.js';

export const GetAllTrainers = async (req, res) => {
  try {
      const trainers = await Trainer.find();
      res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const GetTrainerById = async (req, res) => {
  
  const { trainerID } = req.params; // Extract the trainerID from the route parameters
  try {
      const trainer = await Trainer.findById(trainerID);
      if (!trainer) {
          return res.status(404).json({ message: "Trainer not found" });
      }
      res.status(200).json(trainer); // Return the trainer object
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

export const CreateTrainer = async (req, res) => {
  const {name , email , password, phone_num ,expertise_area} = req.body;
 
  try {
    const newTrainer =  new Trainer({
      name , email ,password, phone_num ,expertise_area
    }) ; 
    const savedTrainer =  await newTrainer.save();
    res.status(201).json(savedTrainer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Additional methods: updateTrainer, deleteTrainer, etc.
