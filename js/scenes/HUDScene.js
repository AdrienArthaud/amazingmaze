import UserInterface from '../UI/UserInterface.js';
import ShopInterface from '../UI/ShopInterface.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'HUDScene'
    });
  }

  preload() {

  }

  create() {
    const gameScene = this.scene.get('GameScene');

    this.UI = new UserInterface(this, gameScene);
    this.shopInterface = new ShopInterface(this, gameScene);
  }
}
