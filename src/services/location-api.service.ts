import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class LocationApi {
  constructor(private http: Http) {}
  getLocation(){
    return new Promise(resolve => {
      //this.http.get('assets/restaurant.json')
      this.http.get('http://grabbyapi-dev.azurewebsites.net/api/restaurant/getAllRestaurants')
        .subscribe(res => resolve(res.json()));
    });
  }
}
