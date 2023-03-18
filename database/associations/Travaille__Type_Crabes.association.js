module.exports = (sequelize) => {
  const { Travaille_Types, Crabes } = sequelize.models;

  Travaille_Types.hasMany(Crabes);
  Crabes.belongsTo(Travaille_Types);
};
