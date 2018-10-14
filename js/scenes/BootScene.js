export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'BootScene'
    });
  }

  preload() {
    this.load.tilemapTiledJSON('Home', 'assets/maps/home.json');
    this.load.tilemapTiledJSON('Level1', 'assets/maps/level1.json');
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.spritesheet('player', 'assets/sprites/player_sprites.png', { frameWidth: 32, frameHeight: 32 });

    this.load.image('speed_potion', 'assets/img/speed_potion_icon.png');
    this.load.image('vision_potion', 'assets/img/vision_potion_icon.png');
  }

  create() {
    this.initRegistry();

    this.loadAnims();

    this.scene.launch('HUDScene');
    this.scene.start('GameScene');
  }

  loadAnims() {
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', {start: 0, end: 2}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {start: 3, end: 5}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {start: 6, end: 8}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', {start: 10, end: 12}),
      frameRate: 10,
      repeat: -1
    });
  }

  initRegistry() {
    // The game registry provides a place accessible by all scenes to set and get data
    // Example : this.registry.set('custom_value', 0);
  }
}
