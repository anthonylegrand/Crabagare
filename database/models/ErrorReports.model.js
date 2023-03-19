const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "ErrorsReport",
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
      source: {
        type: DataTypes.STRING(25),
        allowNull: false,
      },
      errorMessage: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      error: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      updatedAt: false,
      freezeTableName: true,
    }
  );
};
