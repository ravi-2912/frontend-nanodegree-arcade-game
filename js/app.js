/**
* @description Game character superclass
* @constructor
* @param {string} sprite - Display image
* @param {number} vel - Movement velocity
* @param {number} row - Row location
* @param {number} col - Column location
*/
var Character = function (sprite, vel, row, col) {
    this.sprite = sprite;
    this.vel = vel;
    this.col = col;
    this.row = row;
    this.x = (this.col - 1) * 101;
    this.y = (this.row - 1) * 83 - 20;
};

/**
* @description Update the character's position, required method for game
* @param {number} dt - A time delta between ticks
*/
Character.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < ctx.canvas.width) {
        this.x += this.vel * dt;
    } else {
        // once the enemy is out of screen reset its position
        this.x = -101;
    }
};

/**
* @description Draw the character on the screen, required method for game
*/
Character.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
* @description Player subclass derived from Character
* @constructor
*/
var Player = function () {
    // Player levels - 0, 1, 2, 3, 4
    this.level = 0;
    // Check is player is levelled up
    this.level_up = false;
    // Store when player is levelled up
    this.level_time = Date.now();
    // Player sprites based on levels
    this.sprite_imgs = ["images/char-boy.png", "images/char-cat-girl.png", "images/char-horn-girl.png", 
                        "images/char-pink-girl.png", "images/char-princess-girl.png"];
    Character.call(this, this.sprite_imgs[this.level], 4, 6, 3);
    this.y = (this.row - 1) * 83 - 20;
    // Player life
    this.life = 3;
    // Player score
    this.score = 0;    
    // sign for increasing or decreasing alpha channel while rendering for Selector.png
    this.sign = -1;
    // Display alpha for Selector.png
    this.selector_alpha = 1;
};

// Map Character prototypes to Player
Player.prototype = Object.create(Character.prototype);
// Define the constructor Player
Player.prototype.constructor = Player;
/**
 * @description Handle user keyboard input to move the player
 * @param {string} keyCode - User key press
 */ 
Player.prototype.handleInput = function (keyCode) {
    // Udated the location (row, column) fpr the player, 
    // check if location update results in going outside canvas,
    // and fire the playerLocationChanged event.
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

/**
 * @description Update the players's position, required method for game
 * @param {number} dt - A time delta between ticks
 */
Player.prototype.update = function (dt) {
    // Compute new postion
    var new_x = (this.col - 1) * 101,
        new_y = (this.row - 1) * 83 - 20;
    
    // Animate to new position from existing
    this.x += (new_x - this.x) * dt * this.vel;
    this.y += (new_y - this.y) * dt * this.vel;

    // Check if player level is up, and assign level basedon score,
    // store time when player is levelled up for further animation.
    // TODO: Check if code can be refactored using events for level up.
    if (!this.level_up) {
        if (this.score > 10 && this.level < 1) {
            this.level = 1;
            this.level_up = true;
            this.level_time = Date.now();
        }
        if (this.score > 20 && this.level < 2) {
            this.level = 2;
            this.level_up = true;
            this.level_time = Date.now();
        }
        if (this.score > 30 && this.level < 3) {
            this.level = 3;
            this.level_up = true;
            this.level_time = Date.now();
        }
        if (this.score > 40 && this.level < 4) {
            this.level = 4;
            this.level_up = true;
            this.level_time = Date.now();
        }
        // Update sprite based on level
        this.sprite = this.sprite_imgs[this.level];
    }
};

/**
 * @description Reset player position 
 */
Player.prototype.reset = function () {
    this.col = 3;
    this.row = 6;
};

/**
 * @description Reset player position if collide with enemy and decrease life
 */
Player.prototype.die = function () {
    this.reset();
    this.life--;
};

/**
 * @description Bring up game over screen
 */
Player.prototype.gameOver = function () {
    // Remove player input event
    document.removeEventListener("keyup", playerInputEvent);
    // Show game over screen
    document.getElementsByClassName("game-over")[0].style.display = "block";
    // Set timer to zero
    timeText.timeLeft = 0;
};

/**
 * @description Render player, player life, score, and level-up animation
 */
Player.prototype.render = function () {
    // check id level is up.
    if (this.level_up) {
        // Calculate time from level up is done
        var dt = Date.now() - this.level_time;

        // Adjust sign to positive or negative which will help in modifying 
        // the Selector.png alpha channel while rendering
        if (this.selector_alpha <= 0.2) {
            // Sign to increase the alpha
            this.sign = 1;
        }
        if (this.selector_alpha >= 1) {
            // Sign to decrease the alpha
            this.sign = -1;
        }

        // Modify alpha based on sign change above and render
        this.selector_alpha += this.sign * (1 / 5000) * (dt % 500);
        ctx.globalAlpha = this.selector_alpha;
        ctx.drawImage(Resources.get("images/Selector.png"), 200, 400);
        ctx.globalAlpha = 1;
        
        // Reset location
        this.reset();

        // Wait for 2 seconds
        if (dt > 2000) {
            // Level up process finished, and now time to get 
            // out of the parent if scope
            this.level_up = false;
            // Add score and time (because of reset)
            this.score += this.level;
            timeText.timeLeft += 2;
        }
        // TODO: When level up, stop enemy, show selector at player location, add one life.
    }

    // Call superclass method
    Character.prototype.render.call(this);

    // Render Heart.png using life left
    var img = Resources.get("images/Heart.png");
    for (var i = 0; i < this.life; i++) {        
        ctx.drawImage(img, 5 + 35 * i, -5, img.width * 0.35, img.height * 0.35);
    }

    // Render score star
    var img2 = Resources.get("images/Star.png");
    ctx.drawImage(img2, 350, -10, img2.width * 0.40, img2.height * 0.40);

    // Render score number
    ctx.fillStyle = "white";
    ctx.font = "42px Indie Flower";
    ctx.fillText(this.score.toString(), 400, 45);
};


/**
 * @description Class for Enemy, derived from Character, that Player must avoid
 * @constructor
 * @param {number} vel - Movement velocity
 * @param {number} row - Location row
 */
var Enemy = function (vel, row) {
    Character.call(this, "images/enemy-bug.png", vel, row, -1);
    this.timetoupdate = 10;
    // TODO: Enemy movement direction
};
var enemySpeeds = [100, 150, 200, 250];
var enemySpeedIncrements = [0, 5, 10, 15, 20];

// Map Character prototypes to Enemy
Enemy.prototype = Object.create(Character.prototype);
// Enemy constructor definition
Enemy.prototype.constructor = Enemy;

/**
 * @description Update function for enemies to change speed
 * @param {number} dt - A time delta between ticks
 */
Enemy.prototype.update = function (dt) {
    // Call base class metod
    Character.prototype.update.call(this, dt);

    // Update the time to left
    this.timetoupdate -= dt;
    if (this.timetoupdate <= 0) {
        // After passing ten seconds update speed
        this.timetoupdate = 10;
        var sp = getRandomInt(1, 100) % enemySpeeds.length;
        var inc = getRandomInt(1, 100) % enemySpeedIncrements.length;

        // increase the global speed array
        enemySpeeds[sp] += enemySpeedIncrements[inc];
        this.vel = enemySpeeds[sp];
    }

    // TODO: Change direction of enemies located in altenate rows.
    // TODO: When level up stop enemy.
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(200, 2), new Enemy(150, 3), new Enemy(200, 4), new Enemy(100, 5)];
var player = new Player();

/**
 * @description Event function for "keyup" event listener
 * @param {Object} e - Event object 
 */
function playerInputEvent(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    // Send keys to Player.handleInput()
    player.handleInput(allowedKeys[e.keyCode]);
}
// This listens for key presses and sends the keys to playerInputEvent() above.
document.addEventListener("keyup", playerInputEvent);

/**
 * @description Object to display time left on the canvas screen
 */
var timeText = {
    // Time left for game over
    timeLeft: 121,
    /**
     * @description Update the timeleft
     * @param {number} dt - A time delta between ticks
     */
    update: function (dt) {
        this.timeLeft -= dt;
    },
    /**
     * @description Render time text in mm:ss.
     */
    render: function () {
        ctx.fillStyle = "white";
        ctx.font = "32px Henny Penny";
        var minutes = Math.floor(this.timeLeft / 60);
        var seconds = Math.floor(this.timeLeft - minutes * 60);
        var displayTime = minutes.toString() + ":" + seconds.toString();
        ctx.fillText(displayTime.toString(), 215, 45);
    }
};

/**
 * @description Object to display collectible gems/star in the game
 */
var collectibles = {
    // List of available collectible sprites
    sprite: ["images/Gem Blue.png", "images/Gem Green.png", "images/Gem Orange.png"],
    // Select what gem to display
    selected_sprite: getRandomInt(1, 100) % 3,
    // Gem location
    location: [0, 0],    
    // Gem display flag
    display: false,    
    // Time elapsed after gem collectted
    time_elapsed: 0,    
    // Time to display next gem after collecting previous 
    timeToNextGem: getRandomInt(1, 100) % 7 + 2,
    // Gem collected flag
    collected: false,
    // Gem collected time
    collected_time: 0,
    // Sprite for star.png
    star_sprite: "images/Star.png",
    // Star collected flag
    star_collected: false,
    // Star lcoation (always in row 1 but varying column)
    star_loc: [1, getRandomInt(1, 100) % 5 + 1],
    // Star display flag
    star_display: true,
    // Star collection time
    star_collected_time: 0,
    /**
     * @description Render the gem/star on screen, animate the gem/star if collected
     */
    render: function () {
        var // Collectible gems img,  location and alpha
            img = Resources.get(this.sprite[this.selected_sprite]),
            x = (this.location[1] - 1) * 101 + 20,
            y = (this.location[0] - 1) * 83 + 23,
            alpha = 1,
            // Collectible star img, location, scale and alpha
            img_star = Resources.get(this.star_sprite),
            x_star = (this.star_loc[1] - 1) * 101 + 20,
            y_star = (this.star_loc[0] - 1) * 83 + 23,
            scale_star = 0.7, alpha_star = 1;

        // Conditon for gem to be displayed and collected
        if (this.display || this.collected) {
            // If gem is collected then fade it out slowly
            if (this.collected) {
                var dt = (Date.now() - this.collected_time);
                alpha -= 0.001 * dt;

                // If alpha reaches low enough then consider
                // gem is collected and hidden, then reset 
                if (alpha <= 0.01) {
                    alpha = 0;
                    this.display = this.collected = false;                    
                    //this.location = [0, 0];
                }
            }
            ctx.globalAlpha = alpha;
            ctx.drawImage(img, x, y, img.width * 0.6, img.height * 0.6);
            ctx.globalAlpha = 1.0;
        }

        // If star is collected then animate it to the score area
        if (this.star_display || this.star_collected) {
            //var alpha_star = 1;
            if (this.star_collected) {
                var dt_star = (Date.now() - this.star_collected_time);
                //alpha_star = 1.0; // - 0.001 * dt_star;

                // Manage the star movement velocity, its locations and sale
                var d = Math.sqrt(Math.pow(350 - x_star, 2) + Math.pow(-10 - y_star, 2));
                var v = d / 500,
                    vx = v * (350 - x_star) / d,
                    vy = v * (-10 - y_star) / d;
                x_star += vx * dt_star;
                y_star += vy * dt_star;
                scale_star += (0.4 - 0.7) * dt_star / 500;

                // If star scale is below threshold consider its collected and update
                // plater score, location and star properties.
                if (scale_star <= 0.41) {
                    // Update player score and reset it back to starting point
                    player.score++;
                    player.reset();                                    
                    // Set star flags and update column location
                    this.star_collected = false;
                    this.star_display = true;
                    this.star_loc[1] = getRandomInt(1, 100) % 5 + 1;  
                }
            }
            //ctx.globalAlpha = alpha_star;
            ctx.drawImage(img_star, x_star, y_star, img_star.width * scale_star, img_star.height * scale_star);
            //ctx.globalAlpha = 1.0;
        }
    },
    /**
     * @description Update time for gem display
     */
    update: function (dt) {
        // Update time elapsed
        this.time_elapsed += dt;
        //this.checkCollected(dt);
        // Check if alloted time has elapsed for next gem and that the display flag is set to false
        if (this.time_elapsed > this.timeToNextGem && !this.display) {
            this.display = true;

            // Random gem type and location
            this.selected_sprite = getRandomInt(1, 100) % 3;
            this.location = [getRandomInt(1, 100) % 4 + 2, getRandomInt(1, 100) % 4 + 2];
        }
    },
    // TODO: remove function below
    checkCollected: function (dt) {
        /*if (player.row === this.location[0] && player.col === this.location[1] && !this.collected) {
            this.display = false;
            player.score += this.selected_sprite + 2;
            this.time_elapsed = 0;
            this.timeToNextGem = getRandomInt(1, 100) % 7 + 2;
            this.collected = true;
            this.t_stop = Date.now();
        }*/
    }
};

// TODO: Implement blockers
var blockers = {
    level: 1,
    number: getRandomInt(1, 100) % (player.level + 1),
    sprite: "images/stone-block.png",
    // TODO: write code for stone blocks to appear and manage player movement
};

/**
 * @description Generate random n=integer between min (inclusive) and max (exclusive)
 * @param {number} min - Minimum number (inclusive)
 * @param {number} max - Maximum numner (exlusive)
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; 
}

// Custom event for player location changed
var playerEvent = new CustomEvent("playerLocationChanged", {
    // bubble up to the DOM tree
    bubbles: true
});

/**
 * @description Event listener for player loction changed
 */
document.addEventListener("playerLocationChanged", function (evt) {
    // Check if player location coincides with star location
    if (player.col === collectibles.star_loc[1] && player.row === collectibles.star_loc[0]) {
        // update flags
        collectibles.star_display = false;
        collectibles.star_collected = true;

        // store time when star is collected
        collectibles.star_collected_time = Date.now();
    }

    // Check if player location coincides with gem location
    if (player.row === collectibles.location[0] && player.col === collectibles.location[1] ) {//&& !this.collected) {
        // Update player score
        player.score += collectibles.selected_sprite + 2;

        // set flags
        collectibles.display = false;
        collectibles.collected = true;
        
        // set time
        collectibles.time_elapsed = 0;
        collectibles.collected_time = Date.now();
        collectibles.timeToNextGem = getRandomInt(1, 100) % 7 + 2;  
        
    }
});

/**
 * @description Restart game by resetting game variables
 */
function restartGame() {
    // reset player data
    player.life = 3;
    player.level = 0;
    player.score = 0;
    player.reset();

    // reset game data
    document.addEventListener("keyup", playerInputEvent);
    document.getElementsByClassName("game-over")[0].style.display = "none";
    timeText.timeLeft = 120;

    // Reset enemy data
    enemySpeeds = [150, 200, 250, 300];
    allEnemies.forEach(function (enemy) {
        enemy.col = -1;
        enemy.vel = enemySpeeds[getRandomInt(1, 100) % enemySpeeds.length];
        enemy.timetoupdate = 10;
    });
}

// TODO: Implement reset routines for all.
// TODO: Game pause.