/**
 * @class
 * @classdesc Represents the main character in the game.
 * @extends MovableObject
 */
class Character extends MovableObject {
    y = 120;
    x = -300;
    height = 300;
    width = 150;
    speed = 4;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_SLEEPING = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    word;
    walking_sound = new Audio('audio/walking.mp3');
    jumping_sound = new Audio('audio/jump.wav');
    hurt_sound = new Audio('audio/hurt.wav');
    hurtPlay = false;
    dead_sound = new Audio('audio/dead.wav');
    deadPlay = false;
    avaliableCoins = [];
    avaliableBottles = [];
    maxBottles = 10;
    canBeHit = true;
    world_start_x = 0;
    not_walked = true;
    energy = 100;

    offset = {
        top: 180,
        left: 45,
        right: 45,
        bottom: 45
    }

    /**
     * @constructor
     * Constructs the main character.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEPING);
        this.applyGravity();
        this.animate();
    }

    /**
     * Animate and move the character.
     */
    animate() {
        setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
        setStoppableInterval(() => this.playCharacter(), 100);
    }

    /**
     * Move the character based on the pressed keys.
     */
    moveCharacter() {
        if (this.x > 300) {
            gameStarted = true;
        }
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.handleWalkRight();
        }
        if (this.world.keyboard.LEFT && this.x > this.world_start_x) {
            this.handleWalkLeft();
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.handleJump();
        }
        this.world.camera_x = -this.x + 150;
    }

    /**
     * Play the character based on its state.
     */
    playCharacter() {
        if (this.isDead()) {
            this.handleDeath();
        }
        else if (this.isHurt()) {
            this.handleHurt();
        }
        else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        }
        else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
        else if (this.not_walked == true) {
            this.playAnimation(this.IMAGES_SLEEPING);
        }
        else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }

    /**
     * Handle character's death: stop game, show game over screen.
     */
    handleDeath() {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.deadPlay == false) {
            this.deadPlay = true;
            if (!mute) {
                this.dead_sound.play();
            }
            fadeOut(background_music, 200, function () {
                changeAudioFileAndFadeIn(background_music, 'audio/loose.mp3', false, 2000);
            });
        }
        setTimeout(() => {
            let gameOverScreen = document.getElementById('gameOver');
            let button = document.getElementById('replay');
            gameOverScreen.classList.remove('d-none');
            button.classList.remove('d-none');
            stopGame();
        }, 1000);
    }

    /**
     * Handle character's injury: play hurt sound.
     */
    handleHurt() {
        this.playAnimation(this.IMAGES_HURT);
        if (this.hurtPlay == false) {
            this.hurtPlay = true;
            if (!mute) {
                this.hurt_sound.play();
            }
            setTimeout(() => {
                this.hurtPlay = false;
            }, 1000);
        }
    }

    /**
     * Handle character's walk to the right: play walking sound.
     */
    handleWalkRight() {
        if (this.not_walked) {
            if (!mute) {
                this.walking_sound.play();
            }
            fadeOut(background_music, 1, function () {
                changeAudioFileAndFadeIn(background_music, 'audio/background.mp3', true, 1);
            });
        }
        this.otherDirection = false;
        this.not_walked = false;
        this.moveRight();
        this.walking_sound.playbackRate = 3.0;
        if (!mute) {
            this.walking_sound.play();
        }
    }

    /**
     * Handle character's walk to the left: play walking sound.
     */
    handleWalkLeft() {
        this.otherDirection = true;
        this.not_walked = false;
        this.moveLeft();
        this.walking_sound.playbackRate = 3.0;
        if (!mute) {
            this.walking_sound.play();
        }
    }

    /**
     * Handle character's jump: play jumping sound.
     */
    handleJump() {
        this.jump();
        this.not_walked = false;
        if (!mute) {
            this.jumping_sound.play();
        }
    }
}
