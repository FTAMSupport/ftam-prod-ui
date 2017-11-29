import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import {CardModule} from 'ngx-card/ngx-card';

// Import pages to allow links to the page
import { MenuPage } from '../menu/menu';
import { CartPage } from '../cart/cart';

// Service import for items
import { ItemApi } from '../../services/service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  providers: [Http, CardModule]
})

export class CheckoutPage {
  // The items array to populate with data is created
  item: any;
  cardinfo: any;
  messages: any = {validDate: 'valid\ndate', monthYear: 'mm/yyyy'}; //Strings for translation
  placeholders: any = {number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••'};// Placeholders for rendered fields
  masks: any;
  formatting: boolean = true;
  debug: boolean = false; // If true, will log helpful messages for setting up Card
  constructor(
              public navCtrl: NavController,
              private navParams:NavParams,
              private itemApi: ItemApi,
              public loadingController: LoadingController
            )
            {
              this.item = this.navParams.data;
              console.log(this.item);
            }

            placeNeworder($event) {
              console.log("Place New Order tapped");
              //this.navCtrl.push(MenuPage);
              this.navCtrl.push(CartPage);
            }
            pay() {
              console.log("clicked pay");
            }
}
