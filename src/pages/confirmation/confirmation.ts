import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { Http } from "@angular/http";
import { CardModule } from "ngx-card/ngx-card";

// Import pages to allow links to the page
import { MenuPage } from "../menu/menu";
import { CartPage } from "../cart/cart";

// Service import for items
import { ItemApi, CartApi, GlobalVarApi } from "../../services/service";

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: "page-confirmation",
  templateUrl: "confirmation.html",
  providers: [Http, CardModule]
})
export class ConfirmationPage {
  // The items array to populate with data is created
  item: any;
  cart = [];
  location: any;
  cardinfo: any;
  orderDetails: any = {
    id: "00001",
    amount: "200 USD",
    description: "test order",
    receipt_email: "name@yahoo.com"
  };
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private itemApi: ItemApi,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {
    this.location = this.globalvarApi.getLocation();
    this.cart = this.globalvarApi.getCartItems();
    this.item = this.navParams.data;
    if (this.item["order"] !== undefined) {
      this.orderDetails.id = this.item.order.order_number;
    } else {
      this.orderDetails.id =
        "Error in processing order: " + JSON.stringify(this.item);
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

  placeNeworder() {
    this.navCtrl.push(MenuPage, { resetFlag: true });
  }
}
