const express = require('express');
const router = express.Router();
const ItemModel = require('../models/item.model');

// Get all items
router.get('/', async (req, res) => {
    console.log('GET /api/items route hit');
    try {
        const items = await ItemModel.find();
        console.log('Items retrieved:', items);
        res.json(items);
    } catch (err) {
        console.error('Error fetching items:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Create a new item
router.post('/', async (req, res) => {
    const newItem = new ItemModel({
        itemName: req.body.itemName,
        bids: req.body.bids || []  // Initialize bids array from the request body, or default to an empty array
    });
    try {
        const savedItem = await newItem.save();
        console.log('New item created:', savedItem);
        res.json(savedItem);
    } catch (err) {
        console.error('Error creating item:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Update bids for an item
router.put('/:id/bid', async (req, res) => {
    try {
        const item = await ItemModel.findById(req.params.id);
        if (!item) {
            console.error('Item not found for updating bid:', req.params.id);
            return res.status(404).json({ error: 'Item not found' });
        }

        const newBid = {
            studentName: req.body.studentName,
            price: req.body.price
        };

        // Check if the new bid is the highest
        const highestBid = item.bids.reduce((max, bid) => bid.price > max.price ? bid : max, { price: 0 });

        if (newBid.price > highestBid.price) {
            item.bids.push(newBid);
            const updatedItem = await item.save();
            console.log('Bid added and item updated:', updatedItem);
            res.json(updatedItem);
        } else {
            console.error('Bid is not the highest:', newBid);
            res.status(400).json({ error: 'Bid is not the highest' });
        }
    } catch (err) {
        console.error('Error updating bid:', err.message);
        res.status(400).json({ error: err.message });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const item = await ItemModel.findByIdAndDelete(req.params.id);
        if (!item) {
            console.error('Item not found for deletion:', req.params.id);
            return res.status(404).json({ error: 'Item not found' });
        }
        console.log('Item deleted:', item);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('Error deleting item:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
