const mysql = require("mysql")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "",
    database: "node_backend_ecm"
})


module.exports = db;