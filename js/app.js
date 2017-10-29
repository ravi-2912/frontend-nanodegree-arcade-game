
// Character superclass
var Character = function(sprite, vel = 50, row = 1, col = 1) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.sprite = sprite;
    this.vel = vel;
    this.col = col;
    this.row = row;
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 + 60;
};

// Update the character's position, required method for game
// Parameter: dt, a time delta between ticks
Character.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if((this.x) < ctx.canvas.width) {
        this.x += this.vel * dt;
    }
    else {
        this.x = -101;
    }
    
};

// Draw the character on the screen, required method for game
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// Enemies our player must avoid
var Player = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Character.call(this, "images/char-boy.png", 4, 5, 3);
};

// Map Character prototypes to Player
Player.prototype = Object.create(Character.prototype);
// Define the constructor Player
Player.prototype.constructor = Player;
// Handle user keyboard input to move the player
Player.prototype.handleInput = function (keyCode) {
    switch(keyCode) {
        case "left":
            this.col--;
            break;
        case "right":
            this.col++;
            break;
        case "up":
            this.row--;
            break;
        case "down":
            this.row++;
            break;
    }
};
// Update the players's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var new_x   = (this.col - 1) * 101,
        new_y   = (this.row - 1) * 83 + 60;

    if (this.col <= 5 && this.col >= 1) {
        this.x += (new_x - this.x) * dt * this.vel;
    }
    if (this.row <= 6 && this.row >= 1) {
        this.y += (new_y - this.y) * dt * this.vel;
    }
};


// Enemies our player must avoid
var Enemy = function(vel = 100, row = 1) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Character.call(this, "images/enemy-bug.png", vel, row, -1);
};

// Map Character prototypes to Enemy
Enemy.prototype = Object.create(Character.prototype);
// Enemy constructor definition
Enemy.prototype.constructor = Enemy;


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(300, 1), new Enemy(150, 2), new Enemy(200, 3)];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
