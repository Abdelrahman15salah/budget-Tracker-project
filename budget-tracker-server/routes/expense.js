const express = require('express');
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/add', authenticate, async (req, res) => {
  const { category, amount, description ,date } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ message: 'Category and amount are required' });
  }

  try {
    const expense = new Expense({
      userId: req.userId,
      category,
      amount,
      description,
      date
    });

    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/edit/:id', authenticate, async (req, res) => {
  const { id } = req.params; // Expense ID from the route parameter
  const { category, amount, description } = req.body; // Fields to update

  // Validate input
  if (!category && !amount && !description) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  try {
    // Find the expense by ID and ensure it belongs to the logged-in user
    const expense = await Expense.findOne({ _id: id, userId: req.userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (category) expense.category = category;
    if (amount) expense.amount = amount;
    if (description) expense.description = description;
    // Save the updated expense
    const updatedExpense = await expense.save();
    res.json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
}



);

router.delete('/delete/:id', async (req, res) => {
  try {
    const expenseId = req.params.id; // Get the expense ID from the request URL

    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
