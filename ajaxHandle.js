/**
 * Created by joshuadjohnson on 11/9/17.
 */
var roomGuess = " ";
var suspectGuess = " ";
var weaponGuess = " ";
sessionStorage.compGuess = " ";
sessionStorage.playerGuess = " ";
var name = "";

function getRequestObject() {
    if (window.XMLHttpRequest) {
        return(new XMLHttpRequest());
    } else {
        return(null);
    }
}

//setting up game/////////////////////////////////////////
function sendRequestSetGameUp() {
    var request = getRequestObject();
    request.onreadystatechange =
        function() {
            handleResponseSetGameUp(request);
    };
    request.open("GET", "http://localhost:8081/welcomeJS", true);
    request.send(null);
}

function handleResponseSetGameUp(request) {

    if ((request.status >= 400 && request.status < 500)) {
        var  errorString = "400 Bad Request: The request cannot be fulfilled due to bad syntax."

        document.getElementById("topText").innerHTML = errorString;
    } else if ((request.status >= 500 && request.status < 600)) {
        document.getElementById("city2Current").innerHTML = "There has been a server error of type " + request.status +
            ". Please try again later."

    } else if ((request.readyState == 4) && (request.status == 200)) {


//setting top text showing all cards in play and welcome message
        var data = JSON.parse(request.responseText);
        document.getElementById("debug2").innerHTML = "Response: " + data.not.room;

        var f = document.getElementById("userName");
        name = document.getElementById("startGame").value;
        f.parentNode.removeChild(f);
        var span =
            document.getElementById("userNameReplace");
        span.innerHTML =
            "Hello " + name + ", you hold the cards for " + data.winners.room + ", " + data.winners.suspect + " and "
            + data.winners.weapon + "<br/>";
        document.getElementById("guessBTN").disabled = false;

        document.getElementById("topText").innerHTML = "Weapons: " + data.top.weapon + "<br/>" + " Rooms: "
            + data.top.room + "<br/>" + " Suspects: " + data.top.suspect;


//setup pull down menus

        var notR = JSON.parse(data.not.room);
        var notS = JSON.parse(data.not.suspect);
        var notW = JSON.parse(data.not.weapon);

        for (var j = 0; j < notR.length; j++) {
            var opt = document.createElement("option");                     // Create an Option object
            document.getElementById("roomChoice").options.add(opt);      // Add an Option object to Drop Down/List Box
            opt.text = notR[j].toString();                        // Assign text and value to Option object

        }

        for (var j = 0; j < notS.length; j++) {
            var opt = document.createElement("option");                     // Create an Option object
            document.getElementById("suspectChoice").options.add(opt);      // Add an Option object to Drop Down/List Box
            opt.text = notS[j].toString();                        // Assign text and value to Option object

        }

        for (var j = 0; j < notW.length; j++) {
            var opt = document.createElement("option");                     // Create an Option object
            document.getElementById("weaponChoice").options.add(opt);      // Add an Option object to Drop Down/List Box
            opt.text = notW[j].toString();                        // Assign text and value to Option object

        }

//
//debug for setting game up

        document.getElementById("debug2").innerHTML = "Response: " + data.winners.room + data.winners.suspect + data.winners.weapon ;
///////////////////////

    }


}
//END game Setup/////////////////////////////////////////


//This section is to process a human player guess//////////////////////
function sendRequestGuess() {
    var guess = {"room" : document.getElementById('roomChoice').value, "suspect" : document.getElementById('suspectChoice').value,
    "weapon" : document.getElementById('weaponChoice').value};


      var guessJSON = JSON.stringify(guess);
    var IP = "http://localhost:8081/guessFunction?var=" + guessJSON;
    var request = getRequestObject();
    request.onreadystatechange =
        function() {
            handleResponseGuess(request);
        };
    request.open("GET", IP, true);
    request.send(null);
}

function handleResponseGuess(request) {

    if ((request.status >= 400 && request.status < 500)) {
        var errorString = "400 Bad Request: The request cannot be fulfilled due to bad syntax."

        document.getElementById("topText").innerHTML = errorString;
    } else if ((request.status >= 500 && request.status < 600)) {
        document.getElementById("city2Current").innerHTML = "There has been a server error of type " + request.status +
            ". Please try again later."

    } else if ((request.readyState == 4) && (request.status == 200)) {

        if (request.responseText == "Winner") {

            winner(name);
        } else {


        document.getElementById("notSucssful").innerHTML = "Sorry that was an incorrect guess! The Computer holds the card for " + request.responseText;
        document.getElementById("guessBTN").textContent = "Continue";
         document.getElementById("guessBTN").onclick = sendRequestCompTurn;

        sessionStorage.compGuess = request.responseText + sessionStorage.compGuess;
    }
    }
}

//////Process human player guess END//////////////////////////////////

//This section is to process a computer player guess//////////////////////
function sendRequestCompTurn() {
    var IP = "http://localhost:8081/computerTurn";
    var request = getRequestObject();
    request.onreadystatechange =
        function() {
            handleResponseCompTurn(request);
        };
    request.open("GET", IP, true);
    request.send(null);
}

function handleResponseCompTurn(request) {

    if ((request.status >= 400 && request.status < 500)) {
        var errorString = "400 Bad Request: The request cannot be fulfilled due to bad syntax."

        document.getElementById("topText").innerHTML = errorString;
    } else if ((request.status >= 500 && request.status < 600)) {
        document.getElementById("city2Current").innerHTML = "There has been a server error of type " + request.status +
            ". Please try again later."

    } else if ((request.readyState == 4) && (request.status == 200)) {

        if (request.responseText == "Winner") {

            winner("Computer");
        } else {

            document.getElementById("debug2").innerHTML = "I'm a computer and not a winner" ;
            document.getElementById("notSucssful").innerHTML = "Sorry that was an incorrect guess! The Player holds the card for " + request.responseText;
            document.getElementById("guessBTN").textContent = "Guess"
            document.getElementById("guessBTN").onclick = sendRequestGuess;

            sessionStorage.playerGuess = request.responseText + sessionStorage.playerGuess;
        }
    }
}

//This section is to process a computer player guess END//////////////////////

//Process winner
function winner(namePassed) {
    document.getElementById("userNameReplace").innerHTML = " <h2>Congrats " + namePassed + ", you have won the game! </h2>";
    document.getElementById("roomChoice").disabled=true;
    document.getElementById("suspectChoice").disabled=true;
    document.getElementById("weaponChoice").disabled=true;

    document.getElementById("guessBTN").textContent = "Play Again"
    document.getElementById("guessBTN").onclick = newGame;


}

//show history I use sessionStorage variables for this
function showHistory(){
    document.getElementById("textHistory").innerHTML = "PLAYER GUESSES:" + sessionStorage.playerGuess + "<br> COMPUTER GUESSES: " + sessionStorage.compGuess;
    document.getElementById("history").textContent = "Hide History"
    document.getElementById("history").onclick = hideHistory;
}

function hideHistory(){
    document.getElementById("textHistory").innerHTML = " ";
    document.getElementById("history").textContent = "Show History"
    document.getElementById("history").onclick = showHistory;
}



//Set up new game///////////////////////////////////////////
function newGame(){
//I reset all local variables
    document.getElementById("userNameReplace").innerHTML =     " <FORM id = \"userName\"> Please enter your name to start." +
    "</br></br> Name:<input id = \"startGame\" type=\"text\" autofocus=\"true\" />" +
       "<input type=\"button\" value=\"Enter\" onclick=\'sendRequestSetGameUp()\'/>" +
    "</FORM>";

    document.getElementById("debug2").textContent = "setting up a new game"

    document.getElementById("roomChoice").disabled=false;
    document.getElementById("suspectChoice").disabled=false;
    document.getElementById("weaponChoice").disabled=false;

    document.getElementById("guessBTN").textContent = "Guess"
    document.getElementById("guessBTN").onclick = sendRequestGuess;

//Re-initialize all global variables
     roomGuess = " ";
     suspectGuess = " ";
     weaponGuess = " ";
    sessionStorage.compGuess = " ";
    sessionStorage.playerGuess = " ";
     name = "";
////////////////////////////////////

//I remove what is in the pull down menu
    removeOptions(document.getElementById("roomChoice"));
    var optR = document.createElement("option");                     // Create an Option object
    document.getElementById("roomChoice").options.add(optR);      // Add an Option object to Drop Down/List Box
    optR.text = "ROOM";

    removeOptions(document.getElementById("suspectChoice"));
    var optS = document.createElement("option");                     // Create an Option object
    document.getElementById("suspectChoice").options.add(optS);      // Add an Option object to Drop Down/List Box
    optS.text = "SUSPECT";

    removeOptions(document.getElementById("weaponChoice"));
    var optW = document.createElement("option");                     // Create an Option object
    document.getElementById("weaponChoice").options.add(optW);      // Add an Option object to Drop Down/List Box
    optW.text = "WEAPON";

//I re-initialize the server with this call
    sendRequestNewGame();

}


function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}


function sendRequestNewGame() {
    var IP = "http://localhost:8081/newGame";
    var request = getRequestObject();
    request.onreadystatechange =
        function() {
            handleResponseGame(request);
        };
    request.open("GET", IP, true);
    request.send(null);
}

function handleResponseGame(request) {

    if ((request.status >= 400 && request.status < 500)) {
        var errorString = "400 Bad Request: The request cannot be fulfilled due to bad syntax."

        document.getElementById("topText").innerHTML = errorString;
    } else if ((request.status >= 500 && request.status < 600)) {
        document.getElementById("city2Current").innerHTML = "There has been a server error of type " + request.status +
            ". Please try again later."

    } else if ((request.readyState == 4) && (request.status == 200)) {


    }
}
//Set up new game END///////////////////////////////////////////

//Show Record of wins
function sendRequestShowRecord() {
    var IP = "http://localhost:8081/showRecord";
    var request = getRequestObject();
    request.onreadystatechange =
        function() {
            handleResponseShowRecord(request);
        };
    request.open("GET", IP, true);
    request.send(null);
}



///The win record is stored om the server
function handleResponseShowRecord(request) {

    if ((request.status >= 400 && request.status < 500)) {
        var errorString = "400 Bad Request: The request cannot be fulfilled due to bad syntax."

        document.getElementById("topText").innerHTML = errorString;
    } else if ((request.status >= 500 && request.status < 600)) {
        document.getElementById("city2Current").innerHTML = "There has been a server error of type " + request.status +
            ". Please try again later."

    } else if ((request.readyState == 4) && (request.status == 200)) {
        document.getElementById("textRecord").innerHTML = name + " total Wins: " + request.responseText;
        document.getElementById("record").textContent = "Hide Record"
        document.getElementById("record").onclick = hideRecord;

    }
}

function showRecord(){
    sendRequestShowRecord();
}

function hideRecord(){
    document.getElementById("textRecord").innerHTML = " ";
    document.getElementById("record").textContent = "Show Record"
    document.getElementById("record").onclick = showRecord;
}


