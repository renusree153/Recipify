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
    console.log(user);
    console.log(pass);
    let db = await getDBConnection();
    let existingUser = await db.get('SELECT * FROM users WHERE username = ?', [user]);
    if (existingUser) {
        res.json({error: "Username already exists"});
    }
    const query2 = "INSERT INTO users (username, password)" +
      " VALUES (?, ?)";
    db.run(query2, [user, pass]);
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

app.post('/getItemInfo', async (req, res) => {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT * FROM groceries WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    console.log(results);
    res.json(results);
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

app.post("/getRating", async (req, res) => {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT average FROM ratings WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    console.log(results);
})

app.post('/addToCart', async (req, res) => {
    let item = req.body.item;
    let user = req.body.id;
    let db = await getDBConnection();
    let query = "INSERT INTO cart (user, name) VALUES (?, ?)";
    let id = (await db.run(query, [user, item])).lastID;
    db.close();
    res.type('text');
    res.send(id.toString());
})

app.post('/checkCart', async (req, res) => {
    let user = req.body.user;
    let db = await getDBConnection();
    let query = "SELECT * FROM cart WHERE user = ?"
    let cartInfo = await db.all(query, [user]);
    db.close();
    res.json(cartInfo);
})

app.post("/getReviews", async(req, res) => {
    try {
        let db = await getDBConnection();
        let name = req.body.item;
        let query = "SELECT * FROM review WHERE recipe = ?"
        let results = await db.all(query, [name]);
        db.close();
        res.json(results);
    } catch (err) {
        console.error(err);
    }

})

app.get("/allRecipes", async(req, res) => {
    let db = await getDBConnection();
    let recipes = await db.all ("SELECT name FROM ratings");
    res.json(recipes);
})

app.post('/addReview', async (req, res) => {
    let recipeName = req.body.recipe;
    let reviewName = req.body.review;
    console.log(recipeName);
    console.log(reviewName);
    let ratingVal = req.body.rating;
    let db = await getDBConnection();
    const query = "INSERT INTO review (comment, recipe, rating)" +
      " VALUES (?, ?, ?)";
    db.run(query, [reviewName, recipeName, ratingVal]);
    let users = await db.all("SELECT * FROM review");
    db.close();
    console.log(users);
    res.json(users);
})

app.post('/purchase', async (req, res) => {
    let id = parseInt(req.body.id);
    let db = await getDBConnection();
    let query = "SELECT * FROM cart WHERE id = ?";
    let itemInfo = (await db.all(query, [id]))[0];
    console.log(itemInfo.user);
    db.run("DELETE FROM cart WHERE id = ?", [id]);
    let query2 = "INSERT INTO purchases (user, name) VALUES (?, ?)"
    db.run(query2, [itemInfo.user, itemInfo.name]);
    db.close();
})

app.post('/remove', async (req, res) => {
    let id = parseInt(req.body.id);
    let db = await getDBConnection();
    db.run("DELETE FROM cart WHERE id = ?", [id]);
    db.close();
})

app.post('/checkout', async (req, res) => {
    let user = req.body.user;
    let query = "SELECT * FROM cart WHERE user = ?";
    let db = await getDBConnection();
    let all = await db.all(query);

})

//change review to not have ratings column

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);