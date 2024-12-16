const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const mongoose = require('mongoose');
const  verifyToken   = require('../middleware/auth');

router.post('/generate', (req, res) => {
    const { totalIncome, totalExpenses, savingsGoal, savingsProgress, budgetVariance } = req.body;
  
    // Assuming you want to generate a report based on this data
    const report = {
      totalIncome,
      totalExpenses,
      incomeVsExpenses: totalIncome - totalExpenses,
      savingsGoal,
      savingsProgress,
      budgetVariance,
    };
  
    // Here, you can also format the report as needed (e.g., generate a PDF or return as JSON)
    res.json(report);  // Respond with the generated report
  });

module.exports = router;
