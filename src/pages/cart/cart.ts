import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { Http } from "@angular/http";
import { TranslateService } from "@ngx-translate/core";

import { LocationPage } from "../location/location";
import { MenuPage } from "../menu/menu";
import { CheckoutPage } from "../checkout/checkout";
import { ConfirmationPage } from "../confirmation/confirmation";
import { ExmComponentPage } from "../../example/exm.component";

import { ItemApi, CartApi, GlobalVarApi } from "../../services/service";

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: "page-cart",
  templateUrl: "cart.html",
  providers: [Http]
})

export class CartPage {
  // The items array to populate with data is created
  item = [];
  cart = [];
  location: any;
  cartCount: any;
  cartHeader: string; // = 'Confirm Order';
  flagPay: boolean = true;
  flagCheckout: boolean = false;
  flagModifyOrder: boolean = true;
  private errorMessage: any = "";
  private phoneNo: string = "";

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public loadingController: LoadingController,
    private translateService: TranslateService,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi
  ) {
    this.translateService.get("CART_PAGE_TITLE1").subscribe(value => {
      this.cartHeader = value;
    });
    this.location = this.globalvarApi.getLocation();
    this.cart = this.globalvarApi.getCartItems();
    if (this.navParams.get("itemId")) {
      this.item = this.navParams.data;
      this.cart.push(this.item);
      this.flagPay = false;
      this.flagCheckout = true;
    }
    if (this.navParams.data["payment"] === "cancel") {
      this.flagPay = false;
      this.flagCheckout = true;
    }
    if (this.navParams.data["payment"] === "OK") {
      this.flagPay = true;
      this.flagCheckout = false;
      this.flagModifyOrder = true;
      this.translateService.get("CART_PAGE_TITLE2").subscribe(value => {
        this.cartHeader = value;
      });
      this.cartApi.taxLookUp(this.cart); //lookup taxes
    }
    this.globalvarApi.setCartItems(this.cart);
    this.cartCount = this.globalvarApi.getCount();
  }

  changeLocation($event) {
    this.navCtrl.push(LocationPage, location);
  }

  _buildAlert(alertConfig) {
    let alert = this.alertCtrl.create();
    this.translateService.get(alertConfig.title).subscribe(value => {
      alert.setTitle(value);
    });
    this.translateService.get(alertConfig.message).subscribe(value => {
      alert.setMessage(value);
    });
    return alert;
  }

  deleteCart() {
    let self = this;
    let alertConfig = {
      title: "ALERT.CART.ALERT1",
      message: "ALERT.CART.ALERT2",
      button1: "BUTTON.CANCEL",
      button2: "BUTTON.REMOVE",
      role1: "cancel",
      role2: "none"
    };
    let alert = this._buildAlert(alertConfig);
    this.translateService.get(alertConfig.button1).subscribe(value => {
      alert.addButton({
        text: value,
        role: alertConfig.role1,
        handler: () => {
          console.log("Cancel clicked");
        }
      });
    });
    this.translateService.get(alertConfig.button2).subscribe(value => {
      alert.addButton({
        text: value,
        handler: () => {
          this.cancel();
        }
      });
    });
    alert.present();
  }

  removeItemFromCart(item) {
    let self = this;
    let alertConfig = {
      title: "ALERT.CART.ALERT3",
      message: "ALERT.CART.ALERT4",
      button1: "BUTTON.CANCEL",
      button2: "BUTTON.REMOVE",
      role1: "cancel",
      role2: "none"
    };
    let alert = this._buildAlert(alertConfig);
    this.translateService.get(alertConfig.button1).subscribe(value => {
      alert.addButton({
        text: value,
        role: alertConfig.role1,
        handler: () => {
          console.log("Cancel clicked");
        }
      });
    });
    this.translateService.get(alertConfig.button2).subscribe(value => {
      alert.addButton({
        text: value,
        handler: () => {
          self.cartApi.removeItemById(item.itemId);
          this.cartCount = this.cartApi.getCount();
        }
      });
    });
    alert.present();
  }

  quantityPlus(item) {
    if (item.qty < this.location.config.maxOrders) {
      this.cartApi.quantityPlus(item);
    } else {
      let alertConfig = {
        title: "ALERT.CART.ALERT6",
        message: "ALERT.CART.ALERT7",
        button1: "BUTTON.OK"
      };
      let alert = this._buildAlert(alertConfig);
      this.translateService.get(alertConfig.button1).subscribe(value => {
        alert.addButton({
          text: value
        });
      });
      alert.present();
    }
  }

  quantityMinus(item) {
    if (item.qty > 1) {
      this.cartApi.quantityMinus(item);
    } else {
      let alertConfig = {
        title: "ALERT.CART.ALERT6",
        message: "ALERT.CART.ALERT8",
        button1: "BUTTON.OK"
      };
      let alert = this._buildAlert(alertConfig);
      this.translateService.get(alertConfig.button1).subscribe(value => {
        alert.addButton({
          text: value
        });
      });
      alert.present();
    }
  }

  getGrandTotal(type) {
    return this.cartApi.getGrandTotal();
  }

  getSubTotal(type) {
    return this.cartApi.getSubTotal();
  }

  getTaxTotal() {
    return this.cartApi.getTaxTotal();
  }

  checkOut2(item) {
    // this.navCtrl.push(CheckoutPage, item);
    this.navCtrl.push(ExmComponentPage, item);
  }

  // Present this pop-up only when applicable
  checkOut($event, item) {
    this.phoneNo = this.globalvarApi.getPhoneNo();
    if (!this.phoneNo) {
      let alertConfig = {
        title: "ALERT.CART.ALERT9",
        message: "ALERT.CART.ALERT10",
        button1: "BUTTON.OK",
        button2: "BUTTON.CANCEL"
      };
      let alert = this._buildAlert(alertConfig);
      this.translateService.get(alertConfig.button1).subscribe(value => {
        alert.addInput({
          name: "phone",
          // placeholder: value,
          value: "123-456-7898"
        });
      });
      this.translateService.get(alertConfig.button2).subscribe(value => {
        alert.addButton({
          text: value
        });
      });
      this.translateService.get(alertConfig.button1).subscribe(value => {
        alert.addButton({
          text: value,
          handler: data => {
            if (data.phone) {
              const phonenum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
              if (data.phone.match(phonenum)) {
                this.globalvarApi.setPhoneNo(data.phone);
                this.checkOut2(item);
              } else {
                this.checkOut($event, item);
              }
            } else {
              this.checkOut($event, item);
            }
          }
        });
      });
      alert.present();
    } else {
      this.checkOut2(item);
    }
  }

  confirmPay($event, item) {
    let loader = this.loadingController.create();
    this.translateService.get("LOADER.PAYMENT").subscribe(value => {
      loader.setContent(value);
      loader.present();
    });

    this.cartApi.populateOrderdata().then(data => {
      let body = {};
      body["order"] = data;
      this.cartApi.populatePaymentdata().then(data => {
        body["payment"] = data;
        this.cartApi.postOrder(body).subscribe(
          data => {
            loader.dismiss();
            console.log(data);
            this.navCtrl.push(ConfirmationPage, data);
          },
          error => {
            this.errorMessage = <any>error;
            loader.dismiss();
            console.log(this.errorMessage);
            this.navCtrl.push(ConfirmationPage, error);
          }
        );
      });
    });
  }

  cancel() {
    this.navCtrl.push(MenuPage, { resetFlag: true });
  }

  navigate($event, name) {
    switch (name) {
      case "menu":
        this.navCtrl.push(MenuPage);
        break;
      case "cart":
        console.log("Cart TAPPED");
        break;
      case "grabby":
        console.log("Grabby TAPPED");
        break;
      case "profile":
        console.log("Profile TAPPED");
        break;
      default:
    }
  }
}
