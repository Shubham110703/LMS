import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password : {type : String , required : true}, 
	phone_num : {type : Number , required: true },
	designation: { type: String, required: true},
	hire_date: { type: Date, default: Date.now },
	
});

export default mongoose.model("Employee", employeeSchema);
