module.exports = (sequelize) => {
  const { Batiment_Types, Batiments } = sequelize.models;

  Batiment_Types.hasMany(Batiments);
  Batiments.belongsTo(Batiment_Types);
};
