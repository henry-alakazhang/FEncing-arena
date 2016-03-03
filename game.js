var canvas = null;
var ctx = null;
var bg_img = null;
var fr = 1000/21;
var br = { // bottom right corner for drawing to
    x: 190,
    y: 120,
    w: 50, // extra offset for canvas size
    h: 50
}
var players = []

function setupGame() {
    var body = document.getElementById('main');
    body.innerHTML = ""; // clear all the option buttons and whatnot
    
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', br.x+br.w);
    canvas.setAttribute('height', br.y+br.h);
    canvas.setAttribute('style', "float:left");
    
    ctx = canvas.getContext('2d');
    
    var scoreBar = document.createElement('div');
    scoreBar.setAttribute('style', "float:left");
    body.appendChild(scoreBar);
    
    bg_img  = new Image();
    bg_img.src = "assets/bg.png"
    
    players[0] = {character: new Character(charPicker[0].value)};
    players[0].character.flipped = true;
    players[1] = {character: new Character(charPicker[1].value)};
    players[0].isAI = eval(playPicker[0].value); // eval() to get an actual boolean value
    players[1].isAI = eval(playPicker[1].value);
    
    for (i = 0; i < players.length; i++) {
        players[i].canvas = document.createElement('canvas');
        players[i].canvas.setAttribute('width', br.x + br.w);
        players[i].canvas.setAttribute('height', br.y + br.h);
        players[i].ctx = players[i].canvas.getContext('2d');
        players[i].score = document.createElement('div');
        players[i].score.id = "score" + i;
        players[i].score.innerHTML = "0";
        scoreBar.appendChild(document.createTextNode("Player " + (i+1) + ": "));
        scoreBar.appendChild(players[i].score);
    }
    body.appendChild(canvas);
    
    // flip player one horizontally
    players[0].ctx.translate(players[0].canvas.width, 0);
    players[0].ctx.scale(-1, 1);
    setInterval(runFrame,fr);
    if (players[0].isAI || players[1].isAI) {
        console.log(players[0].isAI, players[1].isAI);
        setInterval(runAI, 300);
    }
    console.log(players);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
}

function runFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg_img, 0, 0); // draw over everything else lol
    // draw everything
    for (var i = 0; i < players.length; i ++) {
        // clear contexts
        clearContext(players[i].ctx, players[i].canvas.width, players[i].canvas.height);
        
        // don't let players move out of the arena
        var trueHit1 = trueBox(players[i].character.getHitBox(), players[i].character.flipped);
        var trueHit2 = trueBox(players[1-i].character.getHitBox(), players[1-i].character.flipped);
        if ((trueHit1.x1 < 0 && players[i].character.movement < 0) ||
            (trueHit1.x2 > br.x+br.w && players[i].character.movement > 0)) {
            players[i].character.movement = 0;
        }
        
        players[i].character.drawSprite(players[i].ctx, br.x, br.y);
        ctx.drawImage(players[i].canvas, 0, 0);
        players[i].character.nextAnimation();
    }
    
    // calculate hits
    for (var i = 0; i < players.length; i ++) {
        if (players[i].character.getHurtBox() !== null) {
            for (var j = 0; j < players.length; j++) {
                if (i == j) continue;
                var trueHurt = trueBox(players[i].character.getHurtBox(), players[i].character.flipped);
                var trueHit = trueBox(players[j].character.getHitBox(), players[j].character.flipped);
                if (boxesIntersect(trueHurt, trueHit)) {
                    if (players[j].character.isEvd()) {
                        console.log("EVD!");   
                    } else {
                        console.log("HIT! " + players[i].character.name +" EVISCERATES " + players[j].character.name+ "!");
                        document.getElementById('score'+i).innerHTML = eval(document.getElementById('score'+i).innerHTML) + 1;
                    }
                }
            }
        }
    }
}

function onKeyDown(event) {
    if (!players[0].isAI && players[0].character.currAnim == "none") { // no animation cancelling
        switch (event.keyCode) {
        case 87: players[0].character.currAnim = 'attack'; break; //q
        case 83: players[0].character.currAnim = 'dodge'; break; //s
        case 81: players[0].character.currAnim = 'crit'; break; //w
        case 65: players[0].character.movement = -players[0].character.spd; break; //a
        case 68: players[0].character.movement = players[0].character.spd; break; //d
        default: break;
        }
    }
    if (!players[1].isAI && players[1].character.currAnim == "none") { // no animation cancelling
        switch (event.keyCode) {
        case 73: players[1].character.currAnim = 'attack'; break; //i
        case 75: players[1].character.currAnim = 'dodge'; break; //k
        case 85: players[1].character.currAnim = 'crit'; break; //u
        case 74: players[1].character.movement = -players[1].character.spd; break; //j
        case 76: players[1].character.movement = players[1].character.spd; break; //l
        default: break;
        }
    }
}

function onKeyUp(event) {
    if (!players[0].isAI) {
        switch (event.keyCode) {
        case 65: players[0].character.movement = 0; break; //a
        case 68: players[0].character.movement = 0; break; //d
        default: break;
        }
    }
    
    if (!players[1].isAI) {
        switch (event.keyCode) {
        case 74: players[1].character.movement = 0; break; //j
        case 76: players[1].character.movement = 0; break; //l
        default: break;
        }
    }
}

/*
 * Returns the true scaled hitbox (including frame recentering)
 * Takes in an {x1, y1, x2, y2} tuple
 */
function trueBox(box, flipped) {
    if (flipped) {
        return {
            x1: br.w - box.x2,
            y1: br.y + box.y1,
            x2: br.w - box.x1,
            y2: br.y + box.y2
        }
    } else {
        return {
            x1: br.x + box.x1,
            y1: br.y + box.y1,
            x2: br.x + box.x2,
            y2: br.y + box.y2
        }
    }
}

/*
 * Returns true if the two {x1, y1, x2, y2} boxes intersect
 */
function boxesIntersect(b1, b2) {
    return !(b2.x1 > b1.x2 || 
            b2.x2 < b1.x1 ||
            b2.y1 > b1.y2 ||
            b2.y2 < b1.y1)
}

/*
 * Clears a context fully, ignoring transformations
 */
function clearContext(ctx, w, h) { 
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.restore();
}