/**
 * Name: Renusree Chittella & Theodore Sakamoto
 * Date: June 6th 2023
 * This is our recipes.js file which includes functionality
 * for retrieving different recipes from our database, and appending
 * it onto the DOM for users to visually see.
 */

"use strict";

(function() {
  window.addEventListener("load", init);

  /**
   * This is our init function which calls the retrieveRecipes
   * function in order to make a fetch call and retrieve the data.
   * It also includes functionality to retrieve the rating value
   * a user clicked and add reviews onto an existing recipe.
   */
  function init() {
    retrieveRecipes();
    document.querySelectorAll(".submitRating").forEach(function(element) {
      element.addEventListener("click", function() {
        let rating = document.querySelector('input[name="rating"]:checked').value;
      });
    });
    document.querySelectorAll(".reviewBtn").forEach(function(element) {
      element.addEventListener("click", function(event) {
        let name = event.target.closest(".recipeCard").querySelector("h2").textContent;
        name = name.toLowerCase();
        createRecipeCard(name);
      });
    });
  }

  /**
   * This is our retrieveRecipes function which
   * makes a fetch request to the /allRecipes endpoint
   * in order to retrieve all the current recipes and then
   * appends them onto the website.
   */
  function retrieveRecipes() {
    fetch("/allRecipes")
      .then(res => res.json())
      .then(res => {
        res.forEach(recipe => {
          let recipeCard = document.createElement("section");
          recipeCard.classList.add("recipeCard");
          let recipeImg = document.createElement("img");
          recipeImg.src = `images/${recipe.name}.jpg`;
          let recipeName = document.createElement("h2");
          recipeName.textContent = recipe.name;
          let ratingForm = document.createElement("form");
          defineRating(ratingForm);
          appendChildren(recipeCard, recipeImg, recipeName, ratingForm);
          let btn1 = document.createElement("button");
          btn1.id = "submitRtg";
          btn1.textContent = "Submit Rating";
          btn1Func(btn1, recipe);
          getAvgRating(recipeCard, recipe);
          recipeCard.appendChild(btn1);
          let btn2 = document.createElement("button");
          btn2.id = "showRev";
          btn2.textContent = "Show Reviews";
          btn2.addEventListener("click", function() {
            createRecipeCard(recipeName.textContent);
          });
          recipeCard.appendChild(btn2);
          document.getElementById("recipes").appendChild(recipeCard);
        });
      });
  }

  /**
   * This is our appendChildren function which takes in
   * a list of existing elements and appends them onto the page
   * @param {recipeCard} recipeCard - the actual card that contains
   * information about the given recipe.
   * @param {recipeImg} recipeImg  - the image of the given recipe
   * @param {recipeName} recipeName - the name of the given recipe
   * @param {ratingForm} ratingForm - a form from a scale of 1-5
   * where users can rate the recipe
   */
  function appendChildren(recipeCard, recipeImg, recipeName, ratingForm) {
    recipeCard.appendChild(recipeImg);
    recipeCard.appendChild(recipeName);
    recipeCard.appendChild(ratingForm);
  }

  /**
   * This is our btn1Func function which contains functionality
   * for button 1 including retrieving the rating tht the user
   * selected as well as appending that ratig into
   * our database.
   * @param {btn1} btn1 - the given button that we will be
   * clicking on in order to provide functionality
   * @param {recipe} recipe - the given recipe for which
   * we will be retrieving ratings.
   */
  function btn1Func(btn1, recipe) {
    btn1.addEventListener("click", function() {
      let rating = document.querySelector('input[name="rating"]:checked').value;
      let bodyData = new FormData();
      bodyData.append("name", recipe.name);
      bodyData.append("rate", rating);
      fetch("/insertRating", {method: "POST", body: bodyData})
        .then(statusCheck)
        .then(res => res.json())
    });
  }

  /**
   * This is our getAvgRating function which retrieves the average
   * rating for a given recipe by querying the database.
   * @param {recipeCard} recipeCard - the recipeCard that we 
   * will be appending the average rating onto
   * @param {recipe} recipe - the recipe that we are working with
   */
  function getAvgRating(recipeCard, recipe) {
    let avgRating = document.createElement("p");
    let bodyData = new FormData();
    bodyData.append("recipe", recipe.name);
    fetch("/getAvgRating", {method: "POST", body: bodyData})
      .then(res => res.json())
      .then(res => {
        let avgRate = 0;
        let count = 0;
        res.forEach(resObj => {
          let rating = resObj.rating;
          count += 1;
          avgRate += rating;
        });
        avgRating.textContent = "Average Rating is: " + (avgRate / count).toFixed(1) + "/5";
        recipeCard.appendChild(avgRating);
      });
  }

  /**
   * This is our defineRating function which creates the
   * form for which users are able to select their rating
   * for a given recipe.
   * @param {ratingForm} ratingForm - the element which
   * we will display to users for them to choose ratings
   */
  function defineRating(ratingForm) {
    for (let i = 1; i <= 5; i++) {
      let ratingInput = document.createElement('input');
      let ratingLabel = document.createElement('label');
      ratingInput.type = 'radio';
      ratingInput.id = `rating${i}`;
      ratingInput.name = 'rating';
      ratingInput.value = i;
      ratingLabel.for = `rating${i}`;
      ratingLabel.textContent = i;
      ratingForm.appendChild(ratingInput);
      ratingForm.appendChild(ratingLabel);
    }
  }

  /**
   * This is our createRecipeCard function which creates
   * the card for the given recipe in order to display
   * to the users.
   * @param {name} name - this is the name of the recipe
   * that we want to display to users.
   */
  function createRecipeCard(name) {
    let div = document.createElement('div');
    div.id = "Reviews for " + name;
    let p1 = document.createElement('h2');
    p1.textContent = "Here are some reviews for " + name + "!";
    div.appendChild(p1);
    div.classList.add("shortReview");
    document.querySelector("main").appendChild(div);
    let bodyData = new FormData();
    bodyData.append("item", name);
    fetch("/getReviews", {method: "POST", body: bodyData})
      .then(res => res.json())
      .then(res => {
        res.forEach((review) => {
          createNewRev(review, div);
        });
        let button = document.createElement("button");
        button.textContent = "Add your review";
        div.appendChild(button);
        let btn2 = document.createElement("button");
        btn2.textContent = "Close out";
        div.appendChild(btn2);
        btn2Func(btn2, div);
        let textBox = createTextBox(div);
        buttonFunc(button, textBox, div, name);
      })
      .catch(err => {
        console.error("Error retrieving dat ", err);
      })
  }

  /**
   * This is a helper function called createTextBox
   * which appends a textbox onto the given div element.
   * @param {div} div - div is the element in which
   * we want to append the text box
   * @return {textBox} textBox - this function returns
   * the given textBox that users can type into
   */
  function createTextBox(div) {
    let textBox = document.createElement("input");
    textBox.type = "text";
    div.appendChild(textBox);
    return textBox;
  }

  /**
   * This is our btn2Func helper function which makes
   * the div display equal to none when pressed
   * @param {btn2} btn2 - this is the button which when
   * pressed has the following functionality
   * @param {*} div - this is the div object we are controlling
   * the display for
   */
  function btn2Func(btn2, div) {
    btn2.addEventListener("click", function() {
      div.style.display = "none";
    });
  }

  /**
   * This is the createNewRev helper function which
   * creates a new review based on what exists in the database
   * and appends it onto the current list of reviews
   * @param {review} review - this is the review object that contains
   * information about the comment and type of recipe
   * @param {div} div - this is the div object which we want to append
   * the reviews onto
   */
  function createNewRev(review, div) {
    let newRev = document.createElement("p");
    newRev.textContent = "-" + review.comment;
    div.appendChild(newRev);
  }

  /**
   * This is the buttonFunc helper function which retrieves
   * the value from the textBox and makes a fetch request to
   * post data into the database about the reviews for a specific
   * recipe.
   * @param {button} button - this is the button object when
   * clicked contains functionality to add a review to a table
   * @param {textBox} textBox - this is the textBox the user types
   * into in order to show their review for a recipe
   * @param {div} div - this is the div object that contains
   * all the reviews
   * @param {name} name - this is the name of the recipe
   * @param {p1} p1 - this is the text of the review that we want to insert
   */
  function buttonFunc(button, textBox, div, name) {
    button.addEventListener("click", function () {
      if (textBox.value) {
        let reviewText = "- " + textBox.value;
        let p1 = document.createElement("p");
        p1.textContent = reviewText;
        div.insertBefore(p1, button);
        let bodyData = new FormData();
        bodyData.append("recipe", name);
        bodyData.append("review", p1.textContent);
        bodyData.append("rating", 5);
        fetch("/addReview", {
          method: "POST",
          body: (bodyData)
        })
          .then(res => res.json())
          .catch(err => {
            handleError(err);
          });
        }
    });
  }

  /**
   * This is my statusCheck function which checks
   * whether or not the response from the endpoint
   * was successful or not.
   * @param {response} response takes in response
   * as a parameter which is the status code received
   * from the fetch request and checks if it is valid or not
   * @returns {response} response - returns a response
   * object that shows whether the fetch was successful or not.
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * This is my handle error function which takes in
   * the error message receivd from the fetch call and
   * append a paragraph onto the webpage stating that
   * there was an error.
   * @param {err} err  - takes in an error object
   * that is retrived from the fetch call.
   */
  function handleError(err) {
    let p1 = document.createElement("p");
    p1.textContent = "There has been an error retrieving your data. Please try again" +
      "Here is the error: " + err;
    document.getElementById("main").appendChild(p1);
  }
})();
