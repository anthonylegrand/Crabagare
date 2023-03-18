require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("pg");

const sequelize = new Sequelize(
  process.env.DATABASE_DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DIALECT,
    logging: false,
  }
);

["models", "associations", "pivots"].map((paths) => {
  const fullPath = path.join(__dirname, paths);
  fs.readdirSync(fullPath).map((file) => {
    require(path.join(fullPath, file))(sequelize);
  });
});

require("./initialise")(sequelize);

module.exports = sequelize;
