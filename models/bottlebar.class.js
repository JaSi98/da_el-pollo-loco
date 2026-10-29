/**
 * @class
 * @classdesc Represents a bottle bar in the game.
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    percentage = 0;

    /**
     * @constructor
     * Constructs a status bar for bottle display.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 290;
        this.y = 0;
        this.width = 260;
        this.height = 78;
        this.setPercentage(0);
    }

    /**
     * Updates the fill level based on the character's bottle inventory.
     * @param {number} percentage - The percentage of bottles.
     */
    setPercentage(percentage) {
        this.percentage = Number(percentage) * 10;
        let path = this.IMAGES[this.getImgIndex(this.percentage)];
        this.img = this.imageCache[path];
    }
}
