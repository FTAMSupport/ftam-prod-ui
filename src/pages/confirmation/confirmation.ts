import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CardModule } from 'ngx-card/ngx-card';

// Import pages to allow links to the page
import { MenuPage } from '../menu/menu';
import { CartPage } from '../cart/cart';

// Service import for items
import { ItemApi, CartApi, GlobalVarApi } from '../../services/service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
  providers: [Http, CardModule]
})

export class ConfirmationPage {
  // The items array to populate with data is created
  item: any;
  location: any;
  cardinfo: any;
  orderDetails: any = {
    id: '00001',
    amount: '200 USD',
    description: 'test order',
    receipt_email: 'name@yahoo.com'
  };
  messages: any = { validDate: 'valid\ndate', monthYear: 'mm/yyyy' }; //Strings for translation
  placeholders: any = { number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••' };// Placeholders for rendered fields
  masks: any;
  formatting: boolean = true;
  debug: boolean = false; // If true, will log helpful messages for setting up Card
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private itemApi: ItemApi,
    private globalvarApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {

    // Get location details from global-var
    this.location = this.globalvarApi.getLocation();
  
      this.item = this.navParams.data;
      console.log(this.item);
      if (this.item["order"] !== undefined) {
        this.orderDetails.id = this.item.order.order_number;
      } else
      {
        this.orderDetails.id = "Error in processing order: " + JSON.stringify(this.item);
      }
    }

  placeNeworder() {
    console.log("Place New Order tapped");
    //this.navCtrl.push(MenuPage);
    this.navCtrl.push(MenuPage, {resetFlag: true});
  }
}
