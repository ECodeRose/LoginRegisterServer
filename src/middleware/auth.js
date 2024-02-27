const bcrypt = require("bcrypt");

const User = require("../users/model");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

const jwt = require("jsonwebtoken");
const hashPass = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);

    next();
  } catch (error) {
    res.status(501).json({ message: error.message, error: error });
  }
};

const comparePass = async (req, res, next) => {
  try {
    // https://www.npmjs.com/package/bcrypt

    //compare passwords
    // what we will need;
    // plain text password (e.g. 'mypassword123) & the hashed password on the DB
    // how do we get plain text password? send it in the request body
    // how do we get the hashed password? find the user
    // How do we find the user? by the username - sent in the request body
    // we've found the user - then, use bcrypt to compare.
    // const matched = use bcrypt.compare(plaintext, hashed password)
    //or
    // req.matched = use bcrypt.compare(plaintext, hashed password) (harder way)
    // if matched false - response with code from unauthorised
    const plainTextPassword = req.body.password;

    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) {
      res.faveshow = "bottom";
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const matched = await bcrypt.compare(
      plainTextPassword,

      user.dataValues.password
    );

    if (!matched) {
      res.faveshow = "bottom";
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.user = user.dataValues;
    next();
  } catch (error) {
    console.log(error);
    res.faveshow = "bottom";
    res.status(401).json({ message: error.message, error: error });
  }
};

// const emailValidation = async (req, res, next) => {
//   // validate email
//   next();
// };

// const passwordValdation = async (req, res, next) => {
//   // validate password
//   next();
// };

// const login = async (req, res, next) => {
const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers["authorization"];
    if (auth && auth.startsWith("Bearer")) {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);

    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = async (req, res, next) => {
  if (req.user.role === "ADMIN") {
    next();
  } else {
    res.status(404).json({ message: "not found" });
  }
};

module.exports = {
  hashPass: hashPass,
  comparePass: comparePass,
  verifyToken: verifyToken,
  adminOnly: adminOnly,
  // emailValidation: emailValidation,
  // passwordValdation: passwordValdation,
};
