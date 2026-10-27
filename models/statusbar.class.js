/**
 * @class
 * @classdesc Represents a status bar in the game.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    percentage = 100;

    /**
     * @constructor
     * Constructs a status bar for health display.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 15;
        this.y = 0;
        this.width = 300;
        this.height = 90;
        this.setPercentage(100);
    }

    /**
     * Sets the fill based on the character's energy.
     * @param {number} percentage - The percentage of energy.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.getImgIndex(percentage)];
        this.img = this.imageCache[path];
    }
}
