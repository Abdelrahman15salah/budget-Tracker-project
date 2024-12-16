const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard'); 
const expenseRoutes = require('./routes/expense');
const authMiddleware = require('./middleware/auth');
const incomeRoutes = require('./routes/income');
const goalRoutes = require('./routes/goal');
const reportRoutes = require('./routes/reports');
const budgetRoutes = require('./routes/budget');

require('dotenv').config();
const app = express();

app.use(cors({
  origin: 'http://localhost:4200'  
}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);   
app.use('/api/dashboard', dashboardRoutes);   
app.use('/api/expenses', authMiddleware, expenseRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/', budgetRoutes);
mongoose.connect('mongodb://localhost:27017/')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
app.get('/', (req, res) => {
    res.send('Welcome to Budget Tracker API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
