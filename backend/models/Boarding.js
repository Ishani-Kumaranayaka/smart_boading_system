module.exports = (sequelize, DataTypes) => {
  const Boarding = sequelize.define('Boarding', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    distance: { type: DataTypes.FLOAT },
    girlsOnly: { type: DataTypes.BOOLEAN, defaultValue: false },
    facilities: { type: DataTypes.JSON },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    safetyScore: { type: DataTypes.FLOAT },
    rating: { type: DataTypes.FLOAT },
    reviews: { type: DataTypes.INTEGER },
    image: { type: DataTypes.STRING },
    lat: { type: DataTypes.FLOAT },
    lng: { type: DataTypes.FLOAT }
  }, {
    tableName: 'boardings'
  });

  return Boarding;
};
