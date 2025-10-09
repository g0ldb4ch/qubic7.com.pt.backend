const mongoose = require('mongoose');

const techStackSchema = new mongoose.Schema({
  subdomainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subdomain',
    required: true
  },
  technology: {
    type: String,
    required: [true, 'Il nome della tecnologia è obbligatorio'],
    trim: true
  },
  version: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['server', 'framework', 'cms', 'library', 'database', 'language', 'cdn', 'analytics', 'other'],
    default: 'other'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indice per ricerca veloce
techStackSchema.index({ subdomainId: 1, technology: 1 });

module.exports = mongoose.model('TechStack', techStackSchema);