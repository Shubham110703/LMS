import Course from '../models/Course.model.js'; // Ensure to include the file extension if using ES modules

export const GetAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const GetAllCoursesOfTrainer = async (req, res) => {
    const { trainer_id } = req.query;

    try {
        // Validate trainer_id
        if (!trainer_id) {
            return res.status(400).json({ message: 'Trainer ID is required.' });
        }

        console.log("Fetching courses for trainer ID:", trainer_id);

        // Find courses that match the trainer's ID
        const courses = await Course.find({ trainer_name: trainer_id });

        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this trainer.' });
        }

        // Send the courses back as a response
        res.status(200).json(courses);
    } catch (err) {
        console.error("Error fetching courses:", err);
        res.status(500).json({ message: err.message });
    }
};


export const getCoursesByEmployee = async (req, res) => {
    const { employee_id } = req.query;

    try {
        // Fetch courses where the employee is assigned
        const courses = await Course.find({
            employees_assigned: employee_id
        });

        if (!courses.length) {
            return res.status(404).json({ message: "No courses found for this employee." });
        }

        res.status(200).json({ data: courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Error fetching courses", error });
    }
};



export const CreateCourse = async (req, res) => {

  const {course_name , description , trainer_name, start_date, end_date, employees_assigned } =
		req.body;
  
	try {
		const newCourse = new Course({
			course_name , description , trainer_name, start_date, end_date, employees_assigned
		});

		const savedCourse = await newCourse.save();
		console.log("saved", savedCourse);
		res.status(201).json(savedCourse);
	} catch (err) {
		console.error("Error creating course:", err);
		res.status(400).json({ message: err.message, details: err.errors });
	}


};

// Additional methods: updateCourse, deleteCourse, etc.
