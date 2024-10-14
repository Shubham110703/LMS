import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Employees from "./Employee";
import Trainers from "./Trainer";
import Courses from "./Course";

function Admin({onLogout}) {
	const [activeComponent, setActiveComponent] = useState("Dashboard");

	const handleSelectComponent = (componentName) => {
		setActiveComponent(componentName);
	};

	return (
		<div className="flex ">
			<Sidebar
				activeComponent={activeComponent}
				onSelectComponent={handleSelectComponent}
				onLogout={onLogout} 
			/>

			<div className="content w-full">
				{activeComponent === "Dashboard" && <Dashboard />}
				{activeComponent === "Employees" && <Employees />}
				{activeComponent === "Trainers" && <Trainers />}
				{activeComponent === "Courses" && <Courses />}
			</div>
		</div>
	);
}

export default Admin;
