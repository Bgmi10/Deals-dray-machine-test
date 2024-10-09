const express = require('express');
const Employee = require('../models/employeeModel');
const { authenticateToken } = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/create', authenticateToken, async (req, res) => {
    const { name, email, mobile, designation, gender, course, image } = req.body;

    try {
        const employeeExists = await Employee.findOne({ email });
        if (employeeExists) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        const duplicatemobile = await Employee.findOne({mobile});
        if(duplicatemobile){
            return res.status(400).json({ message: 'Employee already exists with provided mobile number' });
        }

        const employee = new Employee({ name, email, mobile, designation, gender, course, image });
        await employee.save();

        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
});

router.get('/list',authenticateToken, async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error });
    }
});

router.put('/edit/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, designation, gender, course, image } = req.body;

    if (!name || !email || !mobile || !designation || !gender || !course) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const checkemail = await Employee.findOne({ email, _id: { $ne: id } });
        if (checkemail) {
            return res.status(400).json({ message: 'Employee already exists with this email' });
        }

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = name;
        employee.email = email;
        employee.mobile = mobile;
        employee.designation = designation;
        employee.gender = gender;
        employee.course = course;
        employee.image = image;

        await employee.save();
        return res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
});

router.delete('/delete/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});

module.exports = router;
