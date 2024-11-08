import React, { useEffect, useState } from 'react';
import { CreateEmployee } from './CreateEmployee';
import { baseurl } from '../utils/constants';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Editemployee from './Editemployee';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import { Zoom, toast } from 'react-toastify';

export const EmployeeList = () => {
  const [isopen, setIsopen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [userkeyword, setUserkeyword] = useState('');
  const [showdelete, setshowdelete] = useState(false);
  const [selecteduser, setSelecteduser] = useState();
  const [showeditpanel, setEditpanel] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
   
        fetch_data(); // Pass the token to the fetch_data function
    }, []);


  const fetch_data = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(baseurl + '/api/employees/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      setEmployees(json);
      setFilteredEmployees(json); 
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const up = employees.filter((i) => 
      i.name.toLowerCase().includes(userkeyword.toLowerCase())
    );
    setFilteredEmployees(up);
  }, [userkeyword, employees]);

  const handledelete = (i) => {
    setshowdelete(true);
    setSelecteduser(i);
  };

  const handleacutaldelete = async (i) => {
    const token = localStorage.getItem('token'); // Fetch token here
    if (!token) return; // Ensure the token is available

    try {
        const res = await fetch(baseurl + `/api/employees/delete/${i._id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        fetch_data(token); // Pass token to fetch_data
        if (res.ok) {
            toast.success('User deleted successfully');
        }
        setshowdelete(false);
    } catch (e) {
        console.log(e);
    }
};


  const handleedit = (i) => {
    setEditpanel(true);
    setSelecteduser(i);
  };

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee List</h1>
        <div className="flex items-center space-x-4">
          <p>Total Count: {employees.length}</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setIsopen(true)}>Create Employee</button>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name"
          className="px-4 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserkeyword(e.target.value)}
        />
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[50vh] text-center">
          <SentimentVeryDissatisfiedIcon fontSize="large" className="text-gray-400 mb-4" />
          <span className="text-2xl font-bold text-gray-400">No employees found</span>
        </div>
      ) : (
        <table className="table-auto w-full shadow-md rounded-lg">
          <thead>
            <tr className="bg-slate-800 text-left text-gray-300">
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Mobile No</th>
              <th className="px-4 py-2">Designation</th>  
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Create Date</th>
              <th className="px-4 py-2">Action</th>
              <th><RefreshIcon  className='cursor-pointer' onClick={() => fetch_data()} /></th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee._id} className="border border-slate-700">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2"><img src={employee.image} className='rounded-full h-10 w-10' alt='user img' /></td>
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.mobile}</td>
                <td className="px-4 py-2">{employee.designation}</td>
                <td className="px-4 py-2">{employee.gender}</td>
                <td className="px-4 py-2">
                  {employee.course.map((i, index) => (
                    <span key={index} className="mr-2">{i}</span>
                  ))}
                </td>
                <td className="px-4 py-2">
                 {format(new Date(employee.createdDate), 'MMMM d, yyyy')} 
                </td>
                <td className="px-4 py-2">
                  <button className="text-blue-400 hover:underline mr-2" onClick={() => handleedit(employee)}>Edit</button>
                  <button className="text-red-400 hover:underline" onClick={() => handledelete(employee)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isopen && <CreateEmployee isopen={isopen} setIsopen={setIsopen} fetch_data={fetch_data} />}
      {showeditpanel && <Editemployee data={selecteduser} showeditpanel={setEditpanel} fetch_data={fetch_data} />}
      
      {showdelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop:blur-sm flex justify-center items-center">
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete?</h2>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => setshowdelete(false)}>Cancel</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleacutaldelete(selecteduser)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
