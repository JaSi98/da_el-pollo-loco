/**
 * @class
 * @classdesc Represents a drawable object in the game.
 */
class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    height = 150;
    width = 100;

    /**
     * Load image for the drawable object.
     * @param {string} path - The path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draw a hitbox for the drawable object.
     * @param {Object} ctx - The canvas context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof coin || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '0';
            ctx.strokeStyle = 'transparent';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Load images into an array for animation.
     * @param {Array} array - The array of image paths.
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draw the image on the canvas.
     * @param {Object} ctx - The canvas context.
     */
    draw(ctx) {
        if (this instanceof ThrowableObject) {
            let cx = this.x + this.width / 2;
            let cy = this.y + this.height / 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(this.rotation);
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else if (this instanceof Chicken && this.flying) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
            this.drawWings(ctx);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Remove objects after a second or immediately.
     * @param {Object} mo - The movable object.
     */
    remove(mo) {
        if (this instanceof coin || this instanceof bottle || this instanceof ThrowableObject) {
            mo.y = 10000;
        }
        else {
            setTimeout(() => {
                mo.y = 10000;
            }, 1000);
        }
    }

    /**
     * Set the image of the progress bars based on the variable height.
     * @param {number} percentage - The percentage of the progress bar.
     * @returns {number} - The index of the image to be used.
     */
    getImgIndex(percentage) {
        if (percentage > 100) {
            return 5;
        }
        if (percentage == 100) {
            return 5;
        }
        else if (percentage > 80) {
            return 4;
        }
        else if (percentage > 60) {
            return 3;
        }
        else if (percentage > 40) {
            return 2;
        }
        else if (percentage > 20) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
