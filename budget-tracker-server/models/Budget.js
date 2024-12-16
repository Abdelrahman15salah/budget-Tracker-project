const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Links to the user
    month: { type: String, required: true }, // e.g., "January 2024"
    categories: [
        {
            name: { type: String, required: true }, // e.g., "Food", "Rent"
            limit: { type: Number, required: true } // Budget limit for this category
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetSchema);
