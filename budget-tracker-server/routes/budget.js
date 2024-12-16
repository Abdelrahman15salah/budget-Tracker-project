const express = require('express');
const Budget = require('../models/Budget');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate and get userId
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

// Get all budgets for the authenticated user
router.get('/budgets', authenticate, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new budget
router.post('/budgets', authenticate, async (req, res) => {
  const { month, categories } = req.body;

  try {
    const newBudget = new Budget({
      userId: req.userId, // Assign the userId from the token
      month,
      categories,
    });
    await newBudget.save();
    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add budget' });
  }
});

// Edit a budget
router.put('/budgets/:id', authenticate, async (req, res) => {
  const budgetId = req.params.id;
  const { categories } = req.body;

  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: budgetId, userId: req.userId },
      { categories },
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update budget' });
  }
});

// Delete a budget
router.delete('/budgets/:id', authenticate, async (req, res) => {
  const budgetId = req.params.id;
  try {
    const deletedBudget = await Budget.findOneAndDelete({ _id: budgetId, userId: req.userId });
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete budget' });
  }
});

module.exports = router;
