module.exports = (sequelize) => {
  const { Utilisateurs, Crabes } = sequelize.models;

  Utilisateurs.hasMany(Crabes, { foreignKey: "Discord_id" });
  Crabes.belongsTo(Utilisateurs, { foreignKey: "Discord_id" });
};
