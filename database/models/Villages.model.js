const { literal, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Villages",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discord_serveur_id: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
          is: /^[0-9]{16,25}$/,
        },
      },
      nom: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[A-Za-z0-9 ]{3,20}$/,
        },
      },
      coquillage: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        allowNull: false,
        validate: {
          min: 0,
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
      adoption_cmd: {
        type: "TIMESTAMP",
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
