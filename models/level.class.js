/**
 * @class
 * @classdesc Represents a game level.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    throwableObjects;
    level_end_x = 6750;

    /**
     * @constructor
     * @param {Array} enemies - The enemies in the level.
     * @param {Array} clouds - The clouds in the level.
     * @param {Array} backgroundObjects - The background objects in the level.
     * @param {Array} coins - The coins in the level.
     * @param {Array} bottles - The bottles in the level.
     * @param {Array} throwableObjects - The throwable objects in the level.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, throwableObjects) {
        this.bottles = bottles;
        this.throwableObjects = throwableObjects;
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.backgroundObjects = backgroundObjects;
    }
}
