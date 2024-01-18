const { Sequelize } = require('sequelize');
require('dotenv').config()

const password = process.env.DB_PASSWORD || null

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, password, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: '+07:00',
   
});

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default connectDatabase