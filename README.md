# El Pollo Loco

El Pollo Loco is a jump and run game in the browser. Pepe runs through a Mexican desert, collects coins and salsa bottles and fights his way past crazy chickens to two end bosses. The game is built with plain JavaScript and the HTML canvas, following an object-oriented approach.

**Play it live:** [el-pollo-loco.wjs-projects.de](https://el-pollo-loco.wjs-projects.de)

## Features

- **Two levels**, each with its own end boss: the leader of the chickens and, in the desert, the primal hen.
- **Story cutscenes** with dialogue before the game, before each boss fight, between the levels and at the end.
- **Jump on chickens** to defeat them, or **throw salsa bottles** at chickens and bosses.
- **Status bars** for health, coins and bottles.
- **Sound effects and music**; the sound can be switched off, and the choice is remembered.
- **Fullscreen mode** and **touch controls** for tablets and smartphones, with a hint to turn the device sideways.
- **Game over and win screens** with a button to play again.
- Legal notice and privacy policy.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Walk | <kbd>←</kbd> <kbd>→</kbd> | Arrow buttons on the left |
| Jump | <kbd>Space</kbd> | Up button on the right |
| Throw a bottle | <kbd>D</kbd> | Bottle button on the right |
| Next dialogue line | <kbd>Space</kbd> | Tap the dialogue |

## Tech stack

| Part | Technology |
| --- | --- |
| Game | JavaScript (ES6 classes), HTML5 canvas |
| Layout | HTML, CSS |
| Font | Rye, hosted locally |

No build step and no dependencies are needed.

## Getting started

Clone the repository and open `index.html` through a local web server, for example:

```bash
npx serve .
```

or the *Live Server* extension of VS Code. Then open the shown address in the browser and click **Spiel starten**. Browsers only play sound after this click.

## Project structure

```
index.html            game page with canvas, touch controls and footer
impressum.html        legal notice
datenschutz.html      privacy policy
style.css, legal.css  styles
js/game.js            start, input, sound, fullscreen and dialogues
js/cutscene.js        animated story cutscenes on their own canvas
levels/               level 1 and level 2 (enemies, coins, bottles, background)
models/               classes of the game objects (world, character, chickens, end boss, bottles, status bars …)
img/, audio/, fonts/  graphics, sounds and the font
```

The classes build on each other: `DrawableObject` draws images on the canvas, `MoveableObject` adds movement, gravity and collisions, and `Character`, `Chicken`, `Endboss` and `ThrowableObject` extend it. `World` runs the game loop, checks collisions and draws everything.

## Credits

Graphics and sounds were provided by the [Developer Akademie](https://developerakademie.com) as part of the training.
