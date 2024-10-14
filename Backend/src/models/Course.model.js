import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true, // Required field for the course name
    },
    description: {
        type: String,
        required: true, // Required field for the course description
    },
    trainer_name: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true, // Required field for the trainer's name
    },
    start_date: {
        type: Date,
        required: true, // Ensure start date is provided
    },
    end_date: {
        type: Date,
        required: true, // Ensure end date is provided
    },
    employees_assigned: {
        type: [String], // Change this to an array of strings
    }, // Can be optional depending on requirements
}, {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

export default mongoose.model("Course", courseSchema);
