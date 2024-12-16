const express = require('express');
const Income = require('../models/Income');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Add Income
router.post('/add', authMiddleware, async (req, res) => {
    const { source, amount , date } = req.body;

    if (!source || !amount ) {
        return res.status(400).json({ message: 'Source, amount are required' });
    }

    try {
        const income = new Income({
            userId: req.user.userId,
            source,
            amount,
            date,
        });

        await income.save();
        res.status(201).json({ message: 'Income added successfully', income });
    } catch (error) {
        console.error('Error adding income:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Income
router.get('/', authMiddleware, async (req, res) => {
    try {
        const income = await Income.find({ userId: req.user.userId });
        res.json(income);
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit Income
router.put('/edit/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { source, amount, date } = req.body;

    try {
        const income = await Income.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            { source, amount, date },
            { new: true } // Return the updated document
        );

        if (!income) {
            return res.status(404).json({ message: 'Income entry not found' });
        }

        res.json({ message: 'Income updated successfully', income });
    } catch (error) {
        console.error('Error updating income:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Income
router.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const income = await Income.findOneAndDelete({ _id: id, userId: req.user.userId });

        if (!income) {
            return res.status(404).json({ message: 'Income entry not found' });
        }

        res.json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
