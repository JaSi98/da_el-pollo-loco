/**
 * @file This file initializes and runs the game.
 */

/** @type {Object} The canvas object on which the game is drawn. */
let canvas;

/** @type {World} The World object representing the game world. */
let world;

/** @type {Keyboard} The Keyboard object for handling keyboard input. */
let keyboard = new Keyboard();

/** @type {number[]} An array to keep track of setInterval IDs for clearing them later. */
let intervalIds = [];

/** @type {Audio} The audio object for the background music. */
let background_music = new Audio();
background_music.src = ('audio/background.mp3');
background_music.volume = 0.7;

/** @type {boolean} A flag indicating whether the audio is currently playing. */
let audioplaying;

/** @type {HTMLElement} The button to mute the audio. */
let muteBtn;

/** @type {HTMLElement} The button to un-mute the audio. */
let soundBtn;

/** @type {boolean} A flag indicating whether the audio is muted. */
let mute;

/** @type {boolean} A flag indicating whether the game has started. */
let gameStarted = false;

/** @type {HTMLElement} The notice element to display messages. */
let notice;

/** @type {boolean} A flag indicating whether a dialogue is currently shown. */
let dialogueActive = false;

/** @type {number} The index of the currently shown dialogue line. */
let dialogueIndex = 0;

/** @type {string[]} The lines of the dialogue currently playing. */
let dialogueLines = [];

/** @type {Function} Called once the current dialogue has finished. */
let dialogueOnFinish = null;

/** @type {Audio} A short blip sound played whenever a new dialogue line appears. */
let dialogueBlip = new Audio('audio/coincollect.wav');

/** @type {string[]} The intro dialogue shown right at the start of the game. */
let introLines = [
    'Pepe: Wieder mal Ärger im Hühnerstall... diesmal räum ich richtig auf!',
    'Erzähler: Doch Pepe ahnt noch nicht, wie diese Geschichte wirklich endet...'
];

/** @type {string[]} Shown right before the first end boss fight begins. */
let bossIntroLines1 = [
    'Erzähler: Am Ende der Schlucht wartet der Anführer der Hühner...',
    'Hühner-Boss: Wer wagt es, mein Revier zu betreten?!',
    'Pepe: Ich. Und ich hab Hunger auf Ärger!'
];

/** @type {string[]} Shown right before the final end boss fight begins. */
let bossIntroLines2 = [
    'Erzähler: Tief in der Wüste erhebt sich das Ur-Huhn...',
    'Ur-Huhn: Du hast meine Kinder verjagt. Jetzt zahlst du dafür!',
    'Pepe: Los geht\'s. Letzte Runde!'
];

/** @type {string[]} The dialogue shown after the first end boss is beaten. */
let transitionLines = [
    'Hühner-Boss: Du bist stark, Pepe... aber das war erst der Anfang!',
    'Pepe: Dann zeig mir, was noch kommt.',
    'Erzähler: Die Wüste wird noch heißer...'
];

/** @type {string[]} The closing dialogue between Pepe and the chickens. */
let endingLines = [
    'Pepe: Genug gekämpft, Amigos. Ich will keinen Ärger mehr.',
    'Hühner: Wir auch nicht, Pepe. Wir hatten nur Hunger auf deine Salsa!',
    'Pepe: Dann lasst uns lieber zusammen feiern statt kämpfen.',
    'Hühner: Abgemacht! Auf gute Nachbarschaft, El Pollo Loco!'
];

/**
 * Check if the last setting was mute.
 */
if (localStorage.getItem('mute') === 'true') {
    mute = true;
    audioplaying = false;
} else {
    mute = false;
    audioplaying = true;
}

/**
 * Initialize the game world. Playback of sound only starts once the player
 * clicks the play button, since browsers block audio without that click.
 */
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    resizeCanvas();
}

/**
 * Hides the start screen and begins the game, triggered by the play button click.
 */
function startGame() {
    document.getElementById('startScreen').classList.add('d-none');
    if (!mute) {
        background_music.play().catch(() => {
        });
    }
    startIntro();
}

/**
 * Event listener for key presses.
 * @param {Event} e The event object.
 */
window.addEventListener('keydown', (e) => {
    if (dialogueActive) {
        if (e.keyCode === 32) {
            advanceDialogue();
        }
        return;
    }
    switch (e.keyCode) {
        case 32:
            keyboard.SPACE = true;
            break;
        case 39:
            keyboard.RIGHT = true;
            break;
        case 37:
            keyboard.LEFT = true;
            break;
        case 38:
            keyboard.UP = true;
            break;
        case 40:
            keyboard.DOWN = true;
            break;
        case 68:
            keyboard.D = true;
            break;
    }
});

/**
 * Event listener for key release.
 * @param {Event} e The event object.
 */
window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
        case 32:
            keyboard.SPACE = false;
            break;
        case 39:
            keyboard.RIGHT = false;
            break;
        case 37:
            keyboard.LEFT = false;
            break;
        case 38:
            keyboard.UP = false;
            break;
        case 40:
            keyboard.DOWN = false;
            break;
        case 68:
            keyboard.D = false;
            break;
    }
});

/**
 * Event listener for touching the touch buttons.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button-space').addEventListener('touchstart', function () {
        keyboard.SPACE = true;
    });
    document.getElementById('button-space').addEventListener('touchend', function () {
        keyboard.SPACE = false;
    });

    document.getElementById('button-right').addEventListener('touchstart', function () {
        keyboard.RIGHT = true;
    });
    document.getElementById('button-right').addEventListener('touchend', function () {
        keyboard.RIGHT = false;
    });

    document.getElementById('button-left').addEventListener('touchstart', function () {
        keyboard.LEFT = true;
    });
    document.getElementById('button-left').addEventListener('touchend', function () {
        keyboard.LEFT = false;
    });

    document.getElementById('button-d').addEventListener('touchstart', function () {
        keyboard.D = true;
    });
    document.getElementById('button-d').addEventListener('touchend', function () {
        keyboard.D = false;
    });
});

/**
 * Function to set an interval that can be stopped later.
 * @param {Function} fn The function to be called every interval.
 * @param {number} time The time in milliseconds between each call to the function.
 * @return {number} The ID of the interval.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
    return id;
}

/**
 * Function to stop all intervals and the game.
 */
function stopGame() {
    intervalIds.forEach(interval => {
        window.clearInterval(interval);
    });
}

/** @type {number} The timeout id that auto-advances the current dialogue line. */
let dialogueTimer = null;

/**
 * Shows a sequence of dialogue lines over an animated cutscene, then calls onFinish.
 * @param {string[]} lines - The lines to show one after another.
 * @param {Function} onFinish - Called once the last line was dismissed.
 * @param {Object} cutscene - The cutscene definition (from a buildXCutscene function).
 */
function playDialogue(lines, onFinish, cutscene) {
    dialogueActive = true;
    dialogueIndex = 0;
    dialogueLines = lines;
    dialogueOnFinish = onFinish;
    showCutscene(cutscene);
    document.getElementById('dialogue').classList.remove('d-none');
    document.getElementById('letterboxTop').classList.remove('d-none');
    document.getElementById('letterboxBottom').classList.remove('d-none');
    showDialogueLine();
}

/**
 * Displays the current dialogue line, points the cutscene camera at it, and
 * schedules it to auto-advance.
 */
function showDialogueLine() {
    document.getElementById('dialogueText').innerText = dialogueLines[dialogueIndex];
    setCutsceneShot(dialogueIndex);
    if (!currentShot || !currentShot.sound) {
        playDialogueBlip();
    }
    window.clearTimeout(dialogueTimer);
    dialogueTimer = setTimeout(() => advanceDialogue(), 4000);
}

/**
 * Shows the next line of the current dialogue, or ends it.
 */
function advanceDialogue() {
    if (!mute && background_music.paused) {
        background_music.play();
    }
    window.clearTimeout(dialogueTimer);
    dialogueIndex++;
    if (dialogueIndex < dialogueLines.length) {
        showDialogueLine();
    } else {
        dialogueActive = false;
        hideCutscene();
        document.getElementById('dialogue').classList.add('d-none');
        document.getElementById('letterboxTop').classList.add('d-none');
        document.getElementById('letterboxBottom').classList.add('d-none');
        if (dialogueOnFinish) {
            dialogueOnFinish();
        }
    }
}

/**
 * Plays a short emotional blip sound for the current dialogue line.
 */
function playDialogueBlip() {
    if (!mute) {
        dialogueBlip.currentTime = 0;
        dialogueBlip.play();
    }
}

/**
 * Shows the intro cutscene right at the start of the game.
 */
function startIntro() {
    if (!mute) {
        background_music.play().catch(() => {
        });
    }
    playDialogue(introLines, () => {
    }, buildIntroCutscene());
}

/**
 * Shows the cutscene right before a boss fight, then starts the fight.
 * @param {Endboss} boss - The boss about to fight.
 */
function startBossIntro(boss) {
    let lines = boss.final ? bossIntroLines2 : bossIntroLines1;
    fadeOut(background_music, 200, function () {
        changeAudioFileAndFadeIn(background_music, 'audio/bossfight.wav', true, 2000);
    });
    playDialogue(lines, () => {
        boss.attack();
    }, buildBossIntroCutscene(boss));
}

/**
 * Shows the cutscene after the first end boss and then loads level 2.
 * @param {Endboss} boss - The beaten boss taking part in the scene.
 */
function startTransition(boss) {
    playDialogue(transitionLines, () => {
        world.loadLevel2();
    }, buildTransitionCutscene(boss));
}

/**
 * Starts the closing cutscene between Pepe and the chickens after the last boss is beaten.
 * @param {Endboss} boss - The end boss taking part in the scene.
 */
function startEnding(boss) {
    stopGame();
    playDialogue(endingLines, () => {
        document.getElementById('winner').classList.remove('d-none');
        document.getElementById('replay').classList.remove('d-none');
    }, buildEndingCutscene(boss));
}

/**
 * Function to restart the game / reload the page.
 */
function resetGame() {
    location.reload();
}

/**
 * Function to set or remove mute.
 */
function manageAudio() {
    if (!audioplaying) {
        noMute();
    }
    if (audioplaying) {
        muteAll();
    }
}

/**
 * Function to remove mute from all audio.
 */
function noMute() {
    mute = false;
    localStorage.setItem('mute', 'false');
    setTimeout(() => {
        audioplaying = true;
    }, 200);
    background_music.play();
    setButton();
}

/**
 * Function to mute all audio.
 */
function muteAll() {
    mute = true;
    localStorage.setItem('mute', 'true');
    setTimeout(() => {
        audioplaying = false;
    }, 200);
    background_music.pause();
    setButton();
}
/**
 * Gradually reduces the volume of the audio until it reaches zero.
 *
 * @param {HTMLAudioElement} audio - The audio element to fade out.
 * @param {number} duration - The duration of the fade out in milliseconds.
 * @param {Function} callback - A function to be called when the fade out is complete.
 */
function fadeOut(audio, duration, callback) {
    let step = 0.01; // Volume change per step
    let interval = duration / (audio.volume / step);

    let fade = setInterval(function () {
        if (audio.volume - step <= 0) {
            clearInterval(fade);
            audio.volume = 0;
            callback(); // Execute callback function when fade out is completed
        } else {
            audio.volume -= step;
        }
    }, interval);
}

/**
 * Gradually increases the volume of the audio until it reaches full volume.
 *
 * @param {HTMLAudioElement} audio - The audio element to fade in.
 * @param {number} duration - The duration of the fade in in milliseconds.
 */
function fadeIn(audio, duration) {
    let step = 0.01; // Volume change per step
    let interval = duration / ((1 - audio.volume) / step);

    let fade = setInterval(function () {
        if (!mute) {
            if (audio.volume + step >= 1) {
                clearInterval(fade);
                audio.volume = 1;
            } else {
                audio.volume += step;
            }
        }
    }, interval);
}

/**
 * Changes the audio file source and fades in the new audio.
 *
 * @param {HTMLAudioElement} audio - The audio element to change and fade in.
 * @param {string} newPath - The path to the new audio file.
 * @param {boolean} loop - Whether the new audio file should loop.
 * @param {number} duration - The duration of the fade in in milliseconds.
 */
function changeAudioFileAndFadeIn(audio, newPath, loop, duration) {
    audio.src = newPath;
    audio.loop = loop; // Change loop state before calling play() method
    audio.oncanplaythrough = function () { // When the new audio file is loaded
        audio.play();
        fadeIn(audio, duration);
    }
    audio.load(); // Trigger loading of the new audio file
}

/**
 * Prevents the text in buttons with class 'buttonGame' from being selectable.
 */
window.onload = function () {
    var buttons = document.querySelectorAll('.buttonGame');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('mousedown', function (event) {
            event.preventDefault();
        });
    }
};

/**
 * Displays a notice if the screen width is less or equal to 720px and hides it after 10 seconds.
 */
function displayNotice() {
    // Check if the screen width is less or equal to 720px
    if (window.innerWidth <= 720) {

        // Display the div element
        notice.style.display = 'block';

        // Hide the div element after 10 seconds
        setTimeout(function () {
            close();
        }, 10000);
    }
}

/**
 * Hides the notice div element.
 */
function close() {
    notice.style.display = 'none';
}

/**
 * Adjusts the size of the canvas wrapper based on the screen resolution.
 * Both the game canvas and the cutscene canvas fill this wrapper exactly.
 */
function resizeCanvas() {
    let layout = document.querySelector('.canvas-layout');
    let ratio = 1080 / 720;
    if (layout) {
        setStyleBasedOnWindow(layout, ratio);
    }
}

/**
 * Sets the wrapper's pixel size to fit the window while keeping the game's aspect ratio.
 *
 * @param {HTMLElement} el - The element to set the size on.
 * @param {number} ratio - The ratio of the width to the height.
 */
function setStyleBasedOnWindow(el, ratio) {
    let availableWidth = window.innerWidth;
    let availableHeight = window.innerHeight;
    if (isPortraitPhone()) {
        let swap = availableWidth;
        availableWidth = availableHeight;
        availableHeight = swap;
    }
    let width, height;
    if (availableWidth / availableHeight < ratio) {
        width = availableWidth;
        height = availableWidth / ratio;
    } else {
        height = availableHeight;
        width = availableHeight * ratio;
    }
    el.style.width = width + 'px';
    el.style.height = height + 'px';
}

/**
 * Checks if the game is running on a narrow, portrait-oriented screen.
 * @returns {boolean} - true if the game should be rotated to fit a phone in portrait mode.
 */
function isPortraitPhone() {
    return window.innerHeight > window.innerWidth && window.innerWidth <= 900;
}

/**
 * Calls resizeCanvas when the window size changes.
 */
window.onresize = function () {
    resizeCanvas();
}

/**
 * Adds or removes classes from the mute and sound buttons based on the mute state.
 */
document.addEventListener('DOMContentLoaded', function () {
    setButton();
    // Prüfen, ob es sich um ein Touch-Gerät handelt
    if (!('ontouchstart' in window)) {
        let buttons = document.getElementById('buttons');
        buttons.classList.add('d-none');
    }
});

function setButton() {
    muteBtn = document.getElementById('mute');
    soundBtn = document.getElementById('no_mute');
    if (mute) {
        muteBtn.classList.add('d-none');
        soundBtn.classList.remove('d-none');
    }
    else {
        muteBtn.classList.remove('d-none');
        soundBtn.classList.add('d-none');
    }
}





