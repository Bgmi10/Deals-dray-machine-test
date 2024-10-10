import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { baseurl } from '../utils/constants';

export const CreateEmployee = ({ setIsopen , fetch_data}) => {


    
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          setFormData((prevData) => ({ ...prevData, image: file }));
        }
      };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'HR',
    gender: 'M',
    course: [],
    image: null,
  });

  const formConfig = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Name',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      required: true,
    },
    {
      name: 'mobile',
      type: 'number',
      placeholder: 'Mobile No',
      required: true,
      onKeyDown: (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
          e.preventDefault();
        }
      },
      inputProps: {
        pattern: '[0-9]*',
        inputMode: 'numeric',
      },
    },
    {
      name: 'designation',
      type: 'select',
      options: ['HR', 'Manager', 'Sales'],
    },
    {
      name: 'gender',
      type: 'radio',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
      ],
    },
    {
      name: 'course',
      type: 'checkbox',
      options: ['MCA', 'BCA', 'BSC'],
    },
    {
      name: 'image',
      type: 'file',
      placeholder: 'Upload Image',
      required: true,
      onChange: handleFileUpload,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      course: checked
        ? [...prevData.course, value]
        : prevData.course.filter((course) => course !== value),
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);

    // Validation
    if (!formData.name) {
      toast.error('Name is a required field');
      return;
    }

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);
    if (!validEmail) {
      toast.error('Email should be in a valid format');
      return;
    }

    const validMobileNumber = /^(\+91[\s-]?)?[789]\d{9}$/.test(formData.mobile);
    if (!validMobileNumber) {
      toast.error('Enter a valid mobile number');
      return;
    }

    if (formData.course.length === 0) {
      toast.error('Please choose at least one course');
      return;
    }

    
    
    const a = async () => {
      const token = localStorage.getItem('token')
        try {
            const res = await fetch(baseurl + '/api/employees/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(formData), 
            });
    
            const data = await res.json();
    
            if (res.ok) {
                toast.success('Employee created successfully!');
                setIsopen(false);
                fetch_data()
                return;
            } else {
                
                if (data && data.message) {
                    toast.error(data.message); 
                } else {
                    toast.error('An error occurred. Please try again.'); 
                }
                return;
            }
        } catch (e) {
            console.error('Error creating employee:', e); 
             toast.error('An unexpected error occurred. Please try again.'); 
        }
    };
    
    a();
  
    
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40 backdrop-blur-lg">
      <div className="relative flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create Employee</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className='justify-end flex mt-[-56px]'>
            <div className='cursor-pointer transition-transform transform hover:rotate-90 duration-300 ease-in-out'>
              <CloseIcon
                fontSize='large'
                className='text-black'
                onClick={() => setIsopen(false)}
              />
            </div>
          </div>

          {formConfig.map((field) => {
            if (field.type === 'select') {
              return (
                <select
                  key={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            }

            if (field.type === 'radio') {
              return (
                <div key={field.name} className="flex items-center space-x-4">
                  {field.options.map((option) => (
                    <label className="flex items-center" key={option.value}>
                      <input
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={formData[field.name] === option.value}
                        onChange={handleChange}
                        className="form-radio focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              );
            }

            if (field.type === 'checkbox') {
              return (
                <div key={field.name}>
                  <label className="text-sm font-medium text-gray-700 mb-2">Courses</label>
                  <div className="flex space-x-4">
                    {field.options.map((option) => (
                      <label className="flex items-center" key={option}>
                        <input
                          type="checkbox"
                          value={option}
                          onChange={handleCheckboxChange}
                          className="form-checkbox focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <div key={field.name}>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-gray-500 focus:border-gray-500 transition"
                  required={field.required}
                  {...(field.inputProps || {})} // Spread additional props for number input
                />
              </div>
            );
          })}

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
