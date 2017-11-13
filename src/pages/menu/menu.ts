import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';

// Import pages to allow links to the page
import { LocationPage } from "../../pages/location/location";
import { IngredientsPage } from '../../pages/ingredients/ingredients';
//import { CartPage } from "../../pages/cart/cart";

// Service import for items
import { MenuApi } from '../../services/menu-api.service';
import { GlobalVarApi } from '../../services/global-vars-api.service';

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
  menu: any;
  passedCategory: any;
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private menuApi: MenuApi,
    private globalvarApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {
    // Get location info from global-var
    this.location = this.globalvarApi.getLocation();
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
    this.menuApi.getMenu().then(data => {
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
  
  // Present this pop-up only when applicable
  presentPopup($event, item) {
    if (item.step != undefined && item.step[0] != undefined) {
      let alert = this.alertCtrl.create();
      alert.setTitle(item.step[0].stepText);
      for (let option of item.step[0].options) {
        if (option.additionalPrice !== 0.00) {
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
          item.extraPrice = array[0];
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
