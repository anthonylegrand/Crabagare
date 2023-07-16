const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Crabes",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[A-Za-z0-9]{3,20}$/,
        },
      },
      niveau: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
