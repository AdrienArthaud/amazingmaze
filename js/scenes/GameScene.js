import Player from '../sprites/Player.js';
import Shop from '../entities/Shop.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
  }

  preload() {
    this.HUDScene = this.scene.get('HUDScene');
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.events.on('USE_SPEED_POTION', this.zoomOut, this);
  }

  create() {
    this.loadPlayer();
    this.loadMap("Home");
    this.shop = new Shop(this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.shop.isOpen) {
      this.player.update(this.cursors);
    } else {
      this.player.stopAnims();
    }

    if (this.enterKey.isDown) {
      let tile = this.player.getTileInFrontOfPlayer(this.worldLayer);
      if (tile.properties.isShop) {
        this.player.displayInventory();
        this.shop.open();
      }
    }

    if (this.escapeKey.isDown) {
      if (this.shop.isOpen) {
        this.shop.close();
      }
    }

    if (this.currentMap == "Home") {
      this.checkActionFromPlayerPosition();
    }

    if (this.currentMap == "Level1") {
      this.checkPlayerPosition();
      this.checkPlayerExitMaze();
    }
  }

  loadMap(mapName) {
    // Destroy old map before to create the actual
    if (this.map) {
      this.map.destroy();
    }

    this.currentMap = mapName;
    this.map = this.add.tilemap(mapName);
    this.tileset = this.map.addTilesetImage('tileset', 'tiles');

    this.physics.world.colliders.destroy();

    switch (mapName) {
      case "Home":
        this.worldLayer = this.map.createStaticLayer("World", this.tileset);
        this.worldLayer.setCollisionByProperty({ collides: true });

        this.physics.add.collider(this.player, this.worldLayer);

        this.shopEntrance = this.map.findObject("Objects", obj => obj.name === "Shop");
        this.level1Entrance = this.map.findObject("Objects", obj => obj.name === "Level1");

        this.player.hideInventory();
        this.cameras.main.setViewport(0, 0, 600, 400);
        break;
      case "Level1":
        this.groundLayer = this.map.createStaticLayer("Ground", this.tileset);
        this.wallsLayer = this.map.createStaticLayer("Walls", this.tileset);
        this.itemsLayer = this.map.createDynamicLayer('Items', this.tileset);

        this.wallsLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, this.wallsLayer);

        this.player.displayInventory();
        this.cameras.main.setViewport(300, 200, 200, 200);
        break;
      default:
        break;
    }

    this.player.setPositionAtSpawn(this.map, this);
    this.loadCamera();
  }

  loadPlayer() {
    this.player = new Player({
      scene: this,
      key: 'player',
      x: 0,
      y: 0
    });
  }

  loadCamera() {
    this.mainCamera = this.cameras.main;
    this.mainCamera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.mainCamera.startFollow(this.player);
  }

  checkActionFromPlayerPosition() {
    let playerX = this.player.posX;
    let playerY = this.player.posY;

    let level1EntranceX = this.level1Entrance.x;
    let level1EntranceY = this.level1Entrance.y;

    if (playerX > level1EntranceX && playerX < level1EntranceX + this.level1Entrance.width && playerY > level1EntranceY && playerY < level1EntranceY + this.level1Entrance.height) {
      this.loadMap("Level1");
    }
  }

  checkPlayerPosition() {
    let tile = this.itemsLayer.getTileAtWorldXY(this.player.posX, this.player.posY);

    if (tile) {
      if (tile.properties.coin) {
        this.collectCoins(tile.properties.coin);
      }

      if (tile.properties.zoomOutItem) {
        this.itemsLayer.removeTileAtWorldXY(this.player.posX, this.player.posY);
        this.player.addItemToInventory("speed_potion");
        this.player.displayInventory();
      }
    }
  }

  checkPlayerExitMaze() {
    let tile = this.groundLayer.getTileAtWorldXY(this.player.posX, this.player.posY);

    if (tile) {
      if (tile.properties.exit) {
        this.loadMap("Home");
      }
    }
  }

  collectCoins(amount) {
    // Player found some coins
    this.player.coins += amount;
    this.itemsLayer.removeTileAtWorldXY(this.player.posX, this.player.posY);

    this.events.emit('updatePlayerInfos', this.player);
  }

  zoomOut() {
    // Player got an item to zoom out for 3 seconds
    this.mainCamera.setViewport(0, 0, 800, 600);

    setTimeout(() => {
      this.cameras.main.setViewport(300, 200, 200, 200);
    }, 3000);
  }
}
