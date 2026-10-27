/**
 * @class
 * @classdesc Represents a cloud in the game.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    y = 30;
    width = 750;
    height = 375;

    /**
     * @constructor
     * Constructs a cloud at a random or specified location.
     * @param {number} x - The x-coordinate of the cloud.
     */
    constructor(x) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        if (x) {
            this.x = x;
        } else {
            this.x = Math.random() * 750;
        }
        this.animate();
    }

    /**
     * Animate the cloud.
     */
    animate() {
        this.moveLeft();
    }
}
