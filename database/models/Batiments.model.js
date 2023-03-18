const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Batiments",
    {
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
