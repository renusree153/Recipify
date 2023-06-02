'use strict';
(function() {
    window.addEventListener("load", init);
    function init() {
        //document.getElementById("showRevPadThai").addEventListener("click", showRev);
        //document.getElementById("goBackRecipes").addEventListener("click", showRev);
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
        let bodyData = new FormData();
        bodyData.append("username", username);
        bodyData.append("password", password);
        fetch("/checkUser", {method: "POST", body: bodyData})
            .then(res => res.json())
            .then(res => {
                if (res.length > 0) {
                    window.location.href = "page.html";
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
})();