"use strict";

const sqlite3 = require("sqlite3");
const express = require("express");
const app = express();

const sqlite = require("sqlite");
const multer = require("multer");
const SERVER_STATUS = 500;

app.use(express.urlencoded({extended: true}));
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
  try {
    let db = await getDBConnection();
    let user = req.body.username;
    let pass = req.body.password;
    let query = "SELECT * FROM users WHERE username=? AND password=?;";
    let results = await db.all(query, [user, pass]);
    db.close();
    res.json(results);
  } catch (error) {
    res.status(SERVER_STATUS).send("Server error");
  }
});

app.post('/addUser', async (req, res) => {
  try {
    let user = req.body.username;
    let pass = req.body.password;
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
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error");
  }
});

app.get('/log', async (req, res) => {
    console.log('hi there');
});

app.get("/getFoodItems", async (req, res) => {
  try {
    let db = await getDBConnection();
    let query = "SELECT * FROM groceries";
    let results = await db.all(query);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/getRecipes", async (req, res) => {
  try {
    let groceryItem = req.body.item;
    let db = await getDBConnection();
    let query = "SELECT * FROM groceryToRecipe WHERE name = ?";
    let results = await db.all(query, [groceryItem]);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/insertRating", async (req, res) => {
  try {
    let recipeName = req.body.name;
    let ratingData = req.body.rate;
    let db = await getDBConnection();
    let query = "INSERT INTO ratings (name, rating) VALUES (?, ?)";
    let result = (await db.run(query, [recipeName, ratingData]));
    db.close();
    res.json({msg: result});
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/getAvgRating", async (req, res) => {
  try {
    let item = req.body.recipe;
    let db = await getDBConnection();
    let query = "SELECT rating FROM ratings WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/getItemInfo', async (req, res) => {
  try {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT * FROM groceries WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/getPrice", async (req, res) => {
  try {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT price FROM groceries WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    res.json(results);
  } catch(err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/getRating", async (req, res) => {
  try {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT average FROM ratings WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    res.json(results);
  } catch(err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/addToCart', async (req, res) => {
  try {
    let item = req.body.item;
    let user = req.body.id;
    let db = await getDBConnection();
    let query = "INSERT INTO cart (user, name) VALUES (?, ?)";
    let id = (await db.run(query, [user, item])).lastID;
    db.close();
    res.type('text');
    res.send(id.toString());
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/checkCart', async (req, res) => {
  try {
    let user = req.body.user;
    let db = await getDBConnection();
    let query = "SELECT * FROM cart WHERE user = ?";
    let cartInfo = await db.all(query, [user]);
    db.close();
    res.json(cartInfo);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/getReviews", async (req, res) => {
  try {
    let db = await getDBConnection();
    let name = req.body.item;
    let query = "SELECT * FROM review WHERE recipe = ?";
    let results = await db.all(query, [name]);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.get("/allRecipes", async (req, res) => {
  try {
    let db = await getDBConnection();
    let recipes = await db.all("SELECT DISTINCT name FROM ratings");
    res.json(recipes);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/addReview', async (req, res) => {
  try {
    let recipeName = req.body.recipe;
    let reviewName = req.body.review;
    let ratingVal = req.body.rating;
    let db = await getDBConnection();
    const query = "INSERT INTO review (comment, recipe, rating)" +
      " VALUES (?, ?, ?)";
    db.run(query, [reviewName, recipeName, ratingVal]);
    let users = await db.all("SELECT * FROM review");
    db.close();
    res.json(users);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/purchase', async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let db = await getDBConnection();
    let query = "SELECT * FROM cart WHERE id = ?";
    let itemInfo = (await db.all(query, [id]))[0];
    db.run("DELETE FROM cart WHERE id = ?", [id]);
    let query2 = "INSERT INTO purchases (user, name) VALUES (?, ?)";
    db.run(query2, [itemInfo.user, itemInfo.name]);
    db.close();
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/remove', async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let db = await getDBConnection();
    db.run("DELETE FROM cart WHERE id = ?", [id]);
    db.close();
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post('/checkout', async (req, res) => {
  try {
    let user = req.body.user;
    let query = "SELECT * FROM cart WHERE user = ?";
    let db = await getDBConnection();
    let all = await db.all(query);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

app.post("/getPurchases", async(req, res) => {
  let userName = req.body.name;
  let db = await getDBConnection();
    //let query = "SELECT * FROM purchases WHERE user = ?";
    //let all = await db.all(query, userName);
  let query = "SELECT * FROM purchaseInfo AS t JOIN purchases AS p ON t.user = p.user WHERE t.user = ?";
  let all = await db.all(query, [userName]);
  db.close();
  res.json(all);
});

//change review to not have ratings column

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);