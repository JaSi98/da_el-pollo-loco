/**
 * @class
 * @classdesc Represents the game world.
 */
class World {
    level = level1;
    character = new Character;
    endboss = new Endboss;
    endboss2 = new Endboss;
    level2Loaded = false;
    canvas;
    ctx;
    keyboard;
    camera_x = -150;
    backgroundObjectDistance = 0;
    statusbar = new StatusBar();
    coinbar = new CoinBar();
    bottlebar = new BottleBar();
    throwing = false;
    chickenScream = new Audio('audio/chicken_scream.mp4');

    /**
     * @constructor
     * @param {Object} canvas - The game canvas.
     * @param {Object} keyboard - The keyboard input.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.endboss.final = false;
        this.endboss2.x = 16500;
        this.endboss2.triggerX = 15600;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Switches from level 1 to level 2 once the first end boss is defeated.
     */
    loadLevel2() {
        if (!this.level2Loaded) {
            this.level2Loaded = true;
            this.level.enemies.forEach((enemy) => {
                window.clearInterval(enemy.moveID);
                window.clearInterval(enemy.walkID);
            });
            this.level = level2;
            fadeOut(background_music, 200, function () {
                changeAudioFileAndFadeIn(background_music, 'audio/background.mp3', true, 2000);
            });
        }
    }

    /**
     * Sets the game world for the character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Starts the game loop.
     */
    run() {
        setStoppableInterval(() => this.checkStatus(), 25);
        setStoppableInterval(() => this.playAmbientChickenSound(), 3500);
    }

    /**
     * Occasionally lets a random living chicken screech, louder the closer it is to Pepe.
     */
    playAmbientChickenSound() {
        if (gameStarted && !mute && Math.random() < 0.6) {
            let nearby = this.level.enemies.filter((enemy) => {
                return !enemy.defeated && Math.abs(enemy.x - this.character.x) < 1200;
            });
            if (nearby.length > 0) {
                let chicken = nearby[Math.floor(Math.random() * nearby.length)];
                let distance = Math.abs(chicken.x - this.character.x);
                this.chickenScream.volume = Math.max(0.15, 1 - distance / 1200);
                this.chickenScream.currentTime = 0;
                this.chickenScream.play();
            }
        }
    }

    /**
     * Checks for thrown objects.
     */
    checkThrowObjects() {
        if (!this.throwing && this.keyboard.D && this.character.avaliableBottles.length > 1) {
            let otherDirection;
            if (this.character.otherDirection) {
                otherDirection = true;
            } else {
                otherDirection = false;
            }
            this.throwBottle(otherDirection);
        } else if (!this.keyboard.D) {
            //Wenn die Flasche nicht geworfen wurde markieren
            this.throwing = false;
        }
    }

    /**
     * Throws a bottle.
     * @param {boolean} otherDirection - The direction to throw the bottle.
     */
    throwBottle(otherDirection) {
        let bottle = new ThrowableObject(this.character, this.character.x, this.character.y, true, otherDirection);
        this.level.bottles.push(bottle);
        this.level.throwableObjects.push(bottle);
        this.character.avaliableBottles.splice(1, 1);
        this.bottlebar.setPercentage(this.character.avaliableBottles.length);
        this.throwing = true;
    }

    /**
     * Checks for collisions.
     */
    checkCollision() {
        this.isCollidingAir();
        this.isCollidingEnemies();
        this.isCollidingEndboss();
        this.isCollidingThrow();
        this.isCollidingCoin();
        this.isCollidingBottle();
    }

    /**
     * Draws objects and world on the canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addItToMap();
        this.ctx.translate(-this.camera_x, 0);
        this.addFixedObj();
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);

        //Draw wird sobald es fertig ist immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Adds objects to the map.
     * @param {Array} objects - The objects to be added to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Adds a movable object to the map.
     * @param {Object} mo - The movable object.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips an image.
     * @param {Object} mo - The movable object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Flips an image back.
     * @param {Object} mo - The movable object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Checks status of collisions and thrown objects.
     */
    checkStatus() {
        this.checkCollision();
        this.checkThrowObjects();
    }

    /**
     * Checks and handles collision with bottles.
     */
    isCollidingBottle() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            let bottle = this.level.bottles[i];
            let isFull = this.character.avaliableBottles.length >= this.character.maxBottles;
            if (!bottle.thrown && !isFull && this.character.isColliding(bottle)) {
                bottle.remove(bottle);
                this.character.avaliableBottles.push('bottle');
                this.bottlebar.setPercentage(this.character.avaliableBottles.length);
                if (!mute) {
                    bottle.collect_sound.play();
                }
                this.level.bottles.splice(i, 1);
            }
        }
    }

    /**
     * Checks and handles collision with coins.
     */
    isCollidingCoin() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.character.avaliableCoins.push('coin');
                this.coinbar.setPercentage(this.character.avaliableCoins.length);
                coin.remove(coin);
                if (!mute) {
                    coin.collect_sound.play();
                }
            }
        });
    }

    /**
     * Checks and handles collision with thrown bottles.
     */
    isCollidingThrow() {
        this.level.throwableObjects.forEach((throwableObject) => {
            for (let i = 0; i < this.level.enemies.length; i++) {
                let enemy = this.level.enemies[i];

                if (enemy.isColliding(throwableObject)) {
                    enemy.hit(25);
                    throwableObject.animateSplash();
                    throwableObject.remove(throwableObject);
                }
            }
            [this.endboss, this.endboss2].forEach((boss) => {
                if (boss.isColliding(throwableObject) && !boss.isHurt()) {
                    boss.hit(25);
                    throwableObject.animateSplash();
                    throwableObject.remove(throwableObject);
                }
            });

            if (throwableObject.x < 80) {
                throwableObject.animateSplash();
                throwableObject.remove(throwableObject);
            }
        });
    }

    /**
     * Checks and handles collision between character and enemies.
     */
    isCollidingEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy)) {
                if (this.character.isAboveGround()) {
                    if (!this.character.isDead()) {
                        enemy.hit(25);
                        this.character.jump();
                    }
                } else {
                    if (!enemy.isDead() && !this.character.isHurt()) {
                        this.character.hit(5);
                    }
                }
                this.statusbar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Checks and handles collision between character and end boss.
     */
    isCollidingEndboss() {
        [this.endboss, this.endboss2].forEach((boss) => {
            if (this.character.isColliding(boss)) {
                if (this.character.isAboveGround()) {
                    if (!this.character.isDead() && !boss.isHurt()) {
                        boss.hit(5);
                        this.character.jump();
                    }
                } else {
                    if (!boss.isDead() && !this.character.isHurt()) {
                        this.character.hit(4);
                    }
                }
                this.statusbar.setPercentage(this.character.energy);
            }
        });
    }

    /**
     * Checks and handles collision in the air.
     */
    isCollidingAir() {
        [this.endboss, this.endboss2].forEach((boss) => {
            if (this.character.isColliding(boss)) {
                if (this.character.isAboveGround()) {
                    if (!this.character.isDead()) {
                        boss.hit(25);
                    }
                } else {
                    if (!boss.isDead() && !this.character.isHurt()) {
                        this.character.hit(1);
                    }
                }
            }
        });
    }

    /**
     * Adds fixed objects to the map.
     */
    addFixedObj() {
        // ------------ Space for fixed Objects ------------
        if (this.character.x > -25) {
            this.addToMap(this.statusbar);
            this.addToMap(this.coinbar);
            this.addToMap(this.bottlebar);
        }
        // -------------------------------------------------
    }

    /**
     * Adds more objects to the map.
     */
    addItToMap() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.endboss);
        this.addToMap(this.endboss2);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
    }
}
