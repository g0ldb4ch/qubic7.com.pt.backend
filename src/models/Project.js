const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome del progetto è obbligatorio'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Il dominio è obbligatorio'],
    trim: true,
    lowercase: true
  },
  client: {
    type: String,
    required: [true, 'Il nome del cliente è obbligatorio'],
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'archived'],
    default: 'in-progress'
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indice per ricerca veloce
projectSchema.index({ domain: 1, client: 1 });

module.exports = mongoose.model('Project', projectSchema);