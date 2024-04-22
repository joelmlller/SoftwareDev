const mysql = require('mysql');
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const connection = mysql.createConnection({
        host: 'team29-database.cobd8enwsupz.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'ClemsonT29#2024',
        database: 'team29database'
    });

    const userAttributes = event.request.userAttributes;
    const userId = event.userName;
    const name = userAttributes.name || '';
    const email = userAttributes.email || '';
    const phoneNumber = userAttributes.phone_number || '';

    const sql = `INSERT INTO users (user_id, name, email, phone_number) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, email = ?, phone_number = ?`;

    return new Promise((resolve, reject) => {
        connection.query(sql, [userId, name, email, phoneNumber, name, email, phoneNumber], (error, results, fields) => {
            connection.end();

            if (error) {
                console.error('Error executing query:', error);
                reject(error);
            } else {
                console.log('User data inserted/updated successfully:', results);
                resolve(event);
            }
        });
    });
};

