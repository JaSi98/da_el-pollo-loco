/**
 * @class
 * @classdesc Represents a coin bar in the game.
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    percentage = 0;

    /**
     * @constructor
     * Constructs a status bar for coin display.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 565;
        this.y = 0;
        this.width = 260;
        this.height = 78;
        this.setPercentage(0);
    }

    /**
     * Sets the fill based on the character's coin inventory.
     * @param {number} percentage - The percentage of coins.
     */
    setPercentage(percentage) {
        this.percentage = Number(percentage) * 10;
        let path = this.IMAGES[this.getImgIndex(this.percentage)];
        this.img = this.imageCache[path];
    }
}
