export default class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    this.gameScene = config.scene;

    this.setScale(0.5);
    this.setDepth(10);

    this.speed = 100;
    this.coins = 25;
    this.inventory = {
      "speed_potion": 0,
      "vision_potion": 0
    }
  }

  getTileInFrontOfPlayer(layer) {
    let deltaX = 0, deltaY = 0;

    switch (this.direction) {
      case "LEFT":
        deltaX = -1
        break;
      case "RIGHT":
        deltaX = 1;
        break;
      case "UP":
        deltaY = -1;
        break;
      case "DOWN":
        deltaY = 1;
        break;
      default:
        break;
    }

    let x = parseInt(this.x / 32) + deltaX;
    let y = parseInt(this.y / 32) + deltaY;

    return layer.getTileAt(x, y);
  }

  setPositionAtSpawn(map, scene) {
    let spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn");
    this.setPosition(spawnPoint.x, spawnPoint.y);
  }

  addItemToInventory(item) {
    if (item in this.inventory) {
      this.inventory[item] += 1;
    } else {
      this.inventory[item] = 1;
    }
  }

  displayInventory() {
    this.gameScene.events.emit('updateInventory', this);
  }

  hideInventory() {
    this.gameScene.events.emit('hideInventory');
  }

  useItem(item) {
    if (this.inventory[item] >= 1) {
      this.inventory[item] -= 1;

      switch (item) {
        case "speed_potion":
          this.speedEffect();
          break;
        case "vision_potion":
          this.gameScene.events.emit('USE_SPEED_POTION');
          break;
        default:
          break;
      }
    }

    this.scene.events.emit('updateInventory', this);
  }

  speedEffect() {
    this.speed = 150;

    setTimeout(() => {
      this.speed = 100;
    }, 10000);
  }

  update(keys) {
    this.body.setVelocity(0);

    this.posX = this.body.position.x;
    this.posY = this.body.position.y;

    if (keys.left.isDown) {
      this.direction = "LEFT";
      this.body.setVelocityX(-this.speed);
      this.anims.play('left', true);
    } else if (keys.right.isDown) {
      this.direction = "RIGHT";
      this.body.setVelocityX(this.speed);
      this.anims.play('right', true);
    } else if (keys.up.isDown) {
      this.direction = "UP";
      this.body.setVelocityY(-this.speed);
      this.anims.play('up', true);
    } else if (keys.down.isDown) {
      this.direction = "DOWN";
      this.body.setVelocityY(this.speed);
      this.anims.play('down', true);
    } else {
      // Player has stopped moving, we display the first frame of his current direction
      this.stopAnims();
    }
  }

  stopAnims() {
    switch (this.direction) {
      case "RIGHT":
        this.anims.play('right', false);
        break;
      case "LEFT":
        this.anims.play('left', false);
        break;
      case "UP":
        this.anims.play('up', false);
        break;
      case "DOWN":
        this.anims.play('down', false);
        break;
    }
  }
}
