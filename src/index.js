// dependencies
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./users/routes");
const User = require("./users/model");
app.use(express.json());
app.use(cors());

app.use(userRouter);

const syncTables = () => {
  User.sync();
};
// Run the server
app.listen(3002, () => {
  syncTables();
  console.log("Server is running on port 3002.");
});
