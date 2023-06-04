"use strict";

(function () {
    window.addEventListener("load", init);
    function init() {
        fetch(/** endpoint for all recipes */)
        .then(resp => resp.json())
        .then(resp => {
            createRecipeCard(resp);
        });
    }
    function createRecipeCard(resp) {
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
    function avgRating() {
        
    }
})();