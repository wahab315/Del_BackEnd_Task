require("dotenv").config();
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const expiredAt = new Date(
    Date.now() + process.env.JWT_ACCESS_TIME * 24 * 60 * 60 * 1000
  );
  console.log(
    "🚀 ~ file: userController.js:22 ~ createSendToken ~ expiredAt:",
    expiredAt
  );
  const cookieOptions = {
    expires: expiredAt,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const output = savedUser.toJSON();
    delete output.password, output.__v;

    res.status(201).json({ status: "success", data: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", error: "Internal Server Error" });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  console.log(
    "🚀 ~ file: userController.js:81 ~ exports.login=catchAsync ~ username:",
    username
  );

  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }
  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 401));
  }
  console.log("🚀 🚀🚀🚀🚀🚀🚀");

  createSendToken(user, 200, res);
});
