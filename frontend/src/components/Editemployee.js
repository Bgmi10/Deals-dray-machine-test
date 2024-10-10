import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { baseurl, token } from '../utils/constants';
import { toast } from 'react-toastify';

const Editemployee = ({ showeditpanel, data, fetch_data }) => {
  const [formData, setFormData] = useState({
    name: data?.name || '',
    email: data?.email || '',
    mobile: data?.mobile || '',
    designation: data?.designation || '',
    gender: data?.gender || '',
    course: data?.course || [],
    image: data?.image || null,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (!formData.designation) newErrors.designation = 'Please select a designation';
    if (!formData.gender) newErrors.gender = 'Please select a gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {

        const a = async () => {
            const token = localStorage.getItem('token')
            try {
                const res = await fetch(baseurl + `/api/employees/edit/${data._id}`, {
                    method : "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    body : JSON.stringify(formData)
                });

                if(res.ok){
                   toast.success('user updated successfully');
                   showeditpanel(false);
                   fetch_data();
                }
                
                if(res.status === 400){
                    const data = await res.json();
                    toast.error(data.message)
                }

                

            }
            catch(e){
                console.log(e);
            }
        }
        a();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const newCourse = checked ? [...formData.course, value] : formData.course.filter(c => c !== value);
      setFormData({ ...formData, course: newCourse });
    } else if (type === 'file') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40 backdrop-blur-lg">
      <div className="relative flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Employee</h2>
        
        <form onSubmit={handleSubmit} className="w-full space-y-3">
        <div className='justify-end flex mt-[-56px]'>
            <div className='cursor-pointer transition-transform transform hover:rotate-90 duration-300 ease-in-out'>
              <CloseIcon
                fontSize='large'
                className='text-black'
                onClick={() => showeditpanel(false)}
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder='Name'
              onChange={handleInputChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <input
              type="text"
              placeholder='Mobile Number'
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition"
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
          </div>
          
          <div>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition"
            >
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600">Gender</label>
            <div className="mt-2 flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2 text-gray-600">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                  className="form-radio"
                />
                <span className="ml-2 text-gray-600">Female</span>
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600">Courses</label>
            <div className="mt-2 flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="MCA"
                  checked={formData.course.includes('MCA')}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-600">MCA</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BCA"
                  checked={formData.course.includes('BCA')}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-600">BCA</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="course"
                  value="BSC"
                  checked={formData.course.includes('BSC')}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-600">BSC</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600">Image Upload</label>
            <input
              type="file"
              name="image"
              accept="image/jpeg, image/png"
              onChange={handleInputChange}
              className="mt-2 w-full text-gray-600"
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md"
          >
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editemployee;
