const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Batiment_Types",
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
          isIn: [
            ["Muraille", "Tourelle", "Ferme", "Forge", "Hospital", "Mine"],
          ],
        },
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
