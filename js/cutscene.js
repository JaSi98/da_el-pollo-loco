/**
 * @file Draws standalone, animated story cutscenes on their own canvas, independent of the game canvas.
 * A cutscene is a list of "shots", one per dialogue line: each shot says which actors are
 * visible and where the camera looks. The render loop smoothly zooms and cross-fades between them.
 */

/** @type {HTMLCanvasElement} The dedicated canvas used only for cutscenes. */
let cutsceneCanvas;

/** @type {Object} The 2d context of the cutscene canvas. */
let cutsceneCtx;

/** @type {Object} Cache of sprite images reused across cutscenes. */
let cutsceneSprites = {};

/** @type {Object} The shot list and extras of the cutscene currently playing. */
let activeCutscene = null;

/** @type {Object} The shot the camera is currently animating towards. */
let currentShot = null;

/** @type {Object} The shot the camera is animating away from, used for the cross-fade. */
let previousShot = null;

/** @type {number} Progress from 0 to 1 of the transition into currentShot. */
let shotProgress = 1;

/** @type {number} The requestAnimationFrame id of the cutscene render loop. */
let cutsceneRafId = null;

/** @type {Audio} A soft whoosh played once when the intro camera zooms out. */
let cutsceneWhoosh = new Audio('audio/jump.wav');

/** @type {Audio} A confident cue for Pepe, reused so his sound isn't always the same one. */
let pepeCueThrow = new Audio('audio/throw.mp3');

const PEPE_LEFT = { x: 60, y: 100, w: 300, h: 600 };
const BOSS_RIGHT = { x: 620, y: 40, w: 400, h: 640 };
const FOCUS_LEFT = { focusX: 0.19, focusY: 0.55 };
const FOCUS_RIGHT = { focusX: 0.76, focusY: 0.47 };
const FOCUS_WIDE = { focusX: 0.5, focusY: 0.5 };

/**
 * Draws a cached sprite image onto the cutscene canvas. Redraws the current
 * shot once a not-yet-loaded image becomes ready, so nothing stays blank.
 * @param {Object} ctx - The cutscene canvas context.
 * @param {string} path - The path to the image.
 * @param {number} x - The x position to draw at.
 * @param {number} y - The y position to draw at.
 * @param {number} w - The width to draw at.
 * @param {number} h - The height to draw at.
 */
function drawCutsceneSprite(ctx, path, x, y, w, h) {
    if (!cutsceneSprites[path]) {
        let img = new Image();
        img.onload = () => renderCutsceneFrame(true);
        img.src = path;
        cutsceneSprites[path] = img;
    }
    ctx.drawImage(cutsceneSprites[path], x, y, w, h);
}

/**
 * Draws the shared desert sky and ground backdrop for every cutscene.
 * @param {Object} ctx - The cutscene canvas context.
 */
function drawCutsceneBackdrop(ctx) {
    let sky = ctx.createLinearGradient(0, 0, 0, 720);
    sky.addColorStop(0, '#3a6b8a');
    sky.addColorStop(0.6, '#e2a765');
    sky.addColorStop(1, '#c9793a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1080, 720);
    ctx.fillStyle = '#8a5a2c';
    ctx.fillRect(0, 610, 1080, 110);
    ctx.fillStyle = '#6e431c';
    ctx.fillRect(0, 610, 1080, 12);
}

/**
 * Draws a simple wooden chicken coop with a couple of chickens around it.
 * @param {Object} ctx - The cutscene canvas context.
 * @param {number} x - The left edge of the coop.
 * @param {number} groundY - The ground line the coop stands on.
 */
function drawCoop(ctx, x, groundY) {
    ctx.fillStyle = '#8a5a2c';
    ctx.fillRect(x, groundY - 260, 320, 260);
    ctx.fillStyle = '#5c3416';
    ctx.beginPath();
    ctx.moveTo(x - 30, groundY - 260);
    ctx.lineTo(x + 160, groundY - 370);
    ctx.lineTo(x + 350, groundY - 260);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#3d220c';
    ctx.lineWidth = 5;
    for (let i = 0; i <= 6; i++) {
        ctx.beginPath();
        ctx.moveTo(x + i * 53, groundY - 260);
        ctx.lineTo(x + i * 53, groundY);
        ctx.stroke();
    }
    ctx.fillStyle = '#2a160a';
    ctx.fillRect(x + 115, groundY - 150, 90, 150);
    drawCutsceneSprite(ctx, 'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png', x + 260, groundY - 95, 95, 95);
    drawCutsceneSprite(ctx, 'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png', x - 90, groundY - 80, 80, 80);
}

/**
 * Builds the intro cutscene: Pepe close up, then a zoom-out revealing the chicken coop.
 * @returns {Object} The cutscene definition with its shots.
 */
function buildIntroCutscene() {
    let pepeActor = { path: 'img/2_character_pepe/1_idle/idle/I-1.png', ...PEPE_LEFT };
    return {
        extra: (ctx) => drawCoop(ctx, 640, 610),
        shots: [
            { zoom: 1.6, ...FOCUS_LEFT, actors: [pepeActor] },
            { zoom: 1, ...FOCUS_WIDE, actors: [pepeActor], sound: cutsceneWhoosh }
        ]
    };
}

/**
 * Builds the cutscene shown right before a boss fight: the boss is hidden at
 * first, then fades into a close-up, before the camera pulls back to both actors.
 * @param {Endboss} boss - The boss about to fight.
 * @returns {Object} The cutscene definition with its shots.
 */
function buildBossIntroCutscene(boss) {
    let bossActor = { path: boss.IMAGES_ATTACK[0], ...BOSS_RIGHT };
    let pepeActor = { path: 'img/2_character_pepe/1_idle/idle/I-1.png', ...PEPE_LEFT };
    return {
        extra: (ctx) => {
            ctx.fillStyle = 'rgba(120, 20, 10, 0.3)';
            ctx.fillRect(0, 0, 1080, 720);
        },
        shots: [
            { zoom: 1, ...FOCUS_WIDE, actors: [] },
            { zoom: 1.3, ...FOCUS_RIGHT, actors: [bossActor], sound: boss.hurt_sound },
            { zoom: 1, ...FOCUS_WIDE, actors: [bossActor, pepeActor], sound: pepeCueThrow }
        ]
    };
}

/**
 * Builds the cutscene shown after the first boss is beaten.
 * @param {Endboss} boss - The beaten boss.
 * @returns {Object} The cutscene definition with its shots.
 */
function buildTransitionCutscene(boss) {
    let bossActor = { path: boss.IMAGES_HURT[0], ...BOSS_RIGHT };
    let pepeActor = { path: 'img/2_character_pepe/2_walk/W-23.png', ...PEPE_LEFT };
    return {
        shots: [
            { zoom: 1.3, ...FOCUS_RIGHT, actors: [bossActor], sound: boss.hurt_sound },
            { zoom: 1, ...FOCUS_WIDE, actors: [bossActor, pepeActor] },
            { zoom: 1.3, ...FOCUS_LEFT, actors: [pepeActor], sound: cutsceneWhoosh }
        ]
    };
}

/**
 * Builds the closing cutscene between Pepe and the last boss.
 * @param {Endboss} boss - The end boss taking part in the scene.
 * @returns {Object} The cutscene definition with its shots.
 */
function buildEndingCutscene(boss) {
    let bossActor = { path: boss.IMAGES_HURT[0], ...BOSS_RIGHT };
    let pepeActor = { path: 'img/2_character_pepe/1_idle/idle/I-1.png', ...PEPE_LEFT };
    return {
        shots: [
            { zoom: 1.3, ...FOCUS_LEFT, actors: [pepeActor], sound: pepeCueThrow },
            { zoom: 1.3, ...FOCUS_RIGHT, actors: [bossActor, pepeActor], sound: boss.hurt_sound },
            { zoom: 1.3, ...FOCUS_LEFT, actors: [bossActor, pepeActor], sound: cutsceneWhoosh },
            { zoom: 1, ...FOCUS_WIDE, actors: [bossActor, pepeActor] }
        ]
    };
}

/**
 * Linearly interpolates between two numbers.
 * @param {number} a - The start value.
 * @param {number} b - The end value.
 * @param {number} t - The progress from 0 to 1.
 * @returns {number} - The interpolated value.
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Points the camera at the given shot of the active cutscene and starts the transition.
 * @param {number} index - The index of the shot to move to.
 */
function setCutsceneShot(index) {
    if (!activeCutscene || !activeCutscene.shots[index]) {
        return;
    }
    previousShot = currentShot;
    currentShot = activeCutscene.shots[index];
    shotProgress = 0;
    if (!mute && currentShot.sound) {
        currentShot.sound.currentTime = 0;
        currentShot.sound.play();
    }
}

/**
 * Renders one frame of the active cutscene: eases the camera and cross-fades actors.
 * @param {boolean} redrawOnly - If true, only redraws the current frame without advancing.
 */
function renderCutsceneFrame(redrawOnly) {
    if (!activeCutscene || !currentShot || !cutsceneCanvas || cutsceneCanvas.classList.contains('d-none')) {
        cutsceneRafId = null;
        return;
    }
    if (!redrawOnly) {
        shotProgress = Math.min(1, shotProgress + 0.025);
    }
    let base = previousShot || currentShot;
    let zoom = lerp(base.zoom, currentShot.zoom, shotProgress);
    let focusX = lerp(base.focusX, currentShot.focusX, shotProgress);
    let focusY = lerp(base.focusY, currentShot.focusY, shotProgress);

    cutsceneCtx.clearRect(0, 0, 1080, 720);
    cutsceneCtx.save();
    cutsceneCtx.translate(1080 * focusX, 720 * focusY);
    cutsceneCtx.scale(zoom, zoom);
    cutsceneCtx.translate(-1080 * focusX, -720 * focusY);
    drawCutsceneBackdrop(cutsceneCtx);
    if (activeCutscene.extra) {
        activeCutscene.extra(cutsceneCtx);
    }
    if (previousShot && shotProgress < 1) {
        cutsceneCtx.globalAlpha = 1 - shotProgress;
        previousShot.actors.forEach((a) => drawCutsceneSprite(cutsceneCtx, a.path, a.x, a.y, a.w, a.h));
    }
    cutsceneCtx.globalAlpha = previousShot ? shotProgress : 1;
    currentShot.actors.forEach((a) => drawCutsceneSprite(cutsceneCtx, a.path, a.x, a.y, a.w, a.h));
    cutsceneCtx.globalAlpha = 1;
    cutsceneCtx.restore();

    if (!redrawOnly) {
        cutsceneRafId = requestAnimationFrame(() => renderCutsceneFrame(false));
    }
}

/**
 * Shows the cutscene canvas with the given cutscene and hides the game canvas.
 * @param {Object} cutscene - The cutscene definition built by one of the buildXCutscene functions.
 */
function showCutscene(cutscene) {
    if (!cutsceneCanvas) {
        cutsceneCanvas = document.getElementById('cutsceneCanvas');
        cutsceneCtx = cutsceneCanvas.getContext('2d');
    }
    activeCutscene = cutscene;
    previousShot = null;
    currentShot = null;
    shotProgress = 1;
    document.getElementById('canvas').classList.add('d-none');
    cutsceneCanvas.classList.remove('d-none');
    if (!cutsceneRafId) {
        cutsceneRafId = requestAnimationFrame(() => renderCutsceneFrame(false));
    }
}

/**
 * Hides the cutscene canvas, stops its render loop and shows the game canvas again.
 */
function hideCutscene() {
    activeCutscene = null;
    currentShot = null;
    previousShot = null;
    if (cutsceneRafId) {
        cancelAnimationFrame(cutsceneRafId);
        cutsceneRafId = null;
    }
    document.getElementById('canvas').classList.remove('d-none');
    if (cutsceneCanvas) {
        cutsceneCanvas.classList.add('d-none');
    }
}
