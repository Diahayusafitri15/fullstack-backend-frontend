const pool = require('../config/db');

exports.createUser = (email, password) => {
    return pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [email, password]
    );
};

exports.findByEmail = (email) => {
    return pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
};

exports.saveRefreshToken = (token, id) => {
    return pool.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [token, id]
    );
};

exports.findByRefreshToken = (token) => {
    return pool.query(
        'SELECT * FROM users WHERE refresh_token = $1',
        [token]
    );
};