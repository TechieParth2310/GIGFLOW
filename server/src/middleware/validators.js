import { body } from 'express-validator';

// Auth validation rules
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['client', 'freelancer'])
    .withMessage('Role must be either "client" or "freelancer"')
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Gig validation rules
export const validateCreateGig = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('budget')
    .isFloat({ min: 1 })
    .withMessage('Budget must be a number greater than 0')
    .toFloat()
];

// Bid validation rules
export const validateCreateBid = [
  body('gigId')
    .notEmpty()
    .withMessage('Gig ID is required')
    .isMongoId()
    .withMessage('Invalid gig ID format'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('price')
    .isFloat({ min: 1 })
    .withMessage('Price must be a number greater than 0')
    .toFloat()
];
