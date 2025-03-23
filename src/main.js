import InitScene from './InitScene.js';
import GameScene from './GameScene.js';
import WinScene from './WinScene.js';
import GameOverScene from './GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-game',
    backgroundColor: '#2d2d2d',
    scene: [InitScene, GameScene, WinScene, GameOverScene]
};

const game = new Phaser.Game(config);

// --- Constantes Globales ---
const CARD_WIDTH = 768;
const CARD_HEIGHT = 1063;
const SCALE = 0.14;
const CARD_SPACING = 40;
const CARD_DISPLAY_WIDTH = CARD_WIDTH * SCALE;
const START_Y = 300;
const NUM_CARDS = 5;