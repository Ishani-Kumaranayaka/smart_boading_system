const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_NAME = process.env.DB_NAME || 'campusstay';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

const db = { sequelize, Sequelize };

// Import models
db.Boarding = require('./models/Boarding')(sequelize, Sequelize.DataTypes);
db.User = require('./models/User')(sequelize, Sequelize.DataTypes);
db.Booking = require('./models/Booking')(sequelize, Sequelize.DataTypes);

// Associations
db.User.hasMany(db.Booking, { foreignKey: 'userId' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
