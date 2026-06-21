module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    boardingId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER },
    studentName: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }
  }, {
    tableName: 'bookings'
  });

  return Booking;
};
