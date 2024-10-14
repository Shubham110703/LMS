import mongoose from "mongoose";	
import PerformanceMetric from "../models/PerformanceMetric.model.js";

export const GetAllPerformanceMetrics = async (req, res) => {
	try {

		console.log("idf  " , req.query);
		// console.log("idf  ");
		const { employee_id, course_id } = req.query;

		console.log("Received employee_id:", employee_id, "course_id:", course_id);

		if (!employee_id || !course_id) {
			return res
				.status(400)
				.json({ message: "employee_id and course_id are required." });
		}

		// Find a performance metric entry matching both employee_id and course_id
		const flag = await PerformanceMetric.findOne({ employee_id: employee_id, course_id: course_id });

		if (flag) {
			// If the entry exists, respond with 'Found'
			return res.json({ message: "Found", data: flag });
		} else {
			// If the entry does not exist, respond with 'Not Found'
			return res.json({ message: "Not Found" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};
export const GetAllPerformanceMetricbyEmp = async (req, res) => {
	console.log("heekk ")
	try {
		
		const course_id = req.query.course_id;
		
		// Find a performance metric entry matching both employee_id and course_id
		const flag = await PerformanceMetric.find({course_id});

		if (flag) {
			// If the entry exists, respond with 'Found'
			return res.json({ message: "Found", data: flag });
		} else {
			// If the entry does not exist, respond with 'Not Found'
			return res.json({ message: "Not Found" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};


export const GetAllPerformanceMetricById = async (req, res) => {
	
	console.log("tishis s")
	try {
		
		const employee = await PerformanceMetric.find();

		if (!employee) {
			console.log("Fail")
			return res
				.status(404)
				.json({ message: "Failure" });
		}

		res.status(200).json({data:employee });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const CreatePerformanceMetric = async (req, res) => {
	try {
		// Extract the relevant data from the request body
		const { employee_id, course_id, quiz_score, behavioral_metrics, comments } =
			req.body;

		console.log("Req ", req.body);

		// Create a new PerformanceMetric instance using the provided data
		const performanceMetric = new PerformanceMetric({
			employee_id, // Employee ID passed from frontend
			course_id, // Course ID passed from frontend
			quiz_score, // Quiz score (0-10)
			behavioral_metrics: {
				// Nested behavioral metrics (discipline, punctuality, etc.)
				discipline: behavioral_metrics.discipline,
				punctuality: behavioral_metrics.punctuality,
				teamwork: behavioral_metrics.teamwork,
				communication: behavioral_metrics.communication,
				problem_solving: behavioral_metrics.problem_solving,
			},
			comments, // Optional comments field
		});

		// Save the performance metric to the database
		const newMetric = await performanceMetric.save();

		// Respond with the newly created performance metric
		res.status(201).json(newMetric);
	} catch (err) {
		// Handle validation or other errors
		res.status(400).json({ message: err.message });
	}
};

// Additional methods: updatePerformanceMetric, deletePerformanceMetric, etc.
