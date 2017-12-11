import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';;
import { Http } from '@angular/http';


// Import pages to allow links to the page
import { LocationPage } from "../location/location";
import { MenuPage } from '../menu/menu';
import { CheckoutPage } from '../checkout/checkout';
import { ConfirmationPage } from '../confirmation/confirmation';
import { ExmComponentPage } from '../../example/exm.component';

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
  flagModifyOrder: boolean = true;
  private errorMessage: any = '';
  private phoneNo: string = "";

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
    if (this.navParams.data["payment"] === "cancel"){
      this.flagPay = false;
      this.flagCheckout = true;
    }
    if (this.navParams.data["payment"] === "OK"){
      console.log(this.globalvarApi.getPaymentInfo());
      this.flagPay = true;
      this.flagCheckout = false;
      this.flagModifyOrder = true;
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
   // this.navCtrl.push(CheckoutPage, item); 
    this.navCtrl.push(ExmComponentPage, item);
  }

  // Present this pop-up only when applicable
  checkOut($event, item) {
    this.phoneNo = this.globalvarApi.getPhoneNo();
    if (!this.phoneNo) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Please provide your Contact Number');
      alert.addInput({
        name: 'phone',
       // placeholder: 'Enter 10 digit mobile number',
        value: "1234567898"
      });
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Ok',
        handler: data => {
          if (data.phone) {
            var phonenum = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (data.phone.match(phonenum)) {
              console.log(data.phone);
              this.globalvarApi.setPhoneNo(data.phone);
              this.checkOut2(item);
            }
            else {
              this.checkOut($event, item);
            }
          } else {
            this.checkOut($event, item);
          }
        }
      });
      alert.present();
    }
    else{
      this.checkOut2(item);
    }
  }

  confirmPay($event, item) {
    console.log("Confirm Pay tapped");
    //1. Order details - //populate with known details
    var order = {};
    order["entityId"] = this.globalvarApi.location.entityId;
    order["restaurantId"] = this.globalvarApi.location.restaurantId;
    order["customer_id"] = 0; //guest 
    order["customer_user_agent"] = "None";
    order["customer_note"] = "None";

    //2. Payment details - //populate with known details
    var order = {};
    order["entityId"] = this.globalvarApi.location.entityId;
    order["restaurantId"] = this.globalvarApi.location.restaurantId;
    order["customer_id"] = 0; //guest 
    order["customer_phone_no"] = this.globalvarApi.getPhoneNo();
    order["customer_user_agent"] = "None";
    order["customer_note"] = "None";
    //loader logic
    let loader = this.loadingController.create({
      content: "Processing your payment and placing order..."
    });
    loader.present();

    //Populate POST body with orderinfo and paymentinfo
    this.cartApi.populateOrderdata({}, {}).then(data => {
      console.log("post create order start");
      var body = data;
      //Call POST create order
      this.cartApi.postOrder(body)
        .subscribe(
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
        })
    });


    /*     console.log("Confirm Pay tapped");
        //Pay and create Order
        let loader = this.loadingController.create({
          content: "Processing your payment and placing order..."
        });
        loader.present();
        this.cartApi.createOrder({}, {}).then(data => {
          loader.dismiss();
          // this.menu = this.menu.filter(item => item.category == this.passedCategory);
          console.log(data);
        }); */
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
