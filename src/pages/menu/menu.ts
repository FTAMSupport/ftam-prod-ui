import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';

// Import pages to allow links to the page
import { LocationPage } from "../../pages/location/location";
import { CartPage } from '../../pages/cart/cart';
import { IngredientsPage } from '../../pages/ingredients/ingredients';
//import { CartPage } from "../../pages/cart/cart";

// Service import for items
import { MenuApi, ItemApi, CartApi, GlobalVarApi } from '../../services/service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  providers: [Http]
})

export class MenuPage {
  // The items array to populate with data is created
  trigger: any;
  location: any;
  mode: any;
  menu: any;
  passedCategory: any;
  cartCount: any;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private menuApi: MenuApi,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {
    this.mode = this.navParams.data;
    if (this.mode && this.mode.resetFlag === true){
      this.globalvarApi.reset();
      this.cartCount = 0;
    }
    // Get location info from global-var
    this.location = this.globalvarApi.getLocation();
    // Cart Count
    this.cartCount = this.globalvarApi.getCount();
  }

  // ------------------------------------------------------------------------------------------
  // FUNCTIONS
  // ------------------------------------------------------------------------------------------
  // This function is an event to listen to clicks on elements.
  changeLocation($event) {
    this.navCtrl.push(LocationPage, location);
  }

  // This is where the data loads from the service.
  // It happens when the view loads for the first time.
  ionViewDidLoad() {
    let loader = this.loadingController.create({
      content: "Fetching Menu Info..."
    });
    loader.present();

    // Get the JSON data from our locationApi
    let restaurantID = this.location.restaurantId;
    let entityID = this.location.entityId;
    console.log(restaurantID);
    this.menuApi.getMenu(entityID, restaurantID).then(data => {
      loader.dismiss();
      this.menu = data[0].category;
      // this.menu = this.menu.filter(item => item.category == this.passedCategory);
      console.log(this.menu);
    });
  }

  // This function is an event to listen to clicks on elements.
  // The Menu Page has been included to be passed in this function.
  itemTapped($event, item) {
    console.log("item tapped");
    this.navCtrl.push(IngredientsPage, item);
  }

  navigate($event, name) {
    switch (name) {
      case 'menu':
        console.log("Cart TAPPED");
        //this.navCtrl.push(MenuPage);
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

  // Present this pop-up only when applicable
  presentPopup($event, item) {
    if (item.step != undefined && item.step[0] != undefined) {
      let alert = this.alertCtrl.create();
      alert.setTitle(item.step[0].stepText);
      for (let option of item.step[0].options) {
        if (option.optionAdditionalPrice !== 0.00) {
          let text = option.optionText + "(+ $" + option.optionAdditionalPrice + ")";
          alert.addInput({
            type: 'radio',
            label: text,
            value: option.optionAdditionalPrice + ',' + option.optionText,
            checked: false
          });
        }
        else {
          alert.addInput({
            type: 'radio',
            label: option.text,
            value: option.optionAdditionalPrice + ',' + option.optionText,
            checked: false
          });
        }
      }
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Ok',
        handler: selected => {
          let array = selected.split(',')
          item.stepSelected = array[1];
          item.extraPrice = parseInt(array[0]);
          //item.itemPrice = parseInt(item.itemPrice, 10) + parseInt(item.extraPrice, 10);
          item.itemPrice = item.itemPrice + item.extraPrice;
          this.itemTapped($event, item)
        }
      });
      alert.present();
    }
    else {
      this.itemTapped($event, item)
    }
  }


}
