require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemRouter = require('./routes/itemRouter');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,    // No longer required in recent versions but fine to keep
  useUnifiedTopology: true, // No longer required in recent versions but fine to keep
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/items', itemRouter);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
