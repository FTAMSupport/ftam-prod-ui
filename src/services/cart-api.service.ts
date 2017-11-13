import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVarApi } from '../services/global-vars-api.service';

@Injectable()
export class CartApi {
  public cart = [];
  constructor(
    private http: Http,
    private globalvarApi: GlobalVarApi
  ){
    // Get cartItem details from global-var
    this.cart = this.globalvarApi.getCartItems();
  }

  getCart(){
    const url = 'http://grabbyapi-dev.azurewebsites.net/api/menu/getByRestaurantId/' + 1;
    return new Promise(resolve => {
      //this.http.get('assets/menu.json')
      this.http.get(url)
        .subscribe(res => resolve(res.json()));
    });
  }

  getCart1(){
    return new Promise(resolve => {
      this.http.get('assets/menu.json')
        .subscribe(res => resolve(res.json()));
    });
  }

  emptyCart(){
    for(var i = 0; i < this.cart.length; i++){
      this.cart.splice(i, 1);
      i--;
    }
  }

  removeItemById(id){
    for(var i = 0; i < this.cart.length; i++){
      if(this.cart[i].id == id){
        this.cart.splice(i, 1);
        break;
      }
    }
  }

  quantityPlus(item){
    let result = parseInt(item.qty,10);
    item.qty = result + 1;
  }

  quantityMinus(item){
    let result = parseInt(item.qty,10);
    item.qty = result - 1;
  }

  getGrandTotal(): number{
    var amount = 0;
    for(var i = 0; i < this.cart.length; i++){
      amount += (this.cart[i].itemPrice * this.cart[i].qty);
    }
    return Math.round(amount * 100) / 100;
  }
}
