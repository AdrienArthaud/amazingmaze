export default class Shop {
  constructor(gameScene) {
    this.gameScene = gameScene;
  }

  open() {
    if (!this.isOpen) {
      this.gameScene.events.emit('displayShop', this);
      this.isOpen = true;
    }
  }

  buy(item, price) {
    let player = this.gameScene.player;
    let canBuy = player.coins >= price;

    if (canBuy) {
      player.coins -= price;
      player.addItemToInventory(item);
      player.displayInventory();
      this.gameScene.sys.events.emit('updatePlayerInfos', this.gameScene.player);
    } else {
      alert('Not enough money !');
    }
  }

  close() {
    this.gameScene.events.emit('hideShop', this);
    this.isOpen = false;
  }
}
