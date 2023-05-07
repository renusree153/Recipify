'use strict';
(function() {
    window.addEventListener("load", init);
    function init() {
        document.getElementById("showRevPadThai").addEventListener("click", showRev);
        document.getElementById("goBackRecipes").addEventListener("click", showRev);
        let map = {}
    }
    function showRev() {
        let board = document.querySelector("main");
        let padThai = document.getElementById("padThaiReview");
        console.log(board);
        console.log(padThai);
        if (board.classList.contains("dontShow")) {
            console.log("in if");
            board.classList.remove("dontShow");
            padThai.classList.add("dontShow");
        } else {
            console.log("in else");
            board.classList.add("dontShow");
            padThai.classList.remove("dontShow");
        }   
    }
})();