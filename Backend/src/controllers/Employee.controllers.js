import Employee from "../models/Employee.model.js";




import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'



export const EmployeeLogin = async (req, res) => {
    const { email, password } = req.body;

    console.log("Hell o ",  req.body);
    // Step 1: Validations
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Step 2: Get user
        const emp = await Employee.findOne({ email });
        
        // Step 3: Check if user exists
        if (!emp) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Step 4: Check password
        const isMatch = await bcrypt.compare(password, emp.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Step 5: Generate token
        const token = jwt.sign(
            { id: emp._id, email: emp.email }, // Payload
            process.env.JWT_SECRET, // Secret key (ensure you have this in your environment variables)
            { expiresIn: '1h' } // Token expiry time
        );

        // Step 6: Inject token into cookies
        res.cookie('token', token, {
            httpOnly: true, // Helps mitigate XSS attacks
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 3600000 // Cookie expiry time (1 hour)
        });

        // Step 7: Send response
        return res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: 'Server error' });
    }
};



export const GetAllEmployees = async (req, res) => {
	

	try {
		const employees = await Employee.find();
		res.status(200).json(employees);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const GetAllEmployeesById = async (req, res) => {
    const { employeeID } = req.params; 
	console.log(employeeID);
	
    try {
        const employee = await Employee.findById(employeeID); // Use Employee model to find by ID
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" }); // Change message to reflect employee
        }
        res.status(200).json(employee); // Return the employee object
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const CreateEmployee = async (req, res) => {
	const { name, email, password, phone_num , designation, hire_date } =
		req.body;
    console.log("hskjfhdsk")
        try {
            const existingUser = await Employee.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists with this email.' });
            }
    
            // Hash the password before saving it to the database
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = new Employee({
                name,
                email,
                password: hashedPassword, // Store the hashed password
                phone_num,
                designation,
                hire_date
            });
    
            // Save user to the database
            await newUser.save();
    
            // Return a successful response
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
};

// Additional methods: updateEmployee, deleteEmployee, etc.
