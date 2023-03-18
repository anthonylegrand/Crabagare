const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Travaille_Types",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING(40),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [["Soigneur", "Constructeur", "Cuisinier", "Mineur"]],
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
