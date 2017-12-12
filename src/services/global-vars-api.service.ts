import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class GlobalVarApi {
  public location: any;
  public phoneNo: any;
  public paymentInfo: any;
  public cartItems: any;
  public grandTotal: any;
  public subTotal: any;
  public taxTotal: any;
  constructor() {
    this.location = "";
    this.cartItems = [];
    this.paymentInfo = {};
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
  getCount() {
    return this.cartItems.length;
  }

  //-- phone number
  setPhoneNo(value) {
    this.phoneNo = value;
  }
  getPhoneNo() {
    return this.phoneNo;
  }

  //-- payment details
  setPaymentInfo(value) {
    this.paymentInfo = value;
  }
  getPaymentInfo() {
    return this.paymentInfo;
  }
  //-- reset
  reset() {
   // this.location = [];
    this.cartItems = [];
  }

}
