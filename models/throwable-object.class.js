/**
 * @class
 * @classdesc Represents a throwable object in the game.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    throw_sound = new Audio('audio/throw.mp3')
    thrown = false;
    rotation = 0;

    IMAGES_THROW = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png'
    ];

    /**
     * @constructor
     * @param {Object} character - The character that throws the object.
     * @param {number} x - The x position of the object.
     * @param {number} y - The y position of the object.
     * @param {boolean} shouldThrow - Whether the object should be thrown.
     * @param {boolean} otherDirection - The direction to throw the object.
     */
    constructor(character, x, y, shouldThrow = false, otherDirection = false) {
        super().loadImage('img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 150;
        this.width = 150;
        this.loadImages(this.IMAGES_THROW);
        this.loadImages(this.IMAGES_SPLASH);
        if (shouldThrow) {
            this.throw(otherDirection);
            this.animate();
        }
    }

    /**
     * Animates the throw of the object.
     */
    animate() {
        setStoppableInterval(() => this.playAnimation(this.IMAGES_THROW), 60);
    }

    /**
     * Animates the splash of the object.
     */
    animateSplash() {
        setStoppableInterval(() => this.playAnimation(this.IMAGES_SPLASH), 100);
    }

    /**
     * Defines the throw path of the object.
     * @param {boolean} otherDirection - The direction to throw the object.
     */
    throw(otherDirection) {
        this.thrown = true;
        if (!mute) {
            this.throw_sound.play();
        }
        this.speedY = 30;
        this.applyGravity();
        if (otherDirection) {
            setStoppableInterval(() => { this.x += -15; }, 25);
            setStoppableInterval(() => { this.rotation -= 0.6; }, 25);
        }
        else {
            setStoppableInterval(() => { this.x += 15; }, 25);
            setStoppableInterval(() => { this.rotation += 0.6; }, 25);
        }
    }
}
