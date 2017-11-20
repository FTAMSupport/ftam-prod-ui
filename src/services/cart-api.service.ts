import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVarApi } from '../services/global-vars-api.service';

@Injectable()
export class CartApi {
  public cart = [];
  constructor(
    private http: Http,
    private globalvarApi: GlobalVarApi
  ) {
    // Get cartItem details from global-var
    this.cart = this.globalvarApi.getCartItems();
  }

  getCount() {
    return this.cart.length;
  }

  getCart() {
    const url = 'http://grabbyapi.azurewebsites.net/api/menu/getByRestaurantId/' + 1;
    return new Promise(resolve => {
      //this.http.get('assets/menu.json')
      this.http.get(url)
        .subscribe(res => resolve(res.json()));
    });
  }

  getCart1() {
    return new Promise(resolve => {
      this.http.get('assets/menu.json')
        .subscribe(res => resolve(res.json()));
    });
  }

  emptyCart() {
    for (var i = 0; i < this.cart.length; i++) {
      this.cart.splice(i, 1);
      i--;
    }
  }

  removeItemById(id) {
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].id == id) {
        this.cart.splice(i, 1);
        break;
      }
    }
  }

  quantityPlus(item) {
    let result = item.qty;
    item.qty = result + 1;
  //  this.taxLookUp(this.cart);
  }

  quantityMinus(item) {
   let result = item.qty;
   item.qty = result - 1;
  // this.taxLookUp(this.cart);
  }

  // amount = total of (price*qty + tax)
  getGrandTotal(): number {
    var amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += (this.cart[i].itemPrice * this.cart[i].qty);
      amount += this.cart[i].tax;
    }
    return Math.round(amount * 100) / 100;
  }

   // amount = total of (price*qty)
  getSubTotal(): number{
    var amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += (this.cart[i].itemPrice * this.cart[i].qty);
    }
    return Math.round(amount * 100) / 100;
  }

   // amount = toal of (tax)
  getTaxTotal(): number{
    var amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += amount += this.cart[i].tax;
    }
    return Math.round(amount * 100) / 100;
  }

  // service to lookup the cartItems and return the associated taxes
  taxLookUp(cartItems) {
    var data = {
      "customerID": "CustomerG",
      "deliveredBySeller": false,
      "cartID": "00001",
      "destination": {
        "Address1": "SW A Street",
        "City": "Bentonville",
        "State": "AR",
        "Zip5": "72712",
        "Zip4": ""
      },
      "origin": {
        "Address1": "SW A Street",
        "City": "Bentonville",
        "State": "AR",
        "Zip5": "72712",
        "Zip4": ""
      },
      "cartItems": []
    };
    for (var i = 0; i < cartItems.length; i++) {
      data["cartItems"].push(
        {
          "Qty": cartItems[i].qty,
          "Price": cartItems[i].totalPrice,
          "TIC": "00000",
          "ItemID": cartItems[i].itemId,
          "Index": i
        }
      );
    }
   // const url = 'http://localhost:3001/api/tax/lookup';
    const url = 'http://grabbyapi.azurewebsites.net/api/tax/lookup';
    var body = data;
    return new Promise(resolve => {
      this.http.post(url, body)
        .subscribe(
        res => {
          console.log(res["_body"]);
          var taxes = JSON.parse(res["_body"]);
          for (var i = 0; i < cartItems.length; i++) {
            var cartItem = taxes["CartItemsResponse"].filter(function (obj) {
              return obj.CartItemIndex === i;
            });
            cartItems[i]["tax"] = cartItem[0]["TaxAmount"];
          }
        }
        //  res => resolve(res.json())
        );
    });
  }

}
