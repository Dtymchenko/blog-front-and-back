import { body } from "express-validator";

export const loginValidation = [
  body("email", "invalid email format").isEmail(),
  body("password", "password length should be at least 5").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "invalid email format").isEmail(),
  body("password", "password length should be at least 5").isLength({ min: 5 }),
  body("fullName", "full name length should be at least 3").isLength({
    min: 3,
  }),
  body("avatarUrl", "invalid avatar URL").optional().isURL(),
];
