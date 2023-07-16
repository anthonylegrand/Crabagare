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
      Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};
