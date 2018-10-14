import BootScene from './scenes/BootScene.js';
import HUDScene from './scenes/HUDScene.js'; // Head-up display
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container', // ID of the DOM element to add the canvas to
  pixelArt: true,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      }
    }
  },
  scene: [
    BootScene,
    GameScene,
    HUDScene
  ]
};

const game = new Phaser.Game(config);

/*
Idées :
- Créer des classes de personnages (Voleur, Mage, Rôdeur...)
Par exemple, le voleur peut forcer des serrures, le mage peut poser des pièges qui font des dégâts aux ennemis, etc...
*/
