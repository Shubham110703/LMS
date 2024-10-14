import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password : {type : String , required : true}, 
	phone_num : {type : Number , required: true },
  expertise_area: { type: String, required: true },
 });

export default mongoose.model('Trainer', trainerSchema);


