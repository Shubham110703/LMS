import React, { useState, useEffect } from 'react'
import axios from "axios";
import { RxCross2 } from 'react-icons/rx';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

// Add these imports for PrimeReact styling
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { FaInfoCircle } from 'react-icons/fa';

function Employee() {
    const [empId , setEmpId] = useState(false);
    const [addEmp, setAddEmp] = useState(false);
    const [totalEmp, setTotalEmployee] = useState(0);
    const [totalCourse, setTotalCourse] = useState(0);
    const [totalTrainer, setTotalTrainers] = useState(0);
    const [users, setUser] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [empInfo, setEmpInfo] = useState(false);
    const [empPerformanceInfo, setEmpPerformanceInfo] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [metrics, setMetrics] = useState({
        quiz_score: 0,
        discipline: 0,
        punctuality: 0,
        teamwork: 0,
        communication: 0,
        problem_solving: 0,
        retention_score: 0
    });

    const [employeeData, setEmployeeData] = useState({
        name: "",
        email: "",
        password: "",
        phone_num: "",
        designation: "",
        hireDate: "",
    });

    const addEmployee = () => {
        setAddEmp(!addEmp);
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setEmployeeData({ ...employeeData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/EmployeeRoutes",
                employeeData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setAddEmp(false);
            fetchEmployees();
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const responseEmp = await axios.get('http://localhost:4000/api/v1/EmployeeRoutes');
            const responseTrainer = await axios.get('http://localhost:4000/api/v1/TrainerRoutes');
            const responseCourse = await axios.get('http://localhost:4000/api/v1/CourseRoutes');
            
            if (responseEmp.data && Array.isArray(responseEmp.data)) {
                setUser(responseEmp.data);
                setTotalEmployee(responseEmp.data.length);
            }
            if (responseTrainer.data && Array.isArray(responseTrainer.data)) {
                setTotalTrainers(responseTrainer.data.length);
            }
            if (responseCourse.data && Array.isArray(responseCourse.data)) {
                setTotalCourse(responseCourse.data.length);
                setCourses(responseCourse.data); // Set courses for the dropdown
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setTotalEmployee(0);
            setTotalCourse(0);
            setTotalTrainers(0);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEdit = async (rowData) => {
        setEmpId(rowData._id);
        console.log("Editing employee:", empId);
        try {
            const response = await axios.get(
                `http://localhost:4000/api/v1/PerformanceMetricRoutes/${empId}`
            );
            console.log("Res ", response.data.data);
            if (response.data.data.length !== 0) {
                setEmpInfo(true);
                setEmpPerformanceInfo(response.data.data);
            }
        } catch (err) {
            console.log("Error:", err);
        }
    };

    const buttonBodyTemplate = (rowData) => {
        return (
<FaInfoCircle  onClick={() => handleEdit(rowData)}/>
            
               
        
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-blue-800">Employee List</span>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search employee..."
                        className="p-2 w-64 border focus:border-blue-300 focus:ring-blue-200"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const handleCourseSelection = async (courseId) => {
        console.log("Course selected " , courseId , " Emp id " , empId)
        setSelectedCourse(courseId);
        const empData = {
            employee_id: empId , course_id: courseId
        }
        try {
            const response = await axios.get(
                `http://localhost:4000/api/v1/PerformanceMetricRoutes` , { params: empData }
            );
            console.log("Res ", response.data.data);
           
            if (response.data.data != undefined) {
                // Use setMetrics to update the state
                setMetrics({
                  quiz_score: response.data.data.quiz_score,
                  discipline: response.data.data.behavioral_metrics.discipline,
                  punctuality: response.data.data.behavioral_metrics.punctuality,
                  teamwork: response.data.data.behavioral_metrics.teamwork,
                  communication: response.data.data.behavioral_metrics.communication,
                  problem_solving: response.data.data.behavioral_metrics.problem_solving,
                  retention_score: 0
                });
              } else {
                setMetrics({
                  quiz_score: 0,
                  discipline: 0,
                  punctuality: 0,
                  teamwork: 0,
                  communication: 0,
                  problem_solving: 0,
                  retention_score: 0
                });
              }
        } catch (err) {
            console.log("Error:", err);
        }
        // Fetch performance metrics for selected course and employee if needed
    };

    const handleEmpInfoClose = () => {
        setEmpInfo(false);
        setSelectedCourse(null);
    };

    return (
        <div className="w-full h-[100vh] relative bg-blue-50">
            {empInfo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="absolute left-1/4 top-1/4 inset-0 bg-white items-center h-1/2 w-1/2 z-50 p-6">
                        <RxCross2
                            className="absolute right-3 top-3 cursor-pointer text-blue-400 hover:text-blue-600 text-2xl"
                            onClick={handleEmpInfoClose}
                        />
                        <h1 className="font-bold text-3xl text-blue-900">
                            Employee Information
                        </h1>
                        <div className="flex mt-4">
                            {/* Dropdown for courses */}
                            <div className="w-1/2">
                                <label className="block text-blue-800 font-semibold mb-2">Select Course</label>
                                <select
                                    className="w-full p-2 border border-blue-300 rounded"
                                    value={selectedCourse}
                                    onChange={(e) => handleCourseSelection(e.target.value)}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id} >
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Metrics display */}
                            <div className="w-1/2 pl-4">
                                <h2 className="font-semibold text-lg text-blue-900 mb-4">Performance Metrics</h2>
                                <p><strong>Quiz Score:</strong> {metrics.quiz_score}</p>
                                <p><strong>Discipline:</strong> {metrics.discipline}</p>
                                <p><strong>Punctuality:</strong> {metrics.punctuality}</p>
                                <p><strong>Teamwork:</strong> {metrics.teamwork}</p>
                                <p><strong>Communication:</strong> {metrics.communication}</p>
                                <p><strong>Problem Solving:</strong> {metrics.problem_solving}</p>
                                <p><strong>Retention Score:</strong> {metrics.retention_score}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
           {addEmp && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<form
						className="w-full max-w-lg relative bg-white p-6 rounded-lg shadow-xl"
						onSubmit={handleSubmit}
					>
						<div className="flex flex-wrap -mx-3 mb-6">
							<RxCross2
								className="absolute right-3 top-3 cursor-pointer text-blue-400 hover:text-blue-600 text-2xl"
								onClick={() => setAddEmp(false)}
							/>
							<h2 className="w-full px-3 mb-4 text-2xl font-bold text-blue-800">
								Add New Employee
							</h2>

							{/* Form fields */}
							{["name", "email", "password", "phone_num", "designation"].map(
								(field) => (
									<div key={field} className="w-full px-3 mb-4">
										<label
											className="block text-blue-800 text-sm font-semibold mb-2 capitalize"
											htmlFor={field}
										>
											{field.replace("_", " ")}
										</label>
										<input
											className="appearance-none block w-full bg-blue-50 text-blue-900 border border-blue-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
											id={field}
											type={
												field === "password"
													? "password"
													: field === "phone_num"
													? "tel"
													: "text"
											}
											value={employeeData[field]}
											onChange={handleChange}
											
										/>
									</div>
								)
							)}

							<div className="w-full px-3 mb-4">
								<label
									className="block text-blue-800 text-sm font-semibold mb-2"
									htmlFor="hireDate"
								>
									Hire Date
								</label>
								<input
									className="appearance-none block w-full bg-blue-50 text-blue-900 border border-blue-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
									id="hireDate"
									type="date"
									value={employeeData.hireDate}
									onChange={handleChange}
								/>
							</div>

							<div className="w-full px-3 mt-4">
								<button
									className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
									type="submit"
								>
									Add Employee
								</button>
							</div>
						</div>
					</form>
				</div>
			)}

			<div className="p-6 space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="font-bold text-3xl text-blue-900">
						Employee Management
					</h1>
					<Button
						onClick={addEmployee}
						className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg transition-colors duration-200 flex items-center"
					>
						<i className="pi pi-plus mr-2" />
						Add Employee
					</Button>
				</div>


                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 ">
                        <DataTable
                            value={users}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            className="p-datatable-sm"
                            globalFilter={globalFilter}
                            header={header}
                            emptyMessage="No employees found."
                            rowHover
                            removableSort
                            stripedRows
                            rowClassName={() => "hover:bg-blue-50 transition-colors duration-200"}
                        >
                            <Column
                                field="name"
                                header="Name"
                                sortable
                                className="text-lg font-medium text-blue-900 p-4"
                            />
                            <Column
                                field="email"
                                header="Email"
                                sortable
                                className="text-lg text-blue-900"
                            />
                            <Column
                                field="phone_num"
                                header="Phone"
                                sortable
                                className="text-lg text-blue-900"
                            />
                            <Column
                                field="designation"
                                header="Designation"
                                sortable
                                className="text-lg text-blue-900"
                            />
                            <Column
                                header="Edit"
                                body={buttonBodyTemplate}
                                exportable={false}
                                style={{ textAlign: 'left', width: '4em' }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Employee;
