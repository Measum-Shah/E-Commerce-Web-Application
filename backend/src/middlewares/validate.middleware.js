import { validationResult } from "express-validator";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((error) => ({
    field: error.path,
    message: error.msg
  }));

  return res.status(400).json({
    success: false,
    errors: extractedErrors
  });
};

export default validate;