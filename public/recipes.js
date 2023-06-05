"use strict";

(function () {
    window.addEventListener("load", init);
    function init() {
        console.log("hi");
        document.querySelectorAll(".submitRating").forEach(function (element) {
            element.addEventListener("click", function (event) {
              console.log(event.target.closest(".recipeCard"));
              let rating = document.querySelector('input[name="rating"]:checked').value;
            });
          });
        document.querySelectorAll(".reviewBtn").forEach(function (element) {
            element.addEventListener("click", function (event) {
              let name = event.target.closest(".recipeCard").querySelector("h2").textContent;
              name = name.toLowerCase();
              createRecipeCard(name);
              })
          });
    }
    function createRecipeCardd(resp) {
        let name = document.createElement("h2");
        name.textContent = resp.name;
        let submitRatingBtn = document.createElement("button");
        submitRatingBtn.id = "submitRating";
        submitRatingBtn.textContent = "Submit Rating";
        let reviewBtn = document.createElement("button");
        reviewBtn.id = "reviewBtn";
        reviewBtn.textContent = "Show Reviews";
        document.getElementById("recipes").appendChild(name,reviewBtn,submitRatingBtn);
        document.getElementById("recipes").classList.add("recipeCard");
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
            res.forEach(review => {
                let newRev = document.createElement("p");
                newRev.textContent = "-" +review.comment;
                div.appendChild(newRev);
            })
            let button = document.createElement("button");
            button.textContent = "Add your review"
            div.appendChild(button);
            let addRev = false;
            button.addEventListener("click", function (event) {
                if (!addRev) {
                    let textBox = document.createElement("input");
                    textBox.type = "text";
                    div.appendChild(textBox);
                    addRev = true;
                }
            })
          })
          .catch(err => {
            console.error("Error retrieving dat ", err);
          }) 
    }

    function avgRating() {

    }
})();

/** 
fetch( endpoint for all recipes )
        .then(resp => resp.json())
        .then(resp => {
            createRecipeCard(resp);
            
        });

        */