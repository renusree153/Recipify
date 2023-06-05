CREATE TABLE "cart" (
	"id"	INTEGER,
	"user"	TEXT,
	"name"	TEXT,
	"date"	DATETIME DEFAULT (datetime('now','localtime')),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user") REFERENCES "users"("username")
)

CREATE TABLE "groceries" (
	"name"	TEXT NOT NULL,
	"price"	REAL NOT NULL,
	"vegan"	INTEGER NOT NULL,
	"vegetarian"	INTEGER NOT NULL,
	"stock"	INTEGER DEFAULT 1,
	PRIMARY KEY("name")
)

CREATE TABLE "groceryToRecipe" (
	"name"	TEXT,
	"recipe"	TEXT,
	FOREIGN KEY("recipe") REFERENCES "ratings"("name"),
	FOREIGN KEY("name") REFERENCES "groceries"("name")
)

CREATE TABLE "purchases" (
	"id"	INTEGER,
	"user"	TEXT,
	"name"	TEXT,
	"date"	DATETIME DEFAULT (datetime('now','localtime')),
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY(user) REFERENCES users(username)
)

CREATE TABLE "ratings" (
	"name"	TEXT NOT NULL,
	"average"	REAL NOT NULL DEFAULT 5,
	PRIMARY KEY("name")
)

CREATE TABLE "review" (
	"comment"	TEXT NOT NULL,
	"recipe"	TEXT NOT NULL,
	"rating"	REAL NOT NULL,
	"id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("recipe") REFERENCES "ratings"("name")
)

CREATE TABLE "users" (
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("username")
)