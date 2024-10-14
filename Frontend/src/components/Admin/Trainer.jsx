import React, { useState, useEffect } from 'react';
import axios from "axios";
import { RxCross2 } from 'react-icons/rx';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

// Add these imports for PrimeReact styling
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { MdModeEditOutline } from 'react-icons/md';

function Trainer() {
    const [trainer, setTrainer] = useState(false);
    const [users, setUser] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const [trainerData, setTrainerData] = useState({
        name: "",
        email: "",
        password: "",
        phone_num: "",
        expertise_area: ""
    });

    const addTrainer = () => {
        setTrainer(!trainer);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTrainerData({ ...trainerData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/TrainerRoutes",
                trainerData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setTrainer(false);
            fetchTrainers();
        } catch (error) {
            console.error("Error adding trainer:", error);
        }
    };

    const fetchTrainers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/v1/TrainerRoutes');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    useEffect(() => {
        fetchTrainers();
    }, []);

    const handleEdit = (rowData) => {
        console.log('Editing trainer:', rowData);
    };

    const buttonBodyTemplate = (rowData) => {
        return (
            // <Button
            //     icon="pi pi-pencil"
            //     className="p-button-rounded p-button-text"
            //     onClick={() => handleEdit(rowData)}
            // />
            <MdModeEditOutline className="mr-6 text-[#0284c7]" onClick={() => console.log("Edit", rowData)}
/>
        );
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-blue-800">Trainer List</span>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search trainer..."
                        className="p-2 w-64 border focus:border-blue-300 focus:ring-blue-200"
                    />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="w-full h-screen relative bg-blue-50">
            {trainer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <form
                        className="w-full max-w-lg relative bg-white p-6 rounded-lg shadow-xl"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <RxCross2
                                className="absolute right-3 top-3 cursor-pointer text-blue-400 hover:text-blue-600 text-2xl"
                                onClick={() => setTrainer(false)}
                            />
                            <h2 className="w-full px-3 mb-4 text-2xl font-bold text-blue-800">Add New Trainer</h2>
                            
                            {/* Form fields */}
                            {['name', 'email', 'password', 'phone_num', 'expertise_area'].map((field) => (
                                <div key={field} className="w-full px-3 mb-4">
                                    <label className="block text-blue-800 text-sm font-semibold mb-2 capitalize" htmlFor={field}>
                                        {field.replace('_', ' ')}
                                    </label>
                                    <input
                                        className="appearance-none block w-full bg-blue-50 text-blue-900 border border-blue-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-blue-400"
                                        id={field}
                                        type={field === 'password' ? 'password' : field === 'phone_num' ? 'tel' : 'text'}
                                        value={trainerData[field]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${field.replace('_', ' ')}`}
                                    />
                                </div>
                            ))}

                            <div className="w-full px-3 mt-4">
                                <button
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                                    type="submit"
                                >
                                    Add Trainer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-3xl text-blue-900">Trainer Management</h1>
                    <Button
                        onClick={addTrainer}
                        className="px-6 py-2 bg-[#0284c7] hover:bg-blue-600 text-white rounded-lg text-lg transition-colors duration-200 flex items-center"
                    >
                        <i className="pi pi-plus mr-2" />
                        Add Trainer
                    </Button>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <DataTable 
                            value={users}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            className="p-datatable-sm "
                            globalFilter={globalFilter}
                            header={header}
                            emptyMessage="No trainers found."
                            rowHover
                            removableSort
                            stripedRows
                            rowClassName={() => 'hover:bg-blue-50 transition-colors duration-200'}
                        >
                            <Column 
                                field="name" 
                                header="Name" 
                                sortable 
                                filter 
                                filterPlaceholder="Search by name"
                                className="text-blue-900"
                                headerClassName="bg-blue-100 text-blue-800 p-4"
                            />
                            <Column 
                                field="email" 
                                header="Email" 
                                sortable 
                                filter 
                                filterPlaceholder="Search by email"
                                className="text-blue-900"
                                headerClassName="bg-blue-100 text-blue-800"
                            />
                            <Column 
                                field="phone_num" 
                                header="Phone Number"
                                className="text-blue-900"
                                headerClassName="bg-blue-100 text-blue-800"
                            />
                            <Column 
                                field="expertise_area" 
                                header="Expertise Area" 
                                sortable 
                                filter 
                                filterPlaceholder="Search by expertise"
                                className="text-blue-900"
                                headerClassName="bg-blue-100 text-blue-800"
                            />
                            <Column 
                                body={buttonBodyTemplate} 
                                header="Actions"
                                headerClassName="bg-blue-100 text-blue-800"
                                bodyClassName="text-center"
                                style={{ width: '100px' }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>

            <style jsx>{`
                :global(.p-datatable .p-datatable-thead > tr > th) {
                    background-color: #dbeafe !important;
                    color: #1e40af !important;
                }
                :global(.p-datatable .p-datatable-tbody > tr) {
                    background-color: #ffffff;
                }
                :global(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
                    background-color: #f0f9ff;
                }
                :global(.p-paginator) {
                    background-color: #dbeafe !important;
                }
                :global(.p-button.p-button-text) {
                    color: #2563eb !important;
                }
                :global(.p-button.p-button-text:hover) {
                    background-color: #bfdbfe !important;
                }
                :global(.p-inputtext:focus) {
                    border-color: #93c5fd !important;
                    box-shadow: 0 0 0 2px #bfdbfe !important;
                }
            `}</style>
        </div>
    );
}

export default Trainer;