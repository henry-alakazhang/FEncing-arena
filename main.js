var charList = ["Eliwood", "Lyn"];
var assetsDir = "assets/";
var characters = {};
var playPicker = [];
var charPicker = [];

function setup() {
    var body = document.getElementById('main');
    for (var i = 0; i < 2; i++) {
        var pLabel = document.createTextNode("Player " + (i+1) + ": ");
        playPicker[i] = document.createElement('select');
        var playerOpt = document.createElement('option');
        playerOpt.innerHTML = "Player";
        playerOpt.value = "false";
        var AIOpt = document.createElement('option');
        AIOpt.innerHTML = "AI";
        AIOpt.value = "true";
        playPicker[i].appendChild(playerOpt);
        playPicker[i].appendChild(AIOpt);
        charPicker[i] = document.createElement('select');
        body.appendChild(pLabel);
        body.appendChild(playPicker[i]);
        body.appendChild(charPicker[i]);
        body.appendChild(document.createElement('p'));
    }
    
    for (var i = 0; i < charList.length; i++) {
        // load character file
        var sc = document.createElement('script');
        document.getElementById('head').appendChild(sc);
        sc.src = assetsDir + charList[i] + ".js";
        
        // create pickable option
        for (var j = 0; j < charPicker.length; j++) {
            var charOpt = document.createElement('option');
            charOpt.innerHTML = charList[i];
            charOpt.value = charList[i];
            charPicker[j].appendChild(charOpt);
        }
    }
    body.appendChild(document.createTextNode("Controls:"));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createTextNode("Move with A/D or J/L"));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createTextNode("Attack with W or I"));
    body.appendChild(document.createElement('br'));
    body.appendChild(document.createTextNode("Crit with Q or U"));
    body.appendChild(document.createElement('p'));
    
    var startButton = document.createElement('button');
    startButton.setAttribute('onclick', 'setupGame()');
    startButton.innerHTML = "Fight!"
    body.appendChild(startButton);
}

function addCharacter(c) {
    characters[c] = eval(c + "FrameData");
}

setup();