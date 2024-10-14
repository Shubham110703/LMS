import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { PiUsersThree } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Sidebar({ activeComponent, onSelectComponent, onLogout }) {
    const navigate = useNavigate(); 

    return (
        <div className="w-80 h-screen text-black p-4 border-r shadow-lg">
            <h1 className="text-3xl font-bold mb-4">LMS</h1>
            <div className="text-xl justify-center mt-9 flex flex-col space-y-3">
                

                <li
                    className={`listitem list-none hover:text-white hover:rounded cursor-pointer flex items-center space-x-2 p-2 ${
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
                    navigate("/");
                }}
            >
                Logout <IoIosLogOut className="text-xl ml-4 mt-1" />
            </p>
        </div>
    );
}

export default Sidebar;
