import UserInterface from './UserInterface.js';

export default class ShopInterface extends UserInterface {
  constructor(userInterfaceScene, gameScene, opts) {
    super(userInterfaceScene, gameScene, opts);

    this.gameScene.events.on('displayShop', this.displayShop, this);
    this.gameScene.events.on('hideShop', this.hideShop, this);

    this.shopGraphics = this.scene.add.graphics();

    this.createShopInterface();
  }

  getDimensions() {
    return {
      x: this.padding,
      y: this.getGameHeight() - this.interfaceHeight - this.padding - 80,
      width: this.getGameWidth() - (this.padding * 2),
      height: this.interfaceHeight
    };
  }

  createShopInterface() {
    this.dimensions = this.getDimensions();
    this.shopGraphics.fillStyle(this.interfaceColor, this.alphaValue);
    this.shopGraphics.fillRect(this.dimensions.x, this.dimensions.y, this.dimensions.width, this.dimensions.height);

    this.shopGraphics.setVisible(false);
  }

  displayShop(shop) {
    this.shopGraphics.setVisible(true);

    let x = this.dimensions.x + 30;
    let y = this.dimensions.y + 30;

    this.quitLink = this.scene.add.text(this.dimensions.width, y - (this.padding / 2), "X");
    this.setLinkInteractive(this.quitLink, () => {
      shop.close();
    })

    this.buyLink = this.scene.add.text(x, y, "Acheter");
    this.setLinkInteractive(this.buyLink, () => {
      this.hideMainMenu();
      this.displayPurchaseMenu(shop);
    });

    this.saleLink = this.scene.add.text(x, y + 30, "Vendre");
    this.setLinkInteractive(this.saleLink, () => {
      this.displaySaleMenu();
    });
  }

  hideShop() {
    this.shopGraphics.setVisible(false);
    this.hideMainMenu();
    this.hidePurchaseMenu();

    if (this.quitLink) {
      this.quitLink.destroy();
    }
  }

  hideMainMenu() {
    if (this.buyLink) {
      this.buyLink.destroy();
    }

    if (this.saleLink) {
      this.saleLink.destroy();
    }
  }

  displayPurchaseMenu(shop) {
    // Potion de rapidité
    // Potion de vision agrandie
    // Nourriture

    let x = this.dimensions.x + 30;
    let y = this.dimensions.y + 30;

    this.speedPotionLink = this.scene.add.text(x, y, "Potion de rapidité (1$)");
    this.setLinkInteractive(this.speedPotionLink, () => {
      shop.buy("speed_potion", 1);
    });

    this.visionPotionLink = this.scene.add.text(x, y + 30, "Potion de vision élargie (2$)");
    this.setLinkInteractive(this.visionPotionLink, () => {
      shop.buy("vision_potion", 2);
    });
  }

  hidePurchaseMenu() {
    if (this.speedPotionLink) {
      this.speedPotionLink.destroy();
    }

    if (this.visionPotionLink) {
      this.visionPotionLink.destroy();
    }
  }

  displaySaleMenu() {

  }
}
