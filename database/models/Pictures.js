const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Pictures",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING(7),
        allowNull: false,
        unique: true,
        validate: {
          is: /^[A-Za-z0-9]{7}$/,
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
