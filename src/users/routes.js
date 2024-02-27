const { Router } = require("express");
const userRouter = Router();

const User = require("./model");

const {
  hashPass,
  comparePass,
  // emailValidation,
  // passwordValdation,
  verifyToken,
  adminOnly,
} = require("../middleware/auth");

const {
  signupUser,
  getAllUsers,
  getOneUser,
  login,
  userProfile,
} = require("./controllers");

// add user
userRouter.post("/register", hashPass, signupUser);

userRouter.post("/login", comparePass, login);

userRouter.get("/users/profile", verifyToken, userProfile);
// get all users
userRouter.get("/users", verifyToken, adminOnly, getAllUsers);

// get one user
userRouter.get("/users/:username", getOneUser);

// update user details

// delete a single user

module.exports = userRouter;
