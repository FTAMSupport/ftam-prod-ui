import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ItemApi {
  public cart = [];
  constructor(private http: Http) {}

  getItems(){
    return new Promise(resolve => {
        this.http.get('assets/data.json')
          .subscribe(res => resolve(res.json()));
    });
  }

  updateName(item){
        for(var i = 0; i < item.ingredients.length; i++){
          if (i === 0){
            item.name = item.name + " with extra " + item.ingredients[i].ingredientName;
          }
          else{
            item.name = item.name + ", " + item.ingredients[i].ingredientName;
          }
        } 
        return item;
    }
}
