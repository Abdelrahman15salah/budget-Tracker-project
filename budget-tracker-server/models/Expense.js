
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: '' },
  date: { type: Date, default: Date.now }, 
  isRecurring: { type: Boolean, default: false}
});

module.exports = mongoose.model('Expense', ExpenseSchema);
