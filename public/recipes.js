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
      })
    });
  };
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
          defineRating();
          recipeCard.appendChild(recipeImg);
          recipeCard.appendChild(recipeName);
          recipeCard.appendChild(ratingForm);
          let btn1 = document.createElement("button");
          btn1.id = "submitRtg";
          btn1.textContent = "Submit Rating";
          btn1Func(recipe);
          getAvgRating();
          recipeCard.appendChild(btn1);
          let btn2 = document.createElement("button");
          btn2.id = "showRev";
          btn2.textContent = "Show Reviews";
          btn2.addEventListener("click", function (event) {
            createRecipeCard(recipeName.textContent);
          })
          recipeCard.appendChild(btn2);
          document.getElementById("recipes").appendChild(recipeCard);
        });
      });
    }

    function btn1Func() {
      btn1.addEventListener("click", function() {
        let rating = document.querySelector('input[name="rating"]:checked').value;
        let bodyData = new FormData();
        bodyData.append("name", recipe.name);
        bodyData.append("rate", rating);
        fetch("/insertRating", {method: "POST", body: bodyData})
          .then(res => res.json())
          .then(res => console.log(res));
      });
    }

    function getAvgRating() {
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

    function defineRating() {
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
      console.log("here in create recipe card");
      let div = document.createElement('div');
      div.id = "Reviews for " + name;
      let p = document.createElement('h2');
      p.textContent = "Here are some reviews for " + name + "!";
      div.appendChild(p);
      div.classList.add("shortReview");
      document.querySelector("main").appendChild(div);
      let bodyData = new FormData();
      bodyData.append("item", name);
      fetch("/getReviews", {method: "POST", body: bodyData})
        .then(res => res.json())
        .then(res => {
          res.forEach((review) => {
            console.log(review.comment);
            let newRev = document.createElement("p");
            newRev.textContent = "-" +review.comment;
            div.appendChild(newRev);
          })
          let button = document.createElement("button");
          button.textContent = "Add your review"
          div.appendChild(button);
          let btn2 = document.createElement("button");
          btn2.textContent = "Close out";
          div.appendChild(btn2);
          btn2.addEventListener("click", function(event) {
            div.style.display = "none";
          })
          let textBox = document.createElement("input");
          textBox.type = "text";
          div.appendChild(textBox);
          button.addEventListener("click", function (event) {
            if (textBox.value) {
              let reviewText = "- " + textBox.value;
              let p = document.createElement("p");
              p.textContent = reviewText;
              div.insertBefore(p, button);
              let bodyData = new FormData();
              bodyData.append("recipe", name);
              bodyData.append("review", p.textContent);
              bodyData.append("rating", 5);
              fetch("/addReview", {
                method: "POST",
                body: (bodyData)
              })
              .then(res => res.json())
              .then(res => console.log(res))
              .catch(err => console.error(err));
            }
          })
        })
        .catch(err => {
          console.error("Error retrieving dat ", err);
        })
    }
})();
