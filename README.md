# Frogger Game :frog:
## frontend-nanodegree-arcade-game

Frogger arcade game developed in JavaScript (JS) using `requestAnimationFrame()`. Game is written in vanilla JS and make use of pseudoclassical classess for the payer and enemyies. Key game features are:

* Object oriented game characters i.e. Player and Enemies.
* Time based, limited player life and levelling up.
* Colission detection between enemies and player.
* Animation effects on player rewards.
* Player collectible Gems and Stars.

### How to play
* Use arrow keys :arrow_up::arrow_down::arrow_left::arrow_right: to move up, down, left and right to avoid enemies.
* Collect gems :gem: and stars :star: to increase your score.
* Aim to increase the total score.
* Finish the game within 2 minutes.

### Installation
Just download and open `index.html` in your browser. Make sure that the following file structure is in place:
```
.
├ css/
│   └ style.css
├ js/
│   ├ resources.js
│   ├ engine.js
│   └ app.js
├ images/
│   ├ char-boy.png
│   ├ char-cat-girl.png
│   ├ char-horn-girl.png
│   ├ char-pink-girl.png
│   ├ char-princess-girl.png
│   ├ enemy-bug.png
│   ├ Gem Blue.png
│   ├ Gem Green.png
│   ├ Gem Orange.png
│   ├ grass-block.png
│   ├ Heart.png
│   ├ Selector.png
│   ├ Sar.png
│   ├ stone-block.png
│   └ water-block.png
└ index.html
```
### TODO List (`app.js`)
- [ ] Line 131: Check if code can be refactored using events for level up.
- [ ] Line 224, 288: When level up, stop enemy, show selector at player location, add one life.
- [ ] Line 256, 287: Enemy movement direction in +ve and -ve X direction. Enemies in alternate rows to travel in opposite direction.
- [ ] Line 456, 461: Implement blockers such as stone and water puddle.
- [ ] Line 536: Implement reset routines for all objects.
- [ ] Line 537: Implement game pause.


#### Udacity's Project Note
Students should use this [rubric](https://review.udacity.com/#!/projects/2696458597/rubric) for self-checking their submission. Make sure the functions you write are **object-oriented** - either class functions (like Player and Enemy) or class prototype functions such as Enemy.prototype.checkCollisions, and that the keyword 'this' is used appropriately within your class and class prototype functions to refer to the object the function is called upon. Also be sure that the **readme.md** file is updated with your instructions on both how to 1. Run and 2. Play your arcade game.

For detailed instructions on how to get started, check out this [guide](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).
