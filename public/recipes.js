"use strict";

(function() {
  window.addEventListener("load", init);
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

  function appendChildren(recipeCard, recipeImg, recipeName, ratingForm) {
    recipeCard.appendChild(recipeImg);
    recipeCard.appendChild(recipeName);
    recipeCard.appendChild(ratingForm);
  }

  function btn1Func(btn1, recipe) {
    btn1.addEventListener("click", function() {
      let rating = document.querySelector('input[name="rating"]:checked').value;
      let bodyData = new FormData();
      bodyData.append("name", recipe.name);
      bodyData.append("rate", rating);
      fetch("/insertRating", {method: "POST", body: bodyData})
        .then(statusCheck)
        .then(res => res.json())
        .then(res => console.log(res));
    });
  }

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
        buttonFunc(button, textBox, div, name, p1);
      })
      .catch(err => {
        console.error("Error retrieving dat ", err);
      })
  }

  function createTextBox(div) {
    let textBox = document.createElement("input");
    textBox.type = "text";
    div.appendChild(textBox);
    return textBox;
  }

  function btn2Func(btn2, div) {
    btn2.addEventListener("click", function() {
      div.style.display = "none";
    });
  }

  function createNewRev(review, div) {
    let newRev = document.createElement("p");
    newRev.textContent = "-" + review.comment;
    div.appendChild(newRev);
  }

  function buttonFunc(button, textBox, div, name, p1) {
    button.addEventListener("click", function (event) {
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
          .catch(err => console.error(err));
        }
    });
  }

  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  function handleError(err) {
    let p1 = document.createElement("p");
    p1.textContent = "There has been an error retrieving your data. Please try again" +
      "Here is the error: " + err;
    document.getElementById("main").appendChild(p1);
  }

})();
