const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Importa routes
const projectRoutes = require('./routes/projects');
const subdomainRoutes = require('./routes/subdomains');
const techstackRoutes = require('./routes/techstacks');
const vulnerabilityRoutes = require('./routes/vulnerabilities');

// Connetti al database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/subdomains', subdomainRoutes);
app.use('/api/techstacks', techstackRoutes);
app.use('/api/vulnerabilities', vulnerabilityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date()
  });
});

// Error handler (deve essere l'ultimo middleware)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trovata'
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server in esecuzione in modalità ${process.env.NODE_ENV} sulla porta ${PORT}`);
});

// Gestione errori non gestiti
process.on('unhandledRejection', (err, promise) => {
  console.log(`Errore: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;