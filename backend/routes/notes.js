const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all notes for the authenticated user
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term too long'),
  query('category').optional().isIn(['personal', 'work', 'ideas', 'todo', 'other']).withMessage('Invalid category'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  query('completed').optional().isBoolean().withMessage('Completed must be true or false')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { user: req.user._id };
    
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.completed !== undefined) filter.isCompleted = req.query.completed === 'true';
    
    // Add search functionality
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Get notes with pagination
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Note.countDocuments(filter);

    res.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching notes' });
  }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ note });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error fetching note' });
  }
});

// Create new note
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),
  body('category').optional().isIn(['personal', 'work', 'ideas', 'todo', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 20 }).withMessage('Each tag must be 20 characters or less'),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be true or false')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const noteData = {
      ...req.body,
      user: req.user._id
    };

    const note = new Note(noteData);
    await note.save();

    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating note' });
  }
});

// Update note
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('content').optional().trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be between 1 and 5000 characters'),
  body('category').optional().isIn(['personal', 'work', 'ideas', 'todo', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 20 }).withMessage('Each tag must be 20 characters or less'),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be true or false')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error updating note' });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).json({ message: 'Server error deleting note' });
  }
});

module.exports = router;