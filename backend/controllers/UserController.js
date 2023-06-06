import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(
      String(req.body.password),
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({
        message: "Wrong login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Did not manage to login",
    });
  }
};

export const register = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }
    const password = String(req.body.password);
    const salt = await bcrypt.genSalt(Number(10));
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not register",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "No access",
    });
  }
};
