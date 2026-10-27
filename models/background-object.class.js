/**
 * @class
 * @classdesc Represents a background object in the game.
 * @extends MovableObject
 */
class BackgoundObject extends MovableObject {
    width = 1080;
    height = 720;

    /**
     * @constructor
     * Constructs a background object at a specified location.
     * @param {string} imagePath - The path to the image.
     * @param {number} x - The x-coordinate of the object.
     */
    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 720 - this.height;
    }
}
