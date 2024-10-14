import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Sidebar({ activeComponent, onSelectComponent , onLogout }) {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className="w-80  text-black p-4 border-r shadow-lg">
            <h1 className="text-3xl font-bold mb-4">LMS</h1>
            <div className="text-xl justify-center mt-9 flex flex-col space-y-3">
                <li
                    className={`list-none hover:text-white listitem hover:rounded cursor-pointer flex items-center space-x-2 p-2 ${
                        activeComponent === "Dashboard" ? "active" : ""
                    }`}
                    onClick={() => onSelectComponent("Dashboard")}
                >
                    <MdDashboard />
                    <span>Dashboard</span>
                </li>

                <li
                    className={`list-none hover:text-white listitem hover:rounded cursor-pointer flex items-center space-x-2 p-2 ${
                        activeComponent === "Employees" ? "active" : ""
                    }`}
                    onClick={() => onSelectComponent("Employees")}
                >
                    <FaRegUser />
                    <span>Employees</span>
                </li>

                <li
                    className={`list-none hover:text-white listitem hover:rounded cursor-pointer flex items-center space-x-2 p-2 ${
                        activeComponent === "Trainers" ? "active" : ""
                    }`}
                    onClick={() => onSelectComponent("Trainers")}
                >
                    <PiUsersThree />
                    <span>Trainers</span>
                </li>

                <li
                    className={`list-none hover:text-white listitem hover:rounded cursor-pointer flex items-center space-x-2 p-2 ${
                        activeComponent === "Courses" ? "active" : ""
                    }`}
                    onClick={() => onSelectComponent("Courses")}
                >
                    <FaBookReader />
                    <span>Courses</span>
                </li>
            </div>

            <p
                className="bg-[#0284c7] absolute bottom-8 left-16 cursor-pointer flex text-white rounded-sm py-2 px-4"
                onClick={() => {
					onLogout();
                    navigate("/"); // Redirect to the login page
                }}
            >
                Logout <IoIosLogOut className="text-xl ml-4" />
            </p>
        </div>
    );
}

export default Sidebar;
