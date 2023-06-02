

CREATE TABLE "carts" (
	"id"	INTEGER,
	"username"	TEXT NOT NULL,
	"item"	INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("username") REFERENCES "users"("username")
)