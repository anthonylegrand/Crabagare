module.exports = (sequelize) => {
  const { Pictures, Crabes } = sequelize.models;

  Pictures.hasMany(Crabes);
  Crabes.belongsTo(Pictures);
};
