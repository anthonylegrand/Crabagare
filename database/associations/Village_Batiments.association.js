module.exports = (sequelize) => {
  const { Villages, Batiments } = sequelize.models;

  Villages.hasMany(Batiments);
  Batiments.belongsTo(Villages);
};
