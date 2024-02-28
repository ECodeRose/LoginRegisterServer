const { UniqueConstraintError } = require("sequelize");
const User = require("./model");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      // role === "ADMIN" ? "ADMIN" : "USER",
    });

    res.status(201).json({
      message: "user added",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.log(err);
    if (err instanceof UniqueConstraintError) {
      res.status(400).send({ error: "Username or email already exists" });
    } else {
      res.status(500).send({ error: "Internal server error" });
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: `all users`, users: users });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error });
  }
};
const userProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.user.username,
      },
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({ message: "user profile", user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, error: error });
  }
};
const login = async (req, res) => {
  try {
    // successfull login
    const token = jwt.sign(
      {
        username: req.body.username,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS256" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, error: error });
  }
};

const getOneUser = async (req, res) => {
  res.status(201).json({ message: "login success", user: req.user });
};

module.exports = {
  signupUser: signupUser,
  getAllUsers: getAllUsers,
  getOneUser: getOneUser,
  login: login,
  userProfile: userProfile,
};
