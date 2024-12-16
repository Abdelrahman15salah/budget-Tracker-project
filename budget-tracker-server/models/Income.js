const mongoose = require('mongoose');
const { Schema } = mongoose;

const incomeSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  source: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model('Income', incomeSchema);