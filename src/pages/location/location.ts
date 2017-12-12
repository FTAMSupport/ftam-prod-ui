import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import { MenuPage } from '../menu/menu';

import { LocationApi } from '../../services/location-api.service';
import { GlobalVarApi } from '../../services/global-vars-api.service';

@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
  providers: [Http]
})

export class LocationPage {

  locations: any;
  passedCategory: any;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    public loadingController: LoadingController,
    private translateService: TranslateService,
    private locationApi: LocationApi,
    private globalvarApi: GlobalVarApi
  ) {
    //this.category = this.navParams.data;
    this.passedCategory = this.navParams.get('category');
  }

  segmentChanged(event) {
    this.translateService.use(event._value);
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create({
      content: "Fetching Location Info.."
    });
    loader.present();
    this.locationApi.getLocation().then(data => {
      loader.dismiss();
      this.locations = data;
      this.locations = this.locations.filter(item => item.disabled == false);
      this.locations = this.locations.filter(item => item.category == this.passedCategory);
      if (this.locations.length === 1) {
        this.locationTapped(this.locations[0]);
      }
    });
  }

  getLocation(searchbar) {
    var q = searchbar.srcElement.value;
    if (!q) {
      let loader = this.loadingController.create({
        content: "Getting Locations Info..."
      });
      loader.present();
      this.locationApi.getLocation().then(data => {
        loader.dismiss();
        this.locations = data
      });
    }
    this.locations = this.locations.filter((v) => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  locationTapped(location) {
    this.globalvarApi.setLocation(location);
    location.trigger = "LocationPage";
    this.navCtrl.push(MenuPage, location);
  }
}
