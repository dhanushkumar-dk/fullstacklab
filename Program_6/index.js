const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.use(bodyParser.urlencoded({
    'extended': true
}));
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'D@2002dk',
    database: 'person' // after creation of DB we can use the name here
});
function createDB() {
    connection.query("CREATE DATABASE Person", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
}
function createTable() {
    connection.query("CREATE TABLE users(NAME VARCHAR(20), AGE INT )", function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });
}
connection.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connected");
    }
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/insert", (req, res) => {
    const data = req.body;
    let sql = `INSERT INTO USERS VALUES( '${data.name}',${data.age})`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.redirect("/");
});
app.post("/read", (req, res) => {
    const data = req.body;
    let sql = `SELECT * FROM USERS WHERE NAME='${data.name}'`;
    connection.query(sql, (err, rows, col) => {
        if (err) {
            res.write(err);
        }
        else {
            let r = JSON.stringify(rows);
            res.write(r);
        }
        res.send();
    })
})
app.post("/update", (req, res) => {
    const data = req.body;
    let sql = `UPDATE USERS SET NAME="${data.upname}", age= '${data.upage}' WHERE NAME = '${data.name}'`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record modified");
    });
    res.redirect("/");
})
app.post("/delete", (req, res) => {
    const data = req.body;
    let sql = `DELETE FROM USERS WHERE NAME='${data.name}'`;
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record deleted");
    });
    res.redirect("/");
});
app.listen(5000, () => {
    console.log("Server Listening in port 3000");
})
