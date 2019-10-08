/**
 * Created by joshuadjohnson on 11/9/17.
 */
var http = require('http');
var express = require('express');
var url = require('url');
var qstring = require('querystring');
var app = express();
app.listen(8081);


//Initializing global Variables....these are reset inside of a function when the user starts a new game.
var allRooms = ["Kitchen", "Ballroom", "Conservatory", "Dining Room", "Cellar", "Billiard Room", "Library", "Lounge", "Hall", "Study"];
var allSuspects = ["Miss Scarlet", "Professor Plum", "Mrs. Peacock", "Reverend Mr. Green" , "Colonel Mustard", "Mrs. White"];
var allWeapons = ["Candlestick", "Dagger", "Lead Pipe", "Revolver", "Rope", "Spanner"];
var RplusS = [];
var cardPool = [];
var compHand = [];  //this is the computer hand
var compShown = [];
var playerHand =[]; //this is the human player's hand
var playerShown = [];
var winningHaul = []; //The winning set
var notCompRoom =[];
var notCompSuspect=[];
var notCompWeapon =[];
var notPlayerRoom =[];
var notPlayerSuspect=[];
var notPlayerWeapon =[];
var notPlayerCards = [];
var compRoomGuess = "";
var compSuspectGuess = "";
var compWeaponGuess = "";
var name = '';
var allInPlay = [];
var topTextRooms = [];
var topTextSuspects = [];
var topTextWeapons = [];
var n = 3;
var numCardsInPlay = ((2*n) + 3);
var computerTotalWins = 0;
var playerTotalWins = 0;

console.log(numCardsInPlay);

//This function creates and array of the winning combination of cards
function WHODUNIT() {
    winningHaul.push(allRooms[Math.floor(Math.random() * (allRooms.length))]);
    winningHaul.push(allSuspects[Math.floor(Math.random() * (allSuspects.length))]);
    winningHaul.push(allWeapons[Math.floor(Math.random() * (allWeapons.length))]);
}
/////////////////////////////////////////////////////////////////////


//This function removes the winning elements from the respective arrays, so that the are not used twice.
function removeWinners(){
    var indexRoom = allRooms.indexOf(winningHaul[0]);
    allRooms.splice(indexRoom, 1);

    var indexSuspects = allSuspects.indexOf(winningHaul[1]);
    allSuspects.splice(indexSuspects, 1);

    var indexWeapons = allWeapons.indexOf(winningHaul[2]);
    allWeapons.splice(indexWeapons, 1);

    RplusS = allRooms.concat(allSuspects); //concat rooms and suspects
    cardPool = RplusS.concat(allWeapons); //concat to weapons, so all cards in pool

    //this displays winners index so that they can be removed - debug text

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////



//This function shuffles all of the cards that are in play and not in the winning set
function shuffle() {
    var m = cardPool.length, t, iter;
    while (m) {
        iter = Math.floor(Math.random() * m--);
        t = cardPool[m];
        cardPool[m] = cardPool[iter];
        cardPool[iter] = t;
    }

    for(var i = 0; i < (numCardsInPlay -3)/2; i++){
        compHand[i] = cardPool[i*2];
        playerHand[i] = cardPool[(i*2)+1];

    }
}
//////////////////////////////////////////////////////////////////////////////////////





//This organizes and sets the text at the top of the game window and pull down option for the game
//This organizes and sets the text at the top of the game window and pull down option for the game
function displayCardsInPlay(){
//Getting all cards filtered and sorted to display on top of page and BEGIN
    allInPlay = compHand.concat(playerHand, winningHaul);
    topTextRooms = [];
    topTextSuspects = [];
    topTextWeapons = [];


    for(var i in allInPlay) {
        if (allRooms.indexOf(allInPlay[i]) > -1) {
            topTextRooms.push(allInPlay[i]);
        } else if (allSuspects.indexOf(allInPlay[i]) > -1) {
            topTextSuspects.push(allInPlay[i]);
        } else if (allWeapons.indexOf(allInPlay[i]) > -1) {
            topTextWeapons.push(allInPlay[i]);
        }

    }

    topTextRooms.push(winningHaul[0]);
    topTextSuspects.push(winningHaul[1]);
    topTextWeapons.push(winningHaul[2]);

    topTextSuspects.sort(function(a, b){return 0.5 - Math.random()});
    topTextWeapons.sort(function(a, b){return 0.5 - Math.random()});
    topTextRooms.sort(function(a, b){return 0.5 - Math.random()});


//Getting all cards filtered and sorted to display on top of page END

//Building pull down menus BEGIN
    notPlayerCards = compHand.concat(winningHaul);

    // notPlayerCards.sort(function(a, b){return 0.5 - Math.random()});
    for(var k in notPlayerCards) {
        if ((allRooms.indexOf(notPlayerCards[k]) > -1) || (winningHaul[0].indexOf(notPlayerCards[k]) > -1)){
            notPlayerRoom.push(notPlayerCards[k]);
        } else if ((allSuspects.indexOf(notPlayerCards[k]) > -1) || (winningHaul[1].indexOf(notPlayerCards[k]) > -1)) {
            notPlayerSuspect.push(notPlayerCards[k]);
        } else if ((allWeapons.indexOf(notPlayerCards[k]) > -1) || (winningHaul[2].indexOf(notPlayerCards[k]) > -1)){
            notPlayerWeapon.push(notPlayerCards[k]);
        }
    }

    notPlayerRoom.sort(function(a, b){return 0.5 - Math.random()});
    notPlayerSuspect.sort(function(a, b){return 0.5 - Math.random()});
    notPlayerWeapon.sort(function(a, b){return 0.5 - Math.random()});

}
////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////








//This function is to set up a game with the user name/////////////////////////////////////////////////////////////////
app.get('/welcomeJS', function(req, res){
    console.log("Im inside welcomeJS");
    WHODUNIT();             //Pick winning cards call
    removeWinners();        //Remove the winners from the pool call
    shuffle();
     displayCardsInPlay();

    var sendR = topTextRooms.join(' ');
    var sendS = topTextSuspects.join(' ');
    var sendW = topTextWeapons.join(' ');
    var notPlayerRoomJSON = JSON.stringify(notPlayerRoom);
    var notPlayerSuspectJSON = JSON.stringify(notPlayerSuspect);
    var notPlayerWeaponJSON = JSON.stringify(notPlayerWeapon);

    var obj = {"winners" : { "room":winningHaul[0], "suspect": winningHaul[1], "weapon": winningHaul[2]}, "top" :
    {"room" : sendR, "suspect" : sendS, "weapon" : sendW}, "not" : {"room" : notPlayerRoomJSON, "suspect" :
    notPlayerSuspectJSON, "weapon" : notPlayerWeaponJSON}};

    res.set('Access-Control-Allow-Origin', '*');

    res.send(obj);

     compGuessArraySetUp();

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This processes the human guess
app.get('/guessFunction', function(req, res){
    console.log("Im inside guessFunction");


    var guessParse = JSON.parse(req.query.var);

        var roomGuess = guessParse.room;
        var suspectGuess = guessParse.suspect;
     var weaponGuess = guessParse.weapon;




    var cardToShow = "";

    if(roomGuess == winningHaul[0] && suspectGuess == winningHaul[1] && weaponGuess == winningHaul[2]){
        playerTotalWins = playerTotalWins + 1;
        res.set('Access-Control-Allow-Origin', '*');
        res.send("Winner");

    }else {
        if (playerShown.indexOf(roomGuess) < 0 && compHand.indexOf(roomGuess) > -1){
            cardToShow = roomGuess;
            playerShown.push(roomGuess);
           // sessionStorage.playerGuess = sessionStorage.playerGuess + " " + cardToShow;
            // var indexRooms = notCompRoom.indexOf(roomGuess);
            // notCompRoom.splice(indexRooms, 1);
        }else  if (playerShown.indexOf(suspectGuess) < 0 && compHand.indexOf(suspectGuess) > -1){
            cardToShow = suspectGuess;
            playerShown.push(suspectGuess);
           // sessionStorage.playerGuess = sessionStorage.playerGuess + " " + cardToShow;

        }else  if (playerShown.indexOf(weaponGuess) < 0 && compHand.indexOf(weaponGuess) > -1){
            cardToShow = weaponGuess;
            playerShown.push(weaponGuess);
            // sessionStorage.playerGuess = sessionStorage.playerGuess + " " + cardToShow;

        }else{cardToShow = "-No new valid guess was made.-";}
        console.log(cardToShow);

        res.set('Access-Control-Allow-Origin', '*');

        res.send(cardToShow);

    }

});

//This processes the computer guess.
app.get('/computerTurn', function(req, res){
    console.log("Im inside computerTurn");

    compRoomGuess = notCompRoom[Math.floor(Math.random() * (notCompRoom.length))];
    compSuspectGuess = notCompSuspect[Math.floor(Math.random() * (notCompSuspect.length))];
    compWeaponGuess = notCompWeapon[Math.floor(Math.random() * (notCompWeapon.length))];
    var cardToShow = "";

    if(compRoomGuess == winningHaul[0] && compSuspectGuess == winningHaul[1] && compWeaponGuess == winningHaul[2]){

        computerTotalWins = computerTotalWins + 1;
        res.set('Access-Control-Allow-Origin', '*');
        res.send("Winner");

    }else {

        if (playerShown.indexOf(compRoomGuess) < 0 && playerHand.indexOf(compRoomGuess) > -1){
            cardToShow = compRoomGuess;
            compShown.push(compRoomGuess);
           // sessionStorage.compGuess = sessionStorage.compGuess + " " + cardToShow;
        }else  if (playerShown.indexOf(compSuspectGuess) < 0 && playerHand.indexOf(compSuspectGuess) > -1){
            cardToShow = compSuspectGuess;
            compShown.push(compSuspectGuess);
           // sessionStorage.compGuess = sessionStorage.compGuess + " " + cardToShow;
        }else  if (playerShown.indexOf(compWeaponGuess) < 0 && playerHand.indexOf(compWeaponGuess) > -1){
            cardToShow = compWeaponGuess;
            compShown.push(compWeaponGuess);
           // sessionStorage.compGuess = sessionStorage.compGuess + " " + cardToShow;
        }

        res.set('Access-Control-Allow-Origin', '*');
        res.send(cardToShow);

    }

});

function compGuessArraySetUp(){
    var notCompCards = playerHand.concat(winningHaul);
    for(var k in notCompCards) {
        if ((allRooms.indexOf(notCompCards[k]) > -1) || (winningHaul[0].indexOf(notCompCards[k]) > -1)){
            notCompRoom.push(notCompCards[k]);
        } else if ((allSuspects.indexOf(notCompCards[k]) > -1) || (winningHaul[1].indexOf(notCompCards[k]) > -1)) {
            notCompSuspect.push(notCompCards[k]);
        } else if ((allWeapons.indexOf(notCompCards[k]) > -1) || (winningHaul[2].indexOf(notCompCards[k]) > -1)){
            notCompWeapon.push(notCompCards[k]);
        }
    }

}




//processes new game; resets all global variables, empties the drop down menu
app.get('/newGame', function(req, res){

console.log("I'm in newGame.")


//Re-initialize all global variables
//     sessionStorage.compGuess = " ";
//     sessionStorage.playerGuess = " ";

    RplusS = [];
    cardPool = [];
    compHand = [];  //this is the computer hand
    compShown = [];
    playerHand =[]; //this is the human player's hand
    playerShown = [];
    winningHaul = []; //The winning set
    notCompRoom =[];
    notCompSuspect=[];
    notCompWeapon =[];
    notPlayerRoom =[];
    notPlayerSuspect=[];
    notPlayerWeapon =[];
    allInPlay = [];
    topTextRooms = [];
    topTextSuspects = [];
    topTextWeapons = [];
    notPlayerCards = [];
    compRoomGuess = "";
    compSuspectGuess = "";
    compWeaponGuess = "";
    name = '';
    n = 3;
    numCardsInPlay = ((2*n) + 3);

    res.set('Access-Control-Allow-Origin', '*');
    res.send("initializedVariables");


});



//show record
app.get('/showRecord', function(req, res){
    res.set('Access-Control-Allow-Origin', '*');
    res.send( playerTotalWins + " Computer total Wins: " + computerTotalWins );
});




//function for remvoing menu items that I called in earlier function
// function removeOptions(selectbox) {
app.get('/removeOptions', function(req, res){
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
});