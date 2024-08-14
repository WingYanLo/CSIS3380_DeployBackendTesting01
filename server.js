require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemRouter = require('./routes/itemRouter');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Persistent MongoDB Connection Setup
let isConnected = false; // Track the connection state

async function connectToDatabase() {
  if (isConnected) {
    return; // If already connected, skip reconnection
  }
  
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    isConnected = db.connections[0].readyState; // Set the connection state to "connected"
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; // Re-throw the error to prevent further execution if connection fails
  }
}

// Apply the database connection before any routes are executed
app.use(async (req, res, next) => {
  await connectToDatabase(); // Ensure the database is connected
  next(); // Proceed to the next middleware/route
});

// Routes
app.use('/api/items', itemRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
