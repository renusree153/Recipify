/**
 * Name: Renusree Chittella & Theodore Sakamoto
 * Date: June 6th 2023
 * This is out app.js file which contains server side code
 * for making requests to different endpoints to query our
 * database and retrieve information about recipes, groceries,
 * and the reviews and ratings for each recipe.
 */

"use strict";

const sqlite3 = require("sqlite3");
const express = require("express");
const app = express();

const sqlite = require("sqlite");
const multer = require("multer");
const SERVER_STATUS = 500;
const DEFAULT_PORT = 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * This is our getDBConnection function which establishes
 * a connection with our SQL database in order to query
 * and retrieve information about it later on.
 * @returns {db} - db returns a db object which
 * represents the database that is going to be queried.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'website.db',
    driver: sqlite3.Database
  });
  return db;
}

/**
 * This is our /checkUser endpoint which takes in two
 * body parameters from the POST request, username and password
 * and then retrieves the user whose credentials match those
 * that are passed in. If there is an error on the server
 * side an error is thrown and the status is set to 500.
 */
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

/**
 * This is our /addUser endpoint which takes in the
 * username and password from the request body and
 * adds the given user's credentials into the database.
 * If the username already exists in the database, an error
 * is thrown and an error is also thrown if there is an
 * issue with the server side.
 */
app.post('/addUser', async (req, res) => {
  try {
    let user = req.body.username;
    let pass = req.body.password;
    let email = req.body.email;
    let db = await getDBConnection();
    let existingUser = await db.get('SELECT * FROM users WHERE username = ?', [user]);
    if (existingUser) {
      res.json({error: "Username already exists"});
    }
    const query2 = "INSERT INTO users (username, password, email)" +
    " VALUES (?, ?, ?)";
    db.run(query2, [user, pass, email]);
    let users = await db.all("SELECT * FROM users");
    db.close();
    res.json(users);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error");
  }
});

/**
 * This is our /getFoodItems endpoint which
 * retrieves all the groceries from our database
 * and then returns them to the user. If there is an
 * error on the server side, an error is thrown.
 */

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

/**
 * This is our /getRecipes endpoint which gets the
 * grocery item's name from the request body's parameter
 * and retreives all the recipes that can be made with
 * the given grocery item back to the user. If
 * there is an error on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /insertRating endpoint which retrives
 * the recipeName and ratingData from the user and inserts
 * these values into the ratings table in our database.
 * If there is an error on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /getAvgRating endpoint which gets the
 * recipe name from the user's POST request and retrieves
 * the rating values for the given recipe. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /getItemInfo endpoint which gets the item's
 * name from the user's POST request and retrieves all the
 * groceries where the name of the item is equal to
 * what the user passed in. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /getPrice endpoint which gets the item's
 * name from the user's POST request and displays the price
 * of the given item's name.If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
app.post("/getPrice", async (req, res) => {
  try {
    let db = await getDBConnection();
    let item = req.body.item;
    let query = "SELECT price FROM groceries WHERE name = ?";
    let results = await db.all(query, [item]);
    db.close();
    res.json(results);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

/**
 * This is our /addToCart endpoint which retrieves the
 * item's name and id from the user's POST request
 * and inserts into the cart table the given item name
 * and id. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */

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

/**
 * This is our /getReviews endpoint which retrives
 * the recipe's name from the user's POST request body
 * and returns the review for the given recipe back
 * to the user. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /allRecipes endpoint which
 * returns all distinct recipe names that are
 * present in the database. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
app.get("/allRecipes", async (req, res) => {
  try {
    let db = await getDBConnection();
    let recipes = await db.all("SELECT DISTINCT name FROM ratings");
    res.json(recipes);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

/**
 * This is our /addReview endpoint which retrieves
 * the recipe name, review, and rating from the user's
 * POST request body and inserts that into the reviews table
 * for the given recipe. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /purchase endpoint which
 * takes an item from the cart and adds it
 * onto the purchased list of items. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
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

app.post('/purchaseID', async (req, res) => {
  try {
    let user = req.body.user;
    console.log(user);
    let db = await getDBConnection();
    let queryDate = "SELECT date FROM purchases WHERE user = ? ORDER BY date DESC";
    let date = await db.get(queryDate, [user]);
    console.log(date);
    let purchaseID = createID(date.date, user);
    let queryAdd = "INSERT INTO purchaseInfo (purchaseID, user, date) VALUES (?, ?, ?)";
    db.run(queryAdd, [purchaseID, user, date.date]);
    db.close();
  } catch (err) {
    res.status(500).send("Server error, please try again later");
  }
})

function createID(recent, user) {
  let calendar = recent.substring(0, recent.indexOf(' '));
  let clock = recent.substring(recent.indexOf(' ') + 1);
  let year = calendar.substring(0, calendar.indexOf('-'));
  let month = calendar.substring(calendar.indexOf('-') + 1, calendar.lastIndexOf('-'));
  let day = calendar.substring(calendar.lastIndexOf('-') + 1);
  let hour = clock.substring(0, clock.indexOf(':'));
  let min = clock.substring(clock.indexOf(':') + 1, clock.lastIndexOf(':'));
  let sec = clock.substring(clock.lastIndexOf(':') + 1);
  let purchaseID = year + month + day + hour + min + sec + user + Math.floor(Math.random() * 10).toString();
  return purchaseID;
}

app.post('/checkAvailableSingle', async (req, res) => {
  try{
    let id = req.body.id;
    let inStock = true;
    let db = await getDBConnection();
    let query = "SELECT name FROM cart WHERE id = ?";
    let item = await db.get(query, [id]);
    let name = item.name;
    let stock = await db.get("SELECT stock FROM groceries WHERE name = ?", [name]);
    if (stock.stock <= 0) {
      inStock = false;
    }
    res.json(inStock);
    db.close();
  } catch (error) {
    console.error;
  }
})

app.post('/checkAvailable', async (req, res) => {
  try {
    let inStock = true;
    let user = req.body.user;
    let db = await getDBConnection();
    let query = "SELECT name FROM cart WHERE user = ?"
    let items = await db.all(query, [user]);
    for (const element of items) {
      let query2 = "SELECT stock FROM groceries WHERE name = ?";
      let stock = await db.get(query2, [element.name]);
      if (stock.stock <= 0) {
        inStock = false;
      }
    }
    db.close();
    console.log(inStock);
    res.send(inStock);
  } catch(err) {
    res.status(500).send("Server error, please try again later");
  }
})

/**
 * This is our /remove endpoint which
 * removes a given recipe of retrieved id
 * from the carts table. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
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

/**
 * This is our /checkout endpoint which retrieves
 * the user's name from the user's POST body request
 * and then gets all items from the cart where the user's
 * name is equal to the given user. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
app.post('/checkout', async (req, res) => {
  try {
    let user = req.body.user;
    let query = "SELECT * FROM cart WHERE user = ?";
    let db = await getDBConnection();
    let all = await db.all(query, [user]);
    res.json(all);
  } catch (err) {
    res.status(SERVER_STATUS).send("Server error, please try again later");
  }
});

/**
 * This is our /getPurchases endpoint which gets the
 * user's name through the user's POST request body and
 * returns the corresponding purchases that the user has made
 * in the past. If there is an error
 * on the server side, an error
 * message is displayed to the user.
 */
app.post("/getPurchases", async (req, res) => {
  let userName = req.body.name;
  let db = await getDBConnection();
  let query = "SELECT * FROM purchaseInfo AS t JOIN purchases AS p ON t.user = p.user WHERE t.user = ?";
  let all = await db.all(query, [userName]);
  db.close();
  res.json(all);
});

app.use(express.static("public"));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);