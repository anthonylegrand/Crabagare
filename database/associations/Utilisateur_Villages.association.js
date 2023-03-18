module.exports = (sequelize) => {
  const { Utilisateurs, Villages } = sequelize.models;

  Utilisateurs.hasMany(Villages);
  Villages.belongsTo(Utilisateurs);
};
