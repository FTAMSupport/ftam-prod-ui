import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class MenuApi {
  constructor(private http: Http) {}
  getMenu(){
    const url = 'http://grabbyapi-dev.azurewebsites.net/api/menu/getByRestaurantId/' + 1;
    return new Promise(resolve => {
      //this.http.get('assets/menu.json')
      this.http.get(url)
        .subscribe(res => resolve(res.json()));
    });
  }
} 

