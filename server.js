const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const path = require('path');
const Booking = require('./models/Booking');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://husitah13_db_user:bEXkxy2S4oYVL372@cluster0.mfbsk7e.mongodb.net/test?appName=Cluster0';

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
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
    const booking = new Booking({ name, company, phone });
    await booking.save();
    res.json({ success: true, id: booking._id });
  } catch (error) {
    console.error('Booking save error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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

// Get All Bookings (Public as requested)
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
