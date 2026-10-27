/**
 * @class
 * @classdesc Represents a bottle in the game.
 * @extends ThrowableObject
 */
class bottle extends ThrowableObject {
    height = 150;
    width = 150;
    y = 480;

    throw_sound = new Audio('./audio/throw.mp3');
    collect_sound = new Audio('./audio/collectbottle.wav');

    /**
     * @constructor
     * Constructs a bottle at a random or specified location.
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        if (!x) {
            this.x = 600 + Math.random() * 3000;
            this.y = 450 - Math.random() * 300;
        }
        else {
            this.x = x;
            this.y = y;
        }
        this.animate();
    }

    /**
     * Gently sways the bottle from side to side while it lies on the ground.
     */
    animate() {
        setStoppableInterval(() => {
            this.rotation = Math.sin(Date.now() / 800) * 0.25;
        }, 50);
    }
}
