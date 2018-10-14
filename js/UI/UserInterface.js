export default class UserInterface {
  constructor(userInterfaceScene, gameScene, opts) {
    this.scene = userInterfaceScene;
    this.gameScene = gameScene;

    this.playerInventoryGraphics = this.scene.add.graphics();

    this.gameScene.events.on('updateInventory', this.displayPlayerInventory, this);
    this.gameScene.events.on('hideInventory', this.hidePlayerInventory, this);
    this.gameScene.events.on('updatePlayerInfos', this.updatePlayerInfos, this);

    this.playerInventoryLinks = [];

    if (!opts) {
      opts = {};
    }

    // Height
    this.interfaceHeight = opts.interfaceHeight || 150;

    // Colors
    this.alphaValue = opts.alpha || 0.8;
    this.interfaceColor = opts.interfaceColor || 0x303030;
    this.hoverColor = opts.hoverColor || 0x505050;
    this.textColor = opts.textColor || 0xffffff;

    // Margins
    this.padding = opts.padding || 32;
    this.margin = opts.margin || 32;

    this.depth = opts.depth || 100;

    this.initScreen();
  }

  getGameWidth() {
    return this.scene.sys.game.config.width;
  }

  getGameHeight() {
    return this.scene.sys.game.config.height;
  }

  setLinkInteractive(link, callback) {
    link.setDepth(this.depth);
    link.setInteractive();

    link.on('pointerover', () => {
      link.setTint(this.hoverColor);
    });

    link.on('pointerout', () => {
      link.setTint(this.color);
    });

    link.on('pointerdown', callback);
  }

  initScreen() {
    this.coinsText = this.scene.add.text(20, 20, 'Pièces : 0', { fontSize: "25px" });
  }

  updatePlayerInfos(player) {
    this.coinsText.setText('Pièces : ' + player.coins);
  }

  hidePlayerInventory() {
    // Hide style (background, borders...) made with playerInventoryGraphics object
    this.playerInventoryGraphics.setVisible(false);

    // Hide icons
    if (this.playerInventoryLinks) {
      for (let link in this.playerInventoryLinks) {
        this.playerInventoryLinks[link].destroy();
      }
    }
  }

  getInventoryDimensions() {
    let spriteSize = 64;
    let x = this.padding;
    let y = this.getGameHeight() - this.padding - spriteSize;

    return {
      x: x,
      y: y,
      iconX: x + (spriteSize / 2),
      iconY: y + (spriteSize / 2),
      width: spriteSize,
      height: spriteSize,
      smallPadding: 5
    }
  }

  displayPlayerInventory(player) {
    // Reset display
    if (this.playerInventoryLinks) {
      for (let link in this.playerInventoryLinks) {
        this.playerInventoryLinks[link].destroy();
      }
    }

    this.playerInventoryGraphics.setVisible(true);

    let dim = this.getInventoryDimensions();
    let margin = 0;
    for (let item in player.inventory) {
      // name : item  (speed_potion)
      // quantité : this.inventory[item] (3)
      this.playerInventoryGraphics.fillStyle(0x303030, 1);
      this.playerInventoryGraphics.fillRect(dim.x + margin, dim.y, dim.width, dim.height);

      let link = this.scene.add.text(dim.x + margin + dim.smallPadding, dim.y + dim.smallPadding, player.inventory[item]);
      let icon = this.scene.add.image(dim.iconX + margin, dim.iconY, item).setScale(0.5);
      icon.setInteractive();
      icon.on('pointerdown', () => {
        player.useItem(item);
      });
      this.playerInventoryLinks.push(icon);
      this.playerInventoryLinks.push(link);

      margin += 80;
    }
  }
}
