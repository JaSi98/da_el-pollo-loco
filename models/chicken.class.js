/**
 * @class
 * @classdesc Represents a chicken in the game.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 510;
    height = 120;
    width = 120;
    energy = 25;
    walkID;
    moveID;
    defeated = false;
    flying = false;
    hurt_sound = new Audio('audio/chicken_hurt.mp4');

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }

    /**
     * @constructor
     * Constructs a chicken at a random or specified location.
     */
    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        if (x) {
            this.x = x;
        }
        else {
            this.x = 900 + Math.random() * 6000;
        }
        this.speed = 0.8 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    /**
     * Animate the chicken.
     */
    animate() {
        this.moveID = setStoppableInterval(() => this.moveChicken(), 1000 / 60);
        this.walkID = setStoppableInterval(() => this.playAnimation(this.IMAGES_WALKING), 100);
    }

    /**
     * Move the chicken automatically to the left as soon as the game starts.
     */
    moveChicken() {
        if (gameStarted) {
            if (this.isDead() && !this.defeated) {
                this.handleDefeat();
            }
            else if (this.isHurt() && !mute) {
                this.hurt_sound.play();
            }
            if (this.defeated) {
                this.x += this.speed;
                if (this.flying) {
                    this.y -= 4;
                }
                if (this.x > world.character.x + 1050 || this.y < -200) {
                    this.removeChicken();
                }
            }
            else if (this.x > 0) {
                this.moveLeft();
            }
            else {
                // Remove at coordinate X = 0
                this.removeChicken();
            }
        }
    }

    /**
     * Handle a defeated chicken: it gets scared off instead of dying.
     */
    handleDefeat() {
        this.defeated = true;
        this.otherDirection = true;
        this.speed = 7;
        this.flying = Math.random() < 0.4;
    }

    /**
     * Draws two flapping wings next to the chicken while it flies off.
     * @param {Object} ctx - The canvas context.
     */
    drawWings(ctx) {
        let flap = Math.sin(Date.now() / 45) * 0.5;
        let cy = this.y + this.height * 0.45;
        this.drawWing(ctx, this.x + this.width * 0.28, cy, -flap, -1);
        this.drawWing(ctx, this.x + this.width * 0.72, cy, flap, 1);
    }

    /**
     * Draws a single feather-shaped wing hinged at the given point.
     * @param {Object} ctx - The canvas context.
     * @param {number} x - The x position of the wing's hinge.
     * @param {number} y - The y position of the wing's hinge.
     * @param {number} angle - The current flap angle in radians.
     * @param {number} flip - -1 to mirror the wing shape, 1 to keep it as drawn.
     */
    drawWing(ctx, x, y, angle, flip) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(flip, 1);
        ctx.fillStyle = '#4a2f18';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(this.width * 0.35, -this.height * 0.05, this.width * 0.42, this.height * 0.22);
        ctx.quadraticCurveTo(this.width * 0.18, this.height * 0.2, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#2e1c0d';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.width * 0.08, this.height * 0.02);
        ctx.lineTo(this.width * 0.32, this.height * 0.14);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Removes the chicken from the map and the level's enemy array.
     */
    removeChicken() {
        this.remove(this);
        window.clearInterval(this.walkID);
        window.clearInterval(this.moveID);
        this.removeFromLevel();
    }

    /**
     * Removes the chicken from the level's enemy array.
     */
    removeFromLevel() {
        let index = world.level.enemies.indexOf(this);
        if (index > -1) {
            world.level.enemies.splice(index, 1);
        }
    }
}
