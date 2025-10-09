const mongoose = require('mongoose');

const subdomainSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  subdomain: {
    type: String,
    required: [true, 'Il sottodominio è obbligatorio'],
    trim: true,
    lowercase: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  discoveryDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indice per evitare duplicati e ricerca veloce
subdomainSchema.index({ projectId: 1, subdomain: 1 }, { unique: true });

module.exports = mongoose.model('Subdomain', subdomainSchema);