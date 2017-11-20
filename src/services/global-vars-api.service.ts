import {Injectable} from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GlobalVarApi {
  public location: any;
  public cartItems: any;
  constructor() {
    this.location = "";
    this.cartItems = [];
  }

  //-- chosen location & restaurant info
  setLocation(value) {
    this.location = value;
  }
  getLocation() {
    return this.location;
  }

  //-- cart items
  setCartItems(value) {
    this.cartItems = value;
  }
  getCartItems() {
    return this.cartItems;
  }
  getCount(){
    return this.cartItems.length;
  }

  //-- reset
  reset(){
     this.location = [];
     this.cartItems = [];
  }

}
