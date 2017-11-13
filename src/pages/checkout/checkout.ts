import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

// Import pages to allow links to the page
import { MenuPage } from '../menu/menu';

// Service import for items
import { ItemApi } from '../../services/service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  providers: [Http]
})

export class CheckoutPage {
  // The items array to populate with data is created
  item: any;
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
              this.navCtrl.push(MenuPage);
            }
}
