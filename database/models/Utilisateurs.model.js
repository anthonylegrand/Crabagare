const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Utilisateurs",
    {
      Discord_id: {
        type: DataTypes.STRING(25),
        primaryKey: true,
        allowNull: false,
        validate: {
          is: /^[0-9]{16,25}$/,
        },
      },
      pinces: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
