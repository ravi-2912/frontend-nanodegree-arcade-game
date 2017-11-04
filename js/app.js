// Character superclass
var Character = function (sprite, vel = 50, row = 1, col = 1) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.sprite = sprite;
    this.vel = vel;
    this.col = col;
    this.row = row;
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 20;
};

// Update the character's position, required method for game
// Parameter: dt, a time delta between ticks
Character.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if ((this.x) < ctx.canvas.width) {
        this.x += this.vel * dt;
    } else {
        this.x = -101;
    }
};

// Draw the character on the screen, required method for game
Character.prototype.render = function () {
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
    this.sprite_imgs = ["images/char-boy.png", "images/char-cat-girl.png", "images/char-horn-girl.png", "images/char-pink-girl.png", "images/char-princess-girl.png"];
    Character.call(this, this.sprite_imgs[this.level], 4, 6, 3);
    this.y = (this.row - 1) * 83 - 20;
    this.life = 3;
    this.life_sprite = "images/Heart.png";
    this.score = 0;
    this.level = 0;
    this.level_up = false;
    this.sign = -1;
    this.mult = 1;
    this.select_alpha = 1;
};

// Map Character prototypes to Player
Player.prototype = Object.create(Character.prototype);
// Define the constructor Player
Player.prototype.constructor = Player;
// Handle user keyboard input to move the player
Player.prototype.handleInput = function (keyCode) {
    switch (keyCode) {
        case "left":
            this.col--;
            if (this.col < 1) {
                this.col = 1;
            } else {
                document.dispatchEvent(playerEvent);
            }
            break;
        case "right":
            this.col++;
            if (this.col > 5) {
                this.col = 5;
            } else {
                document.dispatchEvent(playerEvent);
            }
            break;
        case "up":
            this.row--;
            if (this.row < 1) {
                this.row = 1;
            } else {
                document.dispatchEvent(playerEvent);
            }
            break;
        case "down":
            this.row++;
            if (this.row > 6) {
                this.row = 6;
            } else {
                document.dispatchEvent(playerEvent);
            }
            break;
    }
};
// Update the players's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var new_x = (this.col - 1) * 101,
        new_y = (this.row - 1) * 83 - 20;

    this.x += (new_x - this.x) * dt * this.vel;
    this.y += (new_y - this.y) * dt * this.vel;

    if (!this.level_up) {
        if (this.score > 5 && this.level < 1) {
            this.level = 1;
            this.level_up = true;
            this.level_time = Date.now();
        }
        if (this.score > 10 && this.level < 2) {
            this.level = 2;
            this.level_up = true;
            this.level_time = Date.now();
        }
        if (this.score > 20 && this.level < 3) {
            this.level = 3;
            this.level_up = true;
            this.level_time = Date.now();
        }
        if (this.score > 30 && this.level < 4) {
            this.level = 4;
            this.level_up = true;
            this.level_time = Date.now();
        }
        this.time = 0;
        this.sprite = this.sprite_imgs[this.level];
    }
};

// Reset player position 
Player.prototype.reset = function () {
    this.col = 3;
    this.row = 6;
};

// Reset player position if collide with enemy
Player.prototype.die = function () {
    this.col = 3;
    this.row = 6;
    this.life--;
};

Player.prototype.gameOver = function () {

};

Player.prototype.render = function () {

    if (this.level_up) {
        var dt = Date.now() - this.level_time;

        if (this.select_alpha <= 0.2) {
            this.sign = 1;
            this.mult = 0.2;
        }
        if (this.select_alpha >= 1) {
            this.sign = -1;
            this.mult = 1;
        }
        this.select_alpha += this.sign * (1 / 5000) * (dt % 500);
        ctx.globalAlpha = this.select_alpha;
        ctx.drawImage(Resources.get("images/Selector.png"), 200, 400);
        ctx.globalAlpha = 1;

        this.reset();
        collectibles.star_loc[0] = 1;
        if (dt > 2000) {
            this.level_up = false;
            this.score += this.level;
        }
    }
    Character.prototype.render.call(this);


    for (var i = 0; i < this.life; i++) {
        var img = Resources.get(this.life_sprite);
        ctx.drawImage(img, 5 + 35 * i, -5, img.width * 0.35, img.height * 0.35);
    }
    var img2 = Resources.get("images/Star.png");
    ctx.drawImage(img2, 350, -10, img2.width * 0.40, img2.height * 0.40);
    ctx.fillStyle = "white";
    ctx.font = "42px Indie Flower";
    ctx.fillText(this.score.toString(), 400, 45);
};


// Enemies our player must avoid
var Enemy = function (vel = 100, row = 1) {
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
var allEnemies = [new Enemy(100, 2), new Enemy(150, 3), new Enemy(200, 4)];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var timeText = {
    timeLeft: 120,
    update: function (dt) {
        this.timeLeft -= dt;
    },
    render: function () {
        ctx.fillStyle = "white";
        ctx.font = "32px Henny Penny";
        var minutes = Math.floor(this.timeLeft / 60);
        var seconds = Math.ceil(this.timeLeft - minutes * 60);
        var displayTime = minutes.toString() + ":" + seconds.toString();
        ctx.fillText(displayTime.toString(), 215, 45);
    }
};

var collectibles = {
    sprite: ["images/Gem Blue.png", "images/Gem Green.png", "images/Gem Orange.png", "images/Star.png"],
    selected_sprite: getRandomInt(1, 100) % 3,
    location: [0, 0],
    star_loc: [1, getRandomInt(1, 100) % 5 + 1],
    display: false,
    display_star: true,
    time_elapsed: 0,
    timeToNextGem: getRandomInt(1, 100) % 7 + 2,
    collected: false,
    star_collected: false,
    render: function () {
        var x = (this.location[1] - 1) * 101 + 20,
            y = (this.location[0] - 1) * 83 + 23,
            img = Resources.get(this.sprite[this.selected_sprite]),
            img_star = Resources.get(this.sprite[3]),
            x_star = (this.star_loc[1] - 1) * 101 + 20,
            y_star = (this.star_loc[0] - 1) * 83 + 23,
            scale_star = 0.7;

        if (this.display || this.collected) {
            var alpha = 1;
            if (this.collected) {
                var dt = (Date.now() - this.t_stop);
                alpha = 1.0 - 0.001 * dt;
                if (alpha <= 0.01) {
                    this.collected = false;
                    this.location = [0, 0];
                }
            }
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, x, y, img.width * 0.6, img.height * 0.6);
            ctx.globalAlpha = 1.0;
        }

        if (this.display_star || this.star_collected) {
            var alpha_star = 1;
            if (this.star_collected) {
                var dt_star = (Date.now() - this.t_star_stop);
                alpha_star = 1.0; // - 0.001 * dt_star;

                var d = Math.sqrt(Math.pow(350 - x_star, 2) + Math.pow(-10 - y_star, 2));
                var v = d / 500,
                    vx = v * (350 - x_star) / d,
                    vy = v * (-10 - y_star) / d;
                x_star += vx * dt_star;
                y_star += vy * dt_star;
                scale_star += (0.4 - 0.7) * dt_star / 500;

                if (scale_star <= 0.41) {
                    player.score++;
                    this.star_collected = false;
                    this.star_loc[1] = getRandomInt(1, 100) % 5 + 1;
                    if (this.star_loc[0] == 1) {
                        this.star_loc[0] = 6;
                    } else {
                        this.star_loc[0] = 1;
                    }
                    this.display_star = true;
                }
            }
            ctx.globalAlpha = alpha_star;
            ctx.drawImage(img_star, x_star, y_star, img_star.width * scale_star, img_star.height * scale_star);
            ctx.globalAlpha = 1.0;
        }
        //if(!player.finish) {
        //ctx.drawImage(img_star, x_star, y_star, img_star.width * 0.7, img_star.height * 0.7);
        //}
    },
    update: function (dt) {
        this.time_elapsed += dt;
        this.checkCollected(dt);
        if (this.time_elapsed > this.timeToNextGem && !this.display) {
            this.display = true;
            this.selected_sprite = getRandomInt(1, 100) % 3;
            this.location = [getRandomInt(1, 100) % 4 + 2, getRandomInt(1, 100) % 4 + 2];
            document.getElementById("gr").textContent = this.location[0];
            document.getElementById("gc").textContent = this.location[1];
        }
    },
    checkCollected: function (dt) {
        if (player.row === this.location[0] && player.col === this.location[1] && !this.collected) {
            this.display = false;
            player.score += this.selected_sprite + 2;
            this.time_elapsed = 0;
            this.timeToNextGem = getRandomInt(1, 100) % 7 + 2;
            this.collected = true;
            this.t_stop = Date.now();
        }
    }
};

var blockers = {
    level: 1,
    number: getRandomInt(1, 100) % (player.level + 1),
    sprite: ["images/stone-block.png", "images/water-block.png"]

};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var playerEvent = new CustomEvent("locationChanged", {
    bubbles: true
});


document.addEventListener("locationChanged", function (evt) {
    if (player.col === collectibles.star_loc[1] && player.row === collectibles.star_loc[0]) {

        //collectibles.star_loc[1] = getRandomInt(1,100)%5+1;
        collectibles.display_star = false;
        collectibles.star_collected = true;
        collectibles.t_star_stop = Date.now();
        /*if(collectibles.star_loc[0] == 1) {
            collectibles.star_loc[0] = 6;
        } else {
            collectibles.star_loc[0] = 1;
        }*/
        //player.reset();
    }
});