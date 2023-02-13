var mysql = require('mysql');

const con = mysql.createConnection ({
    host:'localhost',
    user:'root',
    password:'',
    database:'banking'

});

module.exports = con;

