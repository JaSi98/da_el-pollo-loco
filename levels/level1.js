/**
 * @class
 * @classdesc Represents level 1 in the game.
 * @extends Level
 */
let level1 = new Level(
    [
        //Enemlies definieren
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken()
    ],
    [
        //Wolken Definieren
        new Cloud()
    ],
    [
        //Hintergrund definieren
        new BackgoundObject('./img/5_background/layers/air.png', -1079 * 3),
        new BackgoundObject('./img/5_background/layers/3_third_layer/2.png', -1079 * 3),
        new BackgoundObject('./img/5_background/layers/2_second_layer/2.png', -1079 * 3),
        new BackgoundObject('./img/5_background/layers/1_first_layer/2.png', -1079 * 3),
        new BackgoundObject('./img/5_background/layers/air.png', -1079 * 2),
        new BackgoundObject('./img/5_background/layers/3_third_layer/1.png', -1079 * 2),
        new BackgoundObject('./img/5_background/layers/2_second_layer/1.png', -1079 * 2),
        new BackgoundObject('./img/5_background/layers/1_first_layer/1.png', -1079 * 2),
        new BackgoundObject('./img/5_background/layers/air.png', -1079),
        new BackgoundObject('./img/5_background/layers/3_third_layer/2.png', -1079),
        new BackgoundObject('./img/5_background/layers/2_second_layer/2.png', -1079),
        new BackgoundObject('./img/5_background/layers/1_first_layer/2.png', -1079),
        new BackgoundObject('./img/5_background/layers/air.png', 0),
        new BackgoundObject('./img/5_background/layers/3_third_layer/1.png', 0),
        new BackgoundObject('./img/5_background/layers/2_second_layer/1.png', 0),
        new BackgoundObject('./img/5_background/layers/1_first_layer/1.png', 0),
        new BackgoundObject('./img/5_background/layers/air.png', 1079),
        new BackgoundObject('./img/5_background/layers/3_third_layer/2.png', 1079),
        new BackgoundObject('./img/5_background/layers/2_second_layer/2.png', 1079),
        new BackgoundObject('./img/5_background/layers/1_first_layer/2.png', 1079),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 2),
        new BackgoundObject('./img/5_background/layers/3_third_layer/1.png', 1079 * 2),
        new BackgoundObject('./img/5_background/layers/2_second_layer/1.png', 1079 * 2),
        new BackgoundObject('./img/5_background/layers/1_first_layer/1.png', 1079 * 2),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 3),
        new BackgoundObject('./img/5_background/layers/3_third_layer/2.png', 1079 * 3),
        new BackgoundObject('./img/5_background/layers/2_second_layer/2.png', 1079 * 3),
        new BackgoundObject('./img/5_background/layers/1_first_layer/2.png', 1079 * 3),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 4),
        new BackgoundObject('./img/5_background/layers/3_third_layer/1.png', 1079 * 4),
        new BackgoundObject('./img/5_background/layers/2_second_layer/1.png', 1079 * 4),
        new BackgoundObject('./img/5_background/layers/1_first_layer/1.png', 1079 * 4),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 5),
        new BackgoundObject('./img/5_background/layers/3_third_layer/2.png', 1079 * 5),
        new BackgoundObject('./img/5_background/layers/2_second_layer/2.png', 1079 * 5),
        new BackgoundObject('./img/5_background/layers/1_first_layer/2.png', 1079 * 5),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 6),
        new BackgoundObject('./img/5_background/layers/3_third_layer/1.png', 1079 * 6),
        new BackgoundObject('./img/5_background/layers/2_second_layer/1.png', 1079 * 6),
        new BackgoundObject('./img/5_background/layers/1_first_layer/1.png', 1079 * 6),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 7),
        new BackgoundObject('./img/5_background/layers/3_third_layer/2.png', 1079 * 7),
        new BackgoundObject('./img/5_background/layers/2_second_layer/2.png', 1079 * 7),
        new BackgoundObject('./img/5_background/layers/1_first_layer/2.png', 1079 * 7),
        new BackgoundObject('./img/5_background/layers/air.png', 1079 * 8),
        new BackgoundObject('./img/5_background/layers/3_third_layer/1.png', 1079 * 8),
        new BackgoundObject('./img/5_background/layers/2_second_layer/1.png', 1079 * 8),
        new BackgoundObject('./img/5_background/layers/1_first_layer/1.png', 1079 * 8)
    ],
    [
        //Münuen definieren
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin(),
        new coin()
    ],

    [
        //Flaschen definieren
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle(),
        new bottle()
    ],
    [
        //Werfbare Objekte werden hier eingefügt
    ]
);
