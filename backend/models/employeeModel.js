// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name is required
    email: { type: String, required: true, unique: true }, // Email must be unique
    mobile: { type: String, required: true, unique: true, match: /^(\+91[\s-]?)?[789]\d{9}$/ }, // Mobile is required, must be unique, and must match Indian mobile format
    designation: { type: String, required: true }, // Designation is required
    gender: { type: String, enum: ['Male', 'Female'], required: true }, // Gender must be either 'M' or 'F'
    course: { type: [String], required: true }, // Course is an array of strings and is required
    createdDate: { type: Date, default: Date.now }, 
    image: { type: String }, 
});

// Create and export the Employee model
module.exports = mongoose.model('Employee', employeeSchema);
