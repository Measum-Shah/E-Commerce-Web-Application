import { body } from "express-validator";

export const contactFormValidator = [
  body("fullName")
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters")
    .trim(),
  
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .normalizeEmail(),
  
  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[0-9+\-\s]{10,15}$/).withMessage("Please enter a valid phone number")
    .trim(),
  
  body("subject")
    .notEmpty().withMessage("Subject is required")
    .isLength({ min: 3, max: 200 }).withMessage("Subject must be between 3 and 200 characters")
    .trim(),
  
  body("message")
    .notEmpty().withMessage("Message is required")
    .isLength({ min: 5, max: 5000 }).withMessage("Message must be between 5 and 5000 characters")
    .trim()
];

export const contactStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["pending", "read", "replied", "spam"]).withMessage("Invalid status value")
];

export const contactReplyValidator = [
  body("replyMessage")
    .notEmpty().withMessage("Reply message is required")
    .isLength({ min: 1, max: 5000 }).withMessage("Reply message cannot exceed 5000 characters")
    .trim()
];