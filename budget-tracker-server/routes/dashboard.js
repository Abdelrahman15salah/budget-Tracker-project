const express = require('express');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const mongoose = require('mongoose');
const router = express.Router();

const getTotalIncome = async (userId) => {
  const incomeData = await Income.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalIncome: { $sum: '$amount' } } },
  ]);
  return incomeData.length > 0 ? incomeData[0].totalIncome : 0; // Return 0 if no income found
};

const getTotalExpenses = async (userId) => {
  const expensesData = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalExpenses: { $sum: '$amount' } } },
  ]);
  return expensesData.length > 0 ? expensesData[0].totalExpenses : 0; // Return 0 if no expenses found
};

router.get('/', authMiddleware, async (req, res) => {

  try {
    const userId = req.user.userId;

    // console.log('User ID:', userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // console.log('User Data:', user);

    const totalIncome = await getTotalIncome(userId);
    const totalExpenses = await getTotalExpenses(userId);

    // Calculate balance (income - expenses), ensuring it never goes negative
    const balance = totalIncome - totalExpenses;

    const savingsGoal = user.savingsGoal || 0;
    let progressTowardsGoal = 0;
    
    if (savingsGoal > 0) {
      progressTowardsGoal = ((totalIncome - totalExpenses) / savingsGoal) * 100;
    }

    // console.log('Total Income:', totalIncome);
    // console.log('Total Expenses:', totalExpenses);
    // console.log('Balance:', balance);
    // console.log('Progress Towards Goal:', progressTowardsGoal);

    res.json({
      income: totalIncome,
      expenses: totalExpenses,
      balance: balance,
      savingsGoal: savingsGoal,
      progressTowardsGoal: progressTowardsGoal.toFixed(2), 
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
