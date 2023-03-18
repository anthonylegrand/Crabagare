module.exports = (sequelize) => {
  const { Villages, Crabes } = sequelize.models;

  Villages.hasMany(Crabes);
  Crabes.belongsTo(Villages);
};
