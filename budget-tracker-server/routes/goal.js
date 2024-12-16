const express = require('express');
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/add', authMiddleware, async (req, res) => {
  const  name = req.body.name;
  const targetAmount = req.body.targetAmount;
  const deadline = req.body.deadline;

  if (!name || !targetAmount || !deadline) {
    return res.status(400).json({ message: 'Name, target amount, and deadline are required' });
  }

  try {
    const goal = new Goal({
      userId: req.user.userId,
      name,
      targetAmount,
      deadline,
    });

    await goal.save();
    res.status(201).json({ message: 'Goal added successfully', goal });
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (error) {
    console.error('Error retrieving goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/edit/:id', authMiddleware, async (req, res) => {
  const { name, targetAmount, deadline } = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { name, targetAmount, deadline },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal updated successfully', updatedGoal });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);

    if (!deletedGoal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/finish/:id', authMiddleware, async (req, res) => {
  const { transferToGoalId } = req.body;

  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.status === 'finished') {
      return res.status(400).json({ message: 'Goal is already finished' });
    }

    // Mark goal as finished
    goal.status = 'finished';
    const remainingFunds = goal.targetAmount - goal.currentAmount;
    goal.currentAmount = goal.targetAmount;
    await goal.save();

    // Distribute remaining funds to another goal
    if (transferToGoalId && remainingFunds > 0) {
      const transferGoal = await Goal.findById(transferToGoalId);

      if (!transferGoal) {
        return res.status(404).json({ message: 'Transfer goal not found' });
      }

      transferGoal.currentAmount += remainingFunds;
      await transferGoal.save();
    }

    res.json({ message: 'Goal finished successfully', goal });
  } catch (error) {
    console.error('Error finishing goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
