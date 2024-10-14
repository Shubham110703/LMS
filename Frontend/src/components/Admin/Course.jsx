import React, { useEffect, useState } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";


function Course() {
	const [courseFlag, setCourseFlag] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [trainers, setTrainers] = useState([]);
	const [courses, setCourses] = useState([]);
	const [selectedEmployees, setSelectedEmployees] = useState([]);
	const [selectedTrainers, setSelectedTrainers] = useState("");

	const [courseData, setCourseData] = useState({
		course_name: "",
		description: "",
		start_date: "",
		end_date: "",
	});

	const [globalFilter, setGlobalFilter] = useState("");

	const toggleCourseForm = () => {
		setCourseFlag(!courseFlag);
	};

	// Fetch employees
	const fetchEmployees = async () => {
		try {
			const response = await axios.get(
				"http://localhost:4000/api/v1/EmployeeRoutes"
			);
			setEmployees(response.data);
		} catch (error) {
			console.error("Error fetching employees:", error);
		}
	};

	// Fetch trainers
	const fetchTrainers = async () => {
		try {
			const response = await axios.get(
				"http://localhost:4000/api/v1/TrainerRoutes"
			);
			setTrainers(response.data);
		} catch (error) {
			console.error("Error fetching trainers:", error);
		}
	};

	// Fetch courses from backend
	const fetchCourses = async () => {
		try {
			const response = await axios.get(
				"http://localhost:4000/api/v1/CourseRoutes"
			);
			setCourses(response.data);
		} catch (error) {
			console.error(
				"Error fetching courses:",
				error.response ? error.response.data : error.message
			);
		}
	};

	useEffect(() => {
		fetchEmployees();
		fetchTrainers();
		fetchCourses();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCourseData((prev) => ({ ...prev, [name]: value }));
	};

	const handleEmployeeChange = (e) => {
		const options = e.target.options;
		const selected = [];
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selected.push(options[i].value);
			}
		}
		setSelectedEmployees(selected);
	};

	const handleTrainerChange = (e) => {
		setSelectedTrainers(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newCourse = {
			...courseData,
			trainer_name: selectedTrainers,
			employees_assigned: selectedEmployees,
		};

		try {
			await axios.post("http://localhost:4000/api/v1/CourseRoutes", newCourse);
			setCourseData({
				course_name: "",
				description: "",
				start_date: "",
				end_date: "",
			});
			setSelectedEmployees([]);
			setSelectedTrainers("");
			toggleCourseForm();
			fetchCourses();
		} catch (error) {
			console.error(
				"Error adding course:",
				error.response ? error.response.data : error.message
			);
		}
	};

	const buttonBodyTemplate = (rowData) => {
		return (
			<div className="flex ">
				{/* <Button
					icon="pi pi-pencil"
					className="p-button-rounded mr-2 editbtn"
					// onClick={() => console.log("Edit", rowData)}
				/> */}
				<MdModeEditOutline className="mr-6 text-[#0284c7]" onClick={() => console.log("Edit", rowData)}
 />
				{/* <Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-text p-button-danger"
					onClick={() => console.log("Delete", rowData)}

				/> */}
				<FaTrashAlt className="text-red-500" onClick={() => console.log("Delete", rowData)}
 />
			</div>
		);
	};

	const renderHeader = () => {
		return (
			<div className="flex justify-between items-center">
				<span className="text-2xl font-semibold text-blue-800">Course List</span>
				<span className="p-input-icon-left">
					<i className="pi pi-search" />
					<InputText
						value={globalFilter}
						onChange={(e) => setGlobalFilter(e.target.value)}
						placeholder="Search course..."
						className="p-2 w-64 focus:border-blue-300 focus:ring-blue-200 border"
					/>
				</span>
			</div>
		);
	};

	const header = renderHeader();

	return (
		<div className="w-full h-screen relative bg-blue-50">
			{courseFlag && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<form
						className="w-full max-w-lg relative bg-white p-6 rounded-lg shadow-xl"
						onSubmit={handleSubmit}
					>
						<div className="flex flex-wrap -mx-3 mb-6">
							{/* Course Name */}
							<div className="w-full px-3 mb-6">
								<label
									className="text-black block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="course-name"
								>
									Course Name
								</label>
								<input
									className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="course-name"
									name="course_name"
									type="text"
									placeholder="Introduction to React"
									value={courseData.course_name}
									onChange={handleInputChange}
								/>
							</div>

							{/* Description */}
							<div className="w-full px-3 mb-6">
								<label
									className="text-black block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="description"
								>
									Description
								</label>
								<textarea
									className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="description"
									name="description"
									placeholder="A beginner's course on React.js covering components, state, and props."
									value={courseData.description}
									onChange={handleInputChange}
								/>
							</div>

							{/* Trainer Assigned */}
							<div className="w-full px-3 mb-6">
								<label
									className="text-black block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="trainer_name"
								>
									Trainer Name
								</label>
								<select
									className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="trainer_name"
									value={selectedTrainers}
									onChange={handleTrainerChange}
								>
									<option value="">Select a Trainer</option>
									{trainers.map((trainer) => (
										<option key={trainer._id} value={trainer._id}>
											{trainer.name}
										</option>
									))}
								</select>
							</div>

							{/* Start Date */}
							<div className="w-full px-3 mb-6">
								<label
									className="text-black block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="start-date"
								>
									Start Date
								</label>
								<input
									className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="start-date"
									name="start_date"
									type="date"
									value={courseData.start_date}
									onChange={handleInputChange}
								/>
							</div>

							{/* End Date */}
							<div className="w-full px-3 mb-6">
								<label
									className="text-black block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="end-date"
								>
									End Date
								</label>
								<input
									className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="end-date"
									name="end_date"
									type="date"
									value={courseData.end_date}
									onChange={handleInputChange}
								/>
							</div>

							{/* Employees Assigned */}
							<div className="w-full px-3 mb-6">
								<label
									className="text-black block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
									htmlFor="employees_assigned"
								>
									Employees Assigned
								</label>
								<select
									className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
									id="employees_assigned"
									multiple
									value={selectedEmployees}
									onChange={handleEmployeeChange}
								>
									{employees.map((employee) => (
										<option key={employee._id} value={employee._id}>
											{employee.name}
										</option>
									))}
								</select>
							</div>

							<div className="flex  mt-6">
								<Button
									type="button"
									label=""
									icon={<RxCross2 />}
									className="absolute right-3 top-3 cursor-pointer text-blue-400 hover:text-blue-600 text-2xl"
									onClick={toggleCourseForm}
								/>
								<Button
									type="submit"
									label="Add Course"
									icon="pi pi-plus"
									className="w-[25vw] bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
									
								/>
							</div>
						</div>
					</form>
				</div>
			)}

			<div className="p-4 ">
				<div className="flex  justify-between px-4">
				<h1 className="text-2xl font-bold mb-4 text-blue-900">Courses</h1>
				<Button
					label="Add Course"
					icon="pi pi-plus"
					onClick={toggleCourseForm}
					className="mb-3 coursebtn"
				/>
				</div>
				<DataTable
					value={courses}
					globalFilter={globalFilter}
					header={header}
					paginator
					rows={10}
					className="tablehead"
				>
					
					<Column field="course_name" header="Course Name" />
					<Column field="trainer_name" header="Trainer" />
					<Column field="start_date" header="Start Date" />
					<Column field="end_date" header="End Date" />
					<Column body={buttonBodyTemplate} header="Actions" />
				</DataTable>
			</div>
		</div>
	);
}

export default Course;
