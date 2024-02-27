const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  !process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD : null,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  }
);
sequelize.authenticate();

console.log("DB connection is working");

module.exports = sequelize;
