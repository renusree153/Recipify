"use strict";

const sqlite3 = require("sqlite3");
const express  = require("express");
const app = express();

const sqlite = require("sqlite");
const multer = require("multer");

app.use(express.urlencoded({extended: true, }));
app.use(express.json());

async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'website.db',
        driver: sqlite3.Database
    });
    return db;
}

app.get("/checkUser", async (req, res) => {
    let db = await getDBConnection();
    let username = req.query.username;
    console.log(username);
    let password = req.query.password;
    console.log(password);
    let query = ("SELECT * FROM users");
    let results = await db.all(query);
    console.log(results);
})
app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);