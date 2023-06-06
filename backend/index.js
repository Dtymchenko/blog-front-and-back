// Adding "type": "module", to package.json to use imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import { registerValidation, loginValidation } from "./validations/auth.js"; // .js in the end is necessary!!!
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { getMe, login, register } from "./controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
  getTags,
} from "./controllers/PostController.js";
import { createValidation } from "./validations/post.js";

dotenv.config();

const CONNECT_DB_LINK = process.env.DB_CONNECTION_STRING;

mongoose
  .connect(CONNECT_DB_LINK)
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    const date = new Date().toISOString().replace(/:/g, "-");
    const filename = `${date}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// allow to read json in request
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getMe);

app.get("/posts", getAll);
app.get("/tags", getTags);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, createValidation, handleValidationErrors, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch(
  "/posts/:id",
  checkAuth,
  createValidation,
  handleValidationErrors,
  update
);

app.post(
  "/upload",
  checkAuth,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A multer error occurred during the file upload
        return res
          .status(400)
          .json({ message: "File upload error", error: err });
      } else if (err) {
        // An unknown error occurred
        return res
          .status(500)
          .json({ message: "Internal server error", error: err });
      }
      // No errors occurred, continue to the next middleware
      next();
    });
  },
  (req, res) => {
    res.json({
      url: `/uploads/${req.file.filename}`,
    });
  }
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
