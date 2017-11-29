import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';;
import { Http } from '@angular/http';


// Import pages to allow links to the page
import { LocationPage } from "../location/location";
import { MenuPage } from '../menu/menu';
import { CheckoutPage } from '../checkout/checkout';
import { ConfirmationPage } from '../confirmation/confirmation';

// Service import for items
import { ItemApi, CartApi, GlobalVarApi } from '../../services/service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [Http]
})

export class CartPage {

  // The items array to populate with data is created
  item = [];
  cart = [];
  location: any;
  cartCount: any;
  cartHeader: string = 'Confirm Order';
  flagPay: boolean = true;
  flagCheckout: boolean = false;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {
    // Get location details from global-var
    this.location = this.globalvarApi.getLocation();
    // Get cartItem details from global-var
    this.cart = this.globalvarApi.getCartItems();
    // Get item info from previous page
    if (this.navParams.get('itemId')) {
      this.item = this.navParams.data;
      // Append new items to existing cart
      this.cart.push(this.item);
      // calculate taxes for cart items
      this.cartApi.taxLookUp(this.cart);
      this.cartHeader = 'My Cart';
      this.flagPay = false;
      this.flagCheckout = true;
      console.log(this.item);
    }
    // Set cartItem details in global-var
    this.globalvarApi.setCartItems(this.cart);
    // Cart Count
    this.cartCount = this.globalvarApi.getCount();
  }
  // This function is an event to listen to clicks on elements.
  // The Menu Page has been included to be passed in this function.
  addMore($event, item) {
    console.log("Add More Items tapped");
    item.trigger = "CartPage";
    this.navCtrl.push(MenuPage, item);
  }

  // Cancel the order items and start over
  cancel() {
    console.log("Cancel tapped");
    this.navCtrl.push(MenuPage);
  }

  deleteCart() {
    //this.cartService.removeItemById(item.id);
    let self = this;
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete Cart',
      message: 'Are you sure you want to empty the cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            console.log('Buy clicked');
            self.cartApi.emptyCart();
            this.cartCount = this.cartApi.getCount();
          }
        }
      ]
    });
    alert.present();
  }
  removeItemFromCart(item) {
    //this.cartService.removeItemById(item.id);
    let self = this;
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure you want to remove item from cart?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            console.log('Buy clicked');
            self.cartApi.removeItemById(item.id);
            this.cartCount = this.cartApi.getCount();
          }
        }
      ]
    });
    alert.present();
  }

  quantityPlus(item) {
    if (item.qty < this.location.config.maxOrders) {
      this.cartApi.quantityPlus(item);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'This is considered a bulk order! Please contact restaurant for better service.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  quantityMinus(item) {
    if (item.qty > 1) {
      this.cartApi.quantityMinus(item);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Quantity is 1, you cant reduce it, if you want to remove, please press remove button.',
        buttons: ['Ok']
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

  getTaxTotal(type) {
    return this.cartApi.getTaxTotal();
  }

  // This function is an event to listen to clicks on elements.
  changeLocation($event) {
    this.navCtrl.push(LocationPage, location);
  }

  checkOut1($event, item) {
    console.log("Add More Items tapped");
    item.trigger = "CartPage";
    this.navCtrl.push(CheckoutPage, item);
  }

  checkOut2(item) {
    console.log("Add More Items tapped");
    this.navCtrl.push(CheckoutPage, item);
  }

  // Present this pop-up only when applicable
  checkOut($event, item) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Please provide your Contact Number');
    alert.addInput({
      name: 'phone',
      placeholder: 'your mobile number'
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log(data.phone);
        this.checkOut2(item);
      }
    });
    alert.present();
  }

  confirmPay($event, item) {
    console.log("Confirm Pay tapped");
    this.navCtrl.push(ConfirmationPage);
  }

  navigate($event, name) {
    switch (name) {
      case 'menu':
        this.navCtrl.push(MenuPage);
        break;
      case 'cart':
        console.log("Cart TAPPED");
        break;
      case 'grabby':
        console.log("Grabby TAPPED");
        break;
      case 'profile':
        console.log("Profile TAPPED");
        break;
      default:
    }
  }

}
