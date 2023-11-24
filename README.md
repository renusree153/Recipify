# Recipify

A grocery shopping web app supporting authentication and ability to make purchases. For each grocery item, users can view a list of personalized recommended recipes that can be made with the given item and are also able to provide ratings and feedback on the recipes to interact with others users using the platform. Below is a detailed breakdown of each feature. 

## Feature 1: all grocery items are displayed on main page
Front End
  * Users can browse through all items and switch between grid and list view

Back End
  * Endpoint to retrieve all items

## Feature 2: allows the user to login to their account
Front End
  * Allows user to provide a valid username and password to gain access to account-required actions

Back End
  * Endpoint to check if the username and password match an entry in the database

## Feature 3: clicking on any individual item brings user to more information about the item
Front End
  * Includes name, description, and price of the grocery item

Back End
  * Endpoint to retrieve detailed item information

## Feature 4: users are able to buy a product
Front End
  * Users must be logged in to make the purchase and will give be given a confirmation code once they make the purchase

Back End
  * Endpoint checks if transaction is successful or not
  * If the transaction is successful, database is updated
  * Users are not able to buy products that are out of stock

## Feature 5: users are able to search and filter the available items
Front End
  * Contains a search bar
    * Able to search multiple types of information

## Feature 6: users are able to access all previous transactions
Front End
  * Users must be logged in
  * Users are able to view information about their transaction including the name of the item and the confirmation number for each transaction

Back End
  * Endpoint to retrieve transaction history for any given user when they are logged in

## Feature 7: Recommendations
  * Website displays recommended recipes to a user based on the groceries that they choose to purchase

## Feature 8: Bulk Enroll
  * Users are able to add groceries to their cart
  * The groceries in the cart persist through refreshing of the page
  * Users can bulk purchase multiple grocery items at once and have the same confirmation code for the entire purchase

## Feature 9: Feedback on a Recipe
  * Logged-in users are able to give feedback on any recipe
  * There is an “average rating” visibly shown for all recipes
  * Users can also submit text reviews for any given recipe to accompany the numerical rating it received.

## Feature 10: Create a New User
  * Users are presented with a method in which to create an account for your reservation site.
  * The user provides at minimum a username, password, and e-mail.
  * The user information is added to the database.


