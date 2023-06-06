import { body } from "express-validator";

export const createValidation = [
  body("title", "Enter article title").isLength({ min: 3 }).isString(),
  body("text", "Enter article text").isLength({ min: 10 }).isString(),
  body("tags", "wrong tags format (expected array)").optional().isArray(),
  body("imageUrl", "wrong URL").optional().isString(),
];