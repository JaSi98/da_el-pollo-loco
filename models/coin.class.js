/**
 * @class
 * @classdesc Represents a coin in the game.
 * @extends MovableObject
 */
class coin extends MovableObject {
    height = 150;
    width = 150;
    y = 480;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    collect_sound = new Audio('audio/coincollect.wav')

    /**
     * @constructor
     * Constructs a coin at a random or specified location.
     */
    constructor(x, y) {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        if (x) {
            this.x = x;
            this.y = y;
        } else {
            this.x = 600 + Math.random() * 3000;
            this.y = 450 - Math.random() * 300;
        }
        this.animate();
    }

    /**
     * Animate the coin.
     */
    animate() {
        setStoppableInterval(() => this.playAnimation(this.IMAGES), 200);
    }
}
