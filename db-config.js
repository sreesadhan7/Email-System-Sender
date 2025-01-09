// Description: Oracle Database configuration

const oracledb = require('oracledb');
require('dotenv').config(); // Load environment variables

// Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectString: process.env.DB_CONNECT_STRING,
};

async function getConnection() {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('Connected to Oracle Database');
        return connection;
    } catch (err) {
        console.error('Error connecting to Oracle Database:', err);
        throw err;
    }
}

module.exports = { getConnection };