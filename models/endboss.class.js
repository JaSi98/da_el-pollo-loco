/**
 * @class
 * @classdesc Represents the end boss in the game.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    height = 600;
    width = 375;
    y = 68;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    hurt_sound = new Audio('audio/endbosshurt.wav');
    deadPlay = false;
    attacking = false;
    energy = 300;
    firstView = true;
    triggerX = 5100;
    final = true;
    forceCount = 0;
    speed = 3;
    walking = false;
    walkTargetX = 0;
    homeX = null;
    attackId = null;
    forceId = null;
    spawnBottlesId = null;

    /**
     * @constructor
     * Constructs an end boss with given properties.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ATTACK);
        this.x = 6000;
        this.animate();
        this.walk();
    }

    /**
     * Handle the end boss being beaten: it gets tired, not killed.
     */
    handleDeath() {
        this.playAnimation(this.IMAGES_HURT);
        if (this.deadPlay == false) {
            this.deadPlay = true;
            window.clearInterval(this.attackId);
            window.clearInterval(this.forceId);
            window.clearInterval(this.spawnBottlesId);
            fadeOut(background_music, 200, function () {
                // When the fade out is finished, change the audio file and fade it in again
                changeAudioFileAndFadeIn(background_music, 'audio/win.wav', false, 2000);
            });
            if (this.final) {
                startEnding(this);
            } else {
                this.remove(this);
                startTransition(this);
            }
        }
    }

    /**
     * Animates the end boss.
     */
    animate() {
        let i = 0;
        setStoppableInterval(() => this.endbossPlay(i), 150);
    }

    /**
     * Continuously moves the end boss towards its current walk target.
     */
    walk() {
        setStoppableInterval(() => this.moveStep(), 1000 / 60);
    }

    /**
     * Performs one smooth movement step towards the walk target.
     */
    moveStep() {
        if (this.walking) {
            if (Math.abs(this.x - this.walkTargetX) > this.speed) {
                if (this.x < this.walkTargetX) {
                    this.moveRight();
                } else {
                    this.moveLeft();
                }
            } else {
                this.x = this.walkTargetX;
                this.walking = false;
            }
        }
    }

    /**
     * Specifies the attack time of the end boss.
     */
    attack() {
        this.attackId = setStoppableInterval(() => this.attackNow(), (Math.random() * 2000) + 1000);
        this.forceId = setStoppableInterval(() => this.force(), 6000);
        this.spawnBottlesId = setStoppableInterval(() => this.spawnBottles(), 10000);
        this.attacking = false;
    }

    /**
     * Monitor the states of the end boss.
     * @param {number} i - An index for image selection.
     */
    endbossPlay(i) {
        if (this.isDead()) {
            this.handleDeath();
        } else if (this.isHurt()) {
            this.handleHurt();
        } else {
            this.handleStart(i);
        }
    }

    /**
     * Make the end boss attack.
     */
    attackNow() {
        this.attacking = true;
        if (this.homeX === null) {
            this.homeX = this.x;
        }
        const direction = Math.random() < 0.5 ? -1 : 1;
        const potentialNewPosition = this.x + (300 * direction);
        this.playAnimation(this.IMAGES_ATTACK);

        // Move the chicken only if it stays within its fighting area
        if (potentialNewPosition >= this.homeX - 450 && potentialNewPosition <= this.homeX + 450) {
            this.walkTargetX = potentialNewPosition;
            this.walking = true;
        }
    }

    /**
     * Spawn chicken as the attack of the end boss.
     */
    force() {
        if (this.forceCount < 6) {
            world.level.enemies.push(new Chicken(this.x), new Chicken(this.x), new Chicken(this.x));
            this.forceCount++;
        }
    }

    /**
     * Spawn a new bottle to pick up while the fight is going on.
     */
    spawnBottles() {
        world.level.bottles.push(new bottle(world.character.x + 200 + Math.random() * 400, 450 - Math.random() * 300));
    }

    /**
     * Shows the boss-intro cutscene, which then starts the actual attack.
     * @param {number} i - An index for image selection.
     */
    startAnimation(i) {
        i = 0;
        this.firstView = false;
        startBossIntro(this);
    }

    /**
     * On being hurt, play animation and sound.
     */
    handleHurt() {
        this.playAnimation(this.IMAGES_HURT);
        if (!mute) {
            this.hurt_sound.play();
        }
    }

    /**
     * Delay animate end boss attack, only after the character has arrived.
     * @param {number} i - An index for image selection.
     */
    handleStart(i) {
        if (i < 4) {
            this.playAnimation(this.IMAGES_WALKING);
        }
        i++;
        if (world.character.x > this.triggerX && this.firstView) {
            this.startAnimation(i);
        }
    }
}
