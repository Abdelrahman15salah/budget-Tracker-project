const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  income: {
    type: Number,
    default: 6969,
  },
  expenses: {
    type: Number,
    default: 6969,
  },
  savingsGoal: {
    type: Number,
    default: 6969,
  },
 
});

module.exports = mongoose.model('User', userSchema);
