const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    // res.send("Webserver is listening");
    res.send(process.env.DB_USER);
});

app.get("/signup", cors(), async (req, res) => {
    const { user, password, fullname, email, phonenumber } = req.query;
    let created = false;
    try {
        console.log("working");
        const connection = await mysql.createConnection({
            host: "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: "paw"
        });

        const sql = `INSERT INTO users(user, pass, email, fullname, phonenumber) VALUES ('${user}', '${password}', '${email}', '${fullname}', '${phonenumber}')`;
        const [rows, fields] = await connection.query(sql);
        created = true;
    } catch (err) {
        console.log(err);
    }
    res.status(200).jsonp({
        success: created,
        message: "User has been added successfully!"
    });
});

app.get('/authentication', cors(), async (req, res) => {
    const { user, password } = req.query;
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: "paw"
        });

        const sql = `SELECT * FROM users WHERE username=${user}`;
        const [rows, fields] = await connection.query({
            sql,
            rowsAsArray: true
        });
        if (rows.length > 0) {
            if (rows[0].password === password) {
                res.status(200).json({
                    success: true,
                    message: "Authentication Successful!"
                })
            } else {
                res.status(200).json({
                    error: "Password was incorrect!",
                    success: false,
                })
            }
        } else {
            res.status(200).json({
                error: "User does not exists in the database",
                success: false,
            });
        }
    } catch (err) {
        res.status(400).json({
            message: "There were some failures"
        });
    }
})

app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
})