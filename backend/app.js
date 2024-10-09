require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employeeRoutes');
const cors = require('cors')

const app = express();
const port = 3001;


app.use(cors());


app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);  // Adding employee routes

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
