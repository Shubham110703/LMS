import React, { useState } from 'react';
import Sidebar from './Sidebar';
 
import Trainers from "../Admin/Trainer";
import Courses from './Courses';

function Trainer({ trainerId, onLogout }) { // Accept trainerId and onLogout as props
  console.log("Trainer ID:", trainerId);
  const [activeComponent, setActiveComponent] = useState("Courses");

  const handleSelectComponent = (componentName) => {
    setActiveComponent(componentName); 
  };

  return (
    <div className="flex">
      <Sidebar onSelectComponent={handleSelectComponent} onLogout={onLogout} /> {/* Pass onLogout to Sidebar */}

      <div className="content h-screen w-full">
    
        {activeComponent === "Courses" && <Courses trainerId={trainerId} />}
      </div>
    </div>
  );
}

export default Trainer;
