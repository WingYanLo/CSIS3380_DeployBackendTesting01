require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemRouter = require('./routes/itemRouter');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// MongoDB connection state
let mongoConnectionPromise = null;

// Function to connect to MongoDB (only connect once)
async function connectToDatabase() {
    if (!mongoConnectionPromise) {
      console.log("Attempting to connect to MongoDB...");
      mongoConnectionPromise = mongoose.connect(process.env.MONGO_URI)
        .then(() => {
          console.log('Connected to MongoDB');
        })
        .catch((error) => {
          console.error('Failed to connect to MongoDB:', error.message);
          mongoConnectionPromise = null; // Reset connection state on failure
          throw error;
        });
    }
    return mongoConnectionPromise;
  }
  

// Force MongoDB connection on server startup
connectToDatabase().catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if unable to connect to MongoDB
});

// Routes
app.use('/api/items', itemRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
