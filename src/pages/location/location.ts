import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

// Import pages to allow links to the page
import { MenuPage } from '../menu/menu';

// Service import for items
import { LocationApi } from '../../services/location-api.service';
import { GlobalVarApi } from '../../services/global-vars-api.service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
  providers: [Http]
})

export class LocationPage {

  // The items array to populate with data is created
  locations: any;
  passedCategory: any;

  constructor(
              public navCtrl: NavController,
              private navParams:NavParams,
              private locationApi: LocationApi,
              private globalvarApi: GlobalVarApi,
              public loadingController: LoadingController
            )
            {
              //this.category = this.navParams.data;
              this.passedCategory = this.navParams.get('category');
            }

  // ------------------------------------------------------------------------------------------
  // FUNCTIONS
  // ------------------------------------------------------------------------------------------

  // This is where the data loads from the service.
  // It happens when the view loads for the first time.
  ionViewDidLoad() {

    let loader = this.loadingController.create({
      content: "Fetching Location Info.."
    });
    loader.present();

    // Get the JSON data from our locationApi
    this.locationApi.getLocation().then(data => {
      loader.dismiss();
      this.locations = data;
      this.locations = this.locations.filter(item => item.disabled == false);
      this.locations = this.locations.filter(item => item.category == this.passedCategory);
      if(this.locations.length === 1){
        this.locationTapped(this.locations[0]);
      }
    });

  }

  // The getItems function is called everytime the searchbar input changes
  getLocation(searchbar) {
    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {

      // Show loader when search is cancelled
      let loader = this.loadingController.create({
        content: "Getting Locations Info..."
      });
      loader.present();

      // fetch the data and dismiss loader
      this.locationApi.getLocation().then(data => {
        loader.dismiss();
        this.locations = data
      });
    }

    this.locations = this.locations.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
  // End of Searchbar Code

  // This function is an event to listen to clicks on elements.
  // The Menu Page has been included to be passed in this function.
  locationTapped(location) {
    // Set location in global-var
    this.globalvarApi.setLocation(location);
    location.trigger = "LocationPage";
    this.navCtrl.push(MenuPage, location);
  }
}
