/**
 * @class
 * @classdesc Represents a movable object in the game.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.5;
    otherDirection = false;
    speedY = 0;
    acceleration = 1.5;
    energy = 100;
    lastHit = 0;

    /**
     * Apply gravity to the object.
     */
    applyGravity() {
        setStoppableInterval(() => this.setPrefs(), 1000 / 60);
    }

    /**
     * Check if the object is above the ground and not touching it.
     * @returns {boolean} - true if the object is above the ground, false otherwise.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 330;
        }
    }

    /**
     * Check if an object is above another.
     * @param {number} x1 - The y-coordinate of the first object.
     * @param {number} x2 - The y-coordinate of the second object.
     * @returns {boolean} - true if the first object is above the second, false otherwise.
     */
    isAboveObj(x1, x2) {
        return x1 > x2;
    }

    /**
     * Check if the object is colliding with another.
     * @param {Object} mo - The other movable object.
     * @returns {boolean} - true if the objects are colliding, false otherwise.
     */
    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    // Standard offset for collision is 0
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    /**
     * Take damage / Subtract energy.
     * @param {number} damage - The amount of damage to take.
     */
    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Set damage status and protect from further damage for a second.
     * @returns {boolean} - true if the object is hurt, false otherwise.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 2;
    }

    /**
     * Check if the object is dead (energy = 0).
     * @returns {boolean} - true if the object is dead, false otherwise.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Animate images.
     * @param {Array} images - The images to animate.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Move the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Move the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Make the object jump.
     */
    jump() {
        this.speedY = 33;
    }

    /**
     * Collect items.
     */
    collect() {
        this.speedY = 30;
        this.applyGravity();
        this.y = 10000;
    }

    /**
     * Set gravity properties.
     */
    setPrefs() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }
}
