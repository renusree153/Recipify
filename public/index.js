'use strict';
(function() {
    window.addEventListener("load", init);
    function init() {
        //document.getElementById("showRevPadThai").addEventListener("click", showRev);
        //document.getElementById("goBackRecipes").addEventListener("click", showRev);
        console.log(document.getElementById("submitBtn"));
        document.getElementById("submitBtn").addEventListener("click", submitFunc);
        let map = {}
    }
    function showRev() {
        let board = document.querySelector("main");
        let padThai = document.getElementById("padThaiReview");
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
    function submitFunc() {
        console.log("in submit func");
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        fetch("/checkUser?username=" + username + "&password=" + password)
            .then(resp => resp.json())
            .then(res => console.log(res))
            .catch(err => {
                console.error(err);
            })
    }
})();