/*
 * File for the AI and all related functions
 * v1.0 - rudimentary run around AI
 * TODO: make movement smarter
 */

/*
 * calculates what the AI does
 */
function runAI() {
    for (var i = 0; i < players.length; i++) {
        if (!players[i].isAI) continue;
        if (players[i].character.currAnim != "none") continue;
        
        // v 1.0 - rudimentary AI based on closeness to enemies
        var myBox = trueBox(players[i].character.getHitBox(), players[i].character.flipped);
        var urBox = trueBox(players[1-i].character.getHitBox(), players[1-i].character.flipped);
        var dir = (players[i].character.flipped) ? -1 : 1; // direction to run
        var dist = dir * (myBox.x1 - urBox.x1);
        if (dist < 0) { 
            // make a gap
            players[i].character.movement = dir * players[0].character.spd;
        } else if (dist > 80) { 
            // gap close
            players[i].character.movement = dir * -players[0].character.spd;
        } else if (players[1-i].character.currAnim == "crit") {
            // run tf away
            players[i].character.movement = dir * players[0].character.spd;
            // TODO: actually run 'tf' away, not just a bit
        } else if (players[1-i].character.currAnim == "attack") {
            // back off while waiting for dodge chance
            players[i].character.movement = dir * players[0].character.spd;
            // TODO: actually dodge
        } else {
            rn1 = Math.abs(Math.random() * dist); // actions change based on distance
            rn2 = Math.random() - 0.3;
            if (rn1 > 45) {
                // do nothing
            } else if (rn1 > 30) {
                // move randomly, basically.
                players[i].character.movement =  rn2/Math.abs(rn2) * players[0].character.spd
            } else if (rn1 > 15) {
                // slightly increased chance if closer
                players[i].character.currAnim = "attack";
            } else {
                // increased chance if closer
                players[i].character.currAnim = "crit";
            }
        }
    }
}