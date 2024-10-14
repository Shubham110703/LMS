import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	LabelList,
} from "recharts";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import { GiBookPile } from "react-icons/gi";

function Dashboard() {
	const [totalEmp, setTotalEmployee] = useState(0);
	const [EmpName, setEmployeeName] = useState([]);
	const [totalCourse, setTotalCourse] = useState(0);
	const [totalTrainer, setTotalTrainers] = useState(0);
	const [courseFilter, setCourseFilter] = useState("all");
	const [courses, setCourses] = useState([]);
	const [selectedMetric, setSelectedMetric] = useState("communication");
	const [performanceData, setPerformanceData] = useState([]);

	// Function to fetch performance metrics based on course and selected metric
	const fetchPerformanceMetrics = async (courseId) => {
		if (courseId === "all") return; // Do not fetch if 'all' is selected

		try {
			const response = await axios.get(
				`http://localhost:4000/api/v1/PerformanceMetricRoutes/this`,
				{ params: { course_id: courseId } }
			);
			const data = Array.isArray(response.data.data) ? response.data.data : [];
			console.log("Dd ", data);
			if (data.length) {
				// Map and sort data by the selected metric, also map employee_id to employee_name
				const sortedData = data
					.map((entry) => {
						// Find the employee name based on the employee_id from EmpName array
						const employee = EmpName.find((emp) => emp._id === entry.employee_id);
						const employee_name = employee ? employee.name : "Unknown";
	
						return {
							employee_id : employee_name, // Use employee name instead of ID
							quiz_score: entry.quiz_score,
							metric_score: entry.behavioral_metrics[selectedMetric], // Get the score for the selected metric
						};
					})
					.sort((a, b) => b.metric_score - a.metric_score); // Sort by selected metric score
	
				setPerformanceData(sortedData);
			} else {
				setPerformanceData([]); // Clear data if no entries found
			}
		} catch (err) {
			console.error("Error fetching performance metrics:", err);
		}
	};

	const handleCourseFilterChange = (event) => {
		const courseId = event.target.value;
		setCourseFilter(courseId);
		fetchPerformanceMetrics(courseId); // Fetch metrics for the selected course
	};

	const handleMetricChange = (event) => {
		const metric = event.target.value;
		setSelectedMetric(metric);
		fetchPerformanceMetrics(courseFilter); // Fetch metrics again for the selected course and new metric
	};

	const fetchEmployees = async () => {
		try {
			const responseEmp = await axios.get(
				"http://localhost:4000/api/v1/EmployeeRoutes"
			);
			const responseTrainer = await axios.get(
				"http://localhost:4000/api/v1/TrainerRoutes"
			);
			const responseCourse = await axios.get(
				"http://localhost:4000/api/v1/CourseRoutes"
			);
			
			console.log("emp " , responseEmp.data);
			setEmployeeName(responseEmp.data);
			setTotalEmployee(responseEmp.data?.length || 0);
			setTotalTrainers(responseTrainer.data?.length || 0);
			setTotalCourse(responseCourse.data?.length || 0);
			setCourses(
				responseCourse.data.map((course) => ({
					_id: course._id,
					name: course.course_name,
				}))
			);
		} catch (error) {
			console.error("Error fetching data:", error);
			setTotalEmployee(0);
			setTotalCourse(0);
			setTotalTrainers(0);
		}
	};

	useEffect(() => {
		fetchEmployees();
	}, []);

	console.log("Per " , performanceData);

	return (
		<div className="w-full ">
			<div className="m-4 flex justify-between">
				<div className="font-semibold text-center text-3xl ml-3">
					Admin Dashboard
				</div>
				<div className="flex items-center">
					<select
						value={courseFilter}
						onChange={handleCourseFilterChange}
						className="mr-2 w-44 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
					>
						<option value="all">All Courses</option>
						{courses.length > 0 ? (
							courses.map((course) => (
								<option key={course._id} value={course._id}>
									{course.name}
								</option>
							))
						) : (
							<option disabled>No courses available</option>
						)}
					</select>

					<select
						value={selectedMetric}
						onChange={handleMetricChange}
						className="mr-2 w-44 p-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
					>
						<option value="communication">Communication</option>
						<option value="discipline">Discipline</option>
						<option value="problem_solving">Problem Solving</option>
						<option value="punctuality">Punctuality</option>
						<option value="teamwork">Teamwork</option>
					</select>
				</div>
			</div>

			<div className="mt-8 w-full h-[91vh] bg-blue-50">
				<div className="m-4 p-10 flex justify-between rounded-3xl h-1/5">
					<div className="h-36 flex justify-between gap-16 border-2 bg-white border-gray-200 rounded-xl w-1/3 p-6 ">
						<div>
							<p className="text-left mb-4 text-3xl font-bold">{totalEmp}</p>
							<h4 className="text-lg font-semibold">Total Employees</h4>
						</div>
						<FaUserGraduate className="text-3xl mt-4 text-[#0284c7]" />
					</div>
					<div className="h-36 flex justify-between gap-16 ml-6 border-2 bg-white border-gray-200 rounded-xl w-1/3 p-6 ">
						<div>
							<p className="text-left mb-4 text-3xl font-bold">{totalCourse}</p>
							<h4 className="text-lg font-semibold">Total Courses</h4>
						</div>
						<GiBookPile className="text-3xl mt-4 text-[#0284c7]" />
					</div>
					<div className="h-36 flex justify-between gap-16 ml-6 border-2 bg-white border-gray-200 rounded-xl w-1/3 p-6 ">
						<div>
							<p className="text-left mb-4 text-3xl font-bold">
								{totalTrainer}
							</p>
							<h4 className="text-lg font-semibold">Total Trainers</h4>
						</div>
						<FaChalkboardTeacher className="text-3xl mt-4 text-[#0284c7]" />
					</div>
				</div>
				<div className="flex w-full p-8 gap-16">
					<div className="mt-8 w-1/2 border border-gray-300 rounded-md p-4">
						<h3 className="text-xl font-semibold mb-2">Employee Quiz Scores</h3>
						<BarChart width={700} height={420} data={performanceData}>
							<XAxis dataKey="employee_id" />
							<YAxis />
							<Tooltip />
							<Legend />
							<CartesianGrid strokeDasharray="3 3" />
							<Bar dataKey="quiz_score" fill="#82ca9d">
								<LabelList dataKey="quiz_score" position="top" />
							</Bar>
						</BarChart>
					</div>

					<div className="mt-8 w-1/2 border border-gray-300 rounded-md p-4">
						<h3 className="text-xl font-semibold mb-2">
							{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}{" "}
							Scores
						</h3>
						<BarChart width={700} height={420} data={performanceData}>
							<XAxis dataKey="employee_id" />
							<YAxis />
							<Tooltip />
							<Legend />
							<CartesianGrid strokeDasharray="3 3" />
							<Bar dataKey="metric_score" fill="#8884d8">
								<LabelList dataKey="metric_score" position="top" />
							</Bar>
						</BarChart>
					</div>
				</div>
				{/* Graphs for Quiz Scores and Performance Metrics */}

			</div>
		</div>
	);
}

export default Dashboard;
