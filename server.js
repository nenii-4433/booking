const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Import Booking model
const Booking = require('./models/Booking');

// MongoDB Connection
let mongoURI = process.env.MONGODB_URI || 'mongodb+srv://husitah13_db_user:bEXkxy2S4oYVL372@cluster0.mfbsk7e.mongodb.net/test?appName=Cluster0';

// Trim whitespace only
mongoURI = mongoURI.trim();

// Diagnostic: Log URI stats (safe for production as it doesn't log the full string/password)
console.log(`URI Debug: Length=${mongoURI.length}, StartsWith=${mongoURI.substring(0, 10)}...`);

let isConnected = null; // Store the connection promise
const connectDB = async () => {
  if (isConnected) return isConnected;
  
  console.log('Initiating MongoDB connection...');
  isConnected = mongoose.connect(mongoURI);

  try {
    await isConnected;
    console.log('Successfully connected to MongoDB');
    return isConnected;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    isConnected = null; // Reset promise so next request can retry
    throw err;
  }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, company, phone } = req.body;
    
    // Validate input
    if (!name || !company || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const booking = new Booking({ name, company, phone });
    await booking.save();
    res.json({ success: true, id: booking._id });
  } catch (error) {
    console.error('Booking save error details:', {
      error: error,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      success: false, 
      message: 'Server Error during booking save', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

// Download PDF
app.get('/api/bookings/:id/pdf', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send('Booking not found');
    }

    const doc = new PDFDocument();
    let filename = `Booking_${booking.name}.pdf`;
    filename = encodeURIComponent(filename);
    
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(25).text('Booking Details', 100, 100);
    doc.fontSize(15).text(`Name: ${booking.name}`, 100, 150);
    doc.text(`Company: ${booking.company}`, 100, 180);
    doc.text(`Phone: ${booking.phone}`, 100, 210);
    doc.text(`Date: ${booking.createdAt.toDateString()}`, 100, 240);

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get All Bookings
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error in /api/admin/bookings:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;