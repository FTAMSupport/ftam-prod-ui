import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MenuApi {
  constructor(private http: Http) {}
  getMenu(restaurantID){
console.log(restaurantID);
    //const url = 'http://localhost:3001/api/menu/getByRestaurantId/' + restaurantID;
    const url = 'http://grabbyrg.azurewebsites.net/api/menu/getByRestaurantId/' + restaurantID;
    return new Promise(resolve => {
      //this.http.get('assets/menu.json')
      this.http.get(url)
        .subscribe(res => resolve(res.json()));
    });
  }
}

