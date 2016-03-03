var Character = Class.extend({
    name: null, // text name
    spriteSheet: null, // image of sprite sheet 
    currAnim: "none", // current animation
    frameCount: 0, // current frame in animation
    flipped: false, // whether player is flipped (left -> right)
    movement: 0, // whether character is moving
    spd: 0, // movement speed of character
    pos: 0, // horizontal position of character
    sprites: {
        attack: new Array(),
        crit: new Array(),
        dodge: new Array(),
        none: new Array(),
    },
    offs: {}, // filled in from data
    
    
    init: function(name) {
        this.name = name;
        this.spriteSheet = new Image();
        this.spriteSheet.src = "assets/" + name + ".png";
        this.parseFrameData(characters[name]);
    },
    
    /*
     * Parses frame data from the "Character".js file and stores it in this object
     */
    parseFrameData: function(frameData) {
        var data = frameData.frames;
        for (var f in data) {
            var type = f.split('_')[0];
            var fnum = f.split('_')[1];
            this.sprites[type][fnum] = {
                x: data[f].frame.x,
                y: data[f].frame.y,
                w: data[f].frame.w,
                h: data[f].frame.h,
                dx: data[f].spriteSourceSize.x - (data[f].sourceSize.w - data[f].frame.w),
                dy: data[f].spriteSourceSize.y - (data[f].sourceSize.h - data[f].frame.h),
                evd: data[f].evd,
                hit: data[f].hit
            };
        }
        for (var o in frameData.offsets) {
            this.offs[o] = {
                x: frameData.offsets[o].x,
                y: frameData.offsets[o].y
            }
        }
        this.spd = frameData.spd;
    },
    
    /*
     * Prints out a sprite on a given canvas context with specified bottom right corner
     */
    drawSprite: function(context, cornX, cornY) {
        var sprite = this.sprites[this.currAnim][this.frameCount];
        context.drawImage(this.spriteSheet, sprite.x, sprite.y, sprite.w, sprite.h,
                        cornX-sprite.w+this.offs[this.currAnim].x+sprite.dx + this.pos, 
                        cornY-sprite.h+this.offs[this.currAnim].y+sprite.dy, sprite.w, sprite.h);
    },
    
    /*
     * Moves the current animation frame onto the next one
     */
    nextAnimation: function() {
        if (this.currAnim != "none") {
            this.frameCount ++;
            this.movement = 0;
        }
        if (this.frameCount >= this.sprites[this.currAnim].length) {
            this.currAnim = "none";
            this.frameCount = 0;
        }
        this.pos += (this.flipped) ? -this.movement : this.movement;
    },
    
    /*
     * Returns an {x1, y1, x2, y2} tuple with a hurtbox for the current attack
     * Returns null if not dealing damage
     * pls no rage it's so ugly
     */
    getHurtBox: function() {
        if (this.currFrame().hit == undefined) return null;
        return {
            x1: this.currFrame().dx - this.currFrame().w + this.offs[this.currAnim].x + this.currFrame().hit.x + this.pos,
            y1: this.currFrame().dy - this.currFrame().h + this.offs[this.currAnim].y + this.currFrame().hit.y,
            x2: this.currFrame().dx - this.currFrame().w + this.offs[this.currAnim].x + this.currFrame().hit.x + this.currFrame().hit.w + this.pos,
            y2: this.currFrame().dy - this.currFrame().h + this.offs[this.currAnim].y + this.currFrame().hit.y + this.currFrame().hit.h
        }
    },
    
    /*
     * Returns an {x1, y1, x2, y2} tuple with the character's current hitbox
     * Measured from the bottom right since that's where sprites are centered
     */
    getHitBox: function() {
        return {
            x1: this.currFrame().dx + this.offs[this.currAnim].x - this.currFrame().w + this.pos,
            y1: this.currFrame().dy + this.offs[this.currAnim].y - this.currFrame().h,
            x2: this.currFrame().dx + this.offs[this.currAnim].x + this.pos,
            y2: this.currFrame().dy + this.offs[this.currAnim].y
        }
    },
    
    /*
     * Returns if the current frame is an i-frame
     */
    isEvd: function() {
        return (this.currFrame().evd == true);
    },
    
    /*
     * Returns a direct link to the current frame. Shortcuts the ugly "this" references.
     */
    currFrame: function() {
        return this.sprites[this.currAnim][this.frameCount];
    }
})