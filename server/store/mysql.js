const mysql = require('mysql');

const config = require('../config/index.js');

const dbConfig = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let connection;

function handleConnection() {

    console.log(`dbConfig`, dbConfig);
    if (dbConfig.password === undefined) {
        connection = mysql.createConnection(dbConfig);
    } else {
        connection = mysql.createConnection(dbConfig); // HEROKU OR OTHER DBCONFIG
    }

    connection.connect((err) => {
        if (err) {
            console.error(err);
            setTimeout(handleConnection, 2000);
        } else {
            console.log('DB Connected');
        }
    });

    connection.on('error', (err) => {
        console.error(err);
        if (err.code === 'Connection error') {
            handleConnection();
        } else {
            throw err;
        }
    });
}

handleConnection();

function getList(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if (err) return reject(err);

            resolve(data);
        });
    });
}

function getAllUsersFullData() {
    return new Promise((resolve, reject) => {
        connection.query(`
        SELECT
          u.user_id,
          u.user_name,
          u.user_email,
          u.user_description,
          d.department_id,
          d.department_name,
          wl.wish_name,
          wl.wish_id,
          wl.wish_price,
          wl.wish_image_url,
          wl.wish_description
        FROM
          users AS u
          JOIN departments AS d
          JOIN wish_list AS wl ON u.user_id = d.department_id`, (err, data) => {
            if (err) return reject(err);

            resolve(data);
        });
    });
}

function getById(query) {

    console.log(query)
    return new Promise((resolve, reject) => {
        connection.query(query, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function update(table, selection, data, id) {

    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE ${selection}_id = ${id}`, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}


module.exports = {
    getList,
    getById,
    getAllUsersFullData,
    update,
    insert,
}