"use strict";

const sqlite3 = require("sqlite3");
const express  = require("express");
const app = express();

const sqlite = require("sqlite");
const multer = require("multer");

app.use(express.urlencoded({extended: true, }));
app.use(express.json());
app.use(multer().none());

async function getDBConnection() {
    const db = await sqlite.open({
        filename: 'website.db',
        driver: sqlite3.Database
    });
    return db;
}

app.post("/checkUser", async (req, res) => {
    try{
        let db = await getDBConnection();
        let user = req.body.username;
        let pass = req.body.password;
        console.log(user + "  " + pass);
        let query = "SELECT * FROM users WHERE username=? AND password=?;";
        let results = await db.all(query, [user, pass]);
        db.close();
        res.json(results);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

app.post('/addUser', async (req, res) => {
    let user = req.body.username;
    let pass = req.body.password;
    let db = await getDBConnection();
    const query = "INSERT INTO users (username, password)" +
      " VALUES (?, ?)";
    db.run(query, [user, pass]);
    let users = await db.all("SELECT * FROM users");
    db.close();
    res.json(users);
})

app.get('/log', async (req, res) => {
    console.log('hi there');
});

app.get("/getFoodItems", async (req,res) => {
    let db = await getDBConnection();
    let query = "SELECT * FROM groceries";
    let results = await db.all(query);
    db.close();
    res.json(results);
})

app.post("/getRecipes", async (req, res) => {
    let groceryItem = req.body.item;
    let db = await getDBConnection();
    let query = "SELECT * FROM groceryToRecipe WHERE name = ?";
    let results = await db.all(query, [groceryItem]);
    db.close();
    res.json(results);
})

app.post('/test', async (req, res) => {
    let test = req.body.test;
    let db = await getDBConnection();
    let query = ("SELECT * FROM cart");
    let all = await db.all(query);
    db.close();
    res.json(all);
})

app.post("/getPrice", async (req, res) => {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT price FROM groceries WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    console.log(results);
    res.json(results);
})

app.post("getRating", async (req, res) => {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT average FROM ratings WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    console.log(results);
})


app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);