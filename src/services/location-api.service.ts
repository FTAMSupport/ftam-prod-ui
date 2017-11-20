import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVarApi } from '../services/global-vars-api.service';

@Injectable()
export class LocationApi {
  constructor(private http: Http,
    private globalvarApi: GlobalVarApi) {
    // Reset all the values
    this.globalvarApi.reset();
    }
  getLocation(){
    this.globalvarApi.reset();
    return new Promise(resolve => {
      //this.http.get('assets/restaurant.json')
      this.http.get('http://grabbyapi.azurewebsites.net/api/restaurant/getAllRestaurants')
        .subscribe(
          res => resolve(res.json()));
    });
  }
}
