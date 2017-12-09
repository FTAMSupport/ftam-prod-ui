import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { GlobalVarApi } from '../services/global-vars-api.service';
import { Observable } from 'rxjs/Observable';
import {EnvConfigurationProvider} from "gl-ionic2-env-configuration";
import {ITestAppEnvConfiguration} from "../env-configuration/ITestAppEnvConfiguration";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CartApi {
  public cart = [];
  private errorMessage: any = '';
  private config: ITestAppEnvConfiguration;
  constructor(
    private http: Http,
    private globalvarApi: GlobalVarApi,
    private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>
  ) {
    this.config = envConfiguration.getConfig();
    // Get cartItem details from global-var
    this.cart = this.globalvarApi.getCartItems();
  }

  getCount() {
    return this.cart.length;
  }

  getCart() {
    const url = this.config.apiUrl + "/api/menu/getByRestaurantId/" + 1;
   // const url = 'http://grabbyrg.azurewebsites.net/api/menu/getByRestaurantId/' + 1;
   // const url = 'http://localhost:3001/api/menu/getByRestaurantId/' + 1;
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
    console.log(this.config);
    for (var i = 0; i < this.cart.length; i++) {
      this.cart.splice(i, 1);
      i--;
    }
  }

  removeItemById(id) {
    console.log(this.config);
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
  getSubTotal(): number {
    var amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += (this.cart[i].itemPrice * this.cart[i].qty);
    }
    return Math.round(amount * 100) / 100;
  }

  // amount = toal of (tax)
  getTaxTotal(): number {
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
    const url = this.config.apiUrl + "/api/tax/lookup";
    // const url = 'http://localhost:3001/api/tax/lookup';
    // const url = 'http://grabbyrg.azurewebsites.net/api/tax/lookup';
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
        },
        error =>
          this.errorMessage = <any>error
        //  res => resolve(res.json())
        );
    });
  }

  createOrder(orderInfo, paymentInfo) {
    const url = this.config.apiUrl + "/api/order";
   // const url = 'http://localhost:3001/api/order';
  // const url = 'http://grabbyrg.azurewebsites.net/api/order';
    var body = {
      "id": 9997,
      "entity_id": 1,
      "restaurant_id": 1,
      "parent_id": 0,
      "order_number": "728",
      "order_key": "wc_order_58d2d042d1d",
      "created_via": "rest-api",
      "version": "3",
      "order_status": "processing",
      "currency": "USD",
      "date_created": "2017-03-22T16:28:02",
      "date_created_gmt": "2017-03-22T19:28:02",
      "date_modified": "2017-03-22T16:28:08",
      "date_modified_gmt": "2017-03-22T19:28:08",
      "discount_total": "0.00",
      "discount_tax": "0.00",
      "shipping_total": "10.00",
      "shipping_tax": "0.00",
      "cart_tax": "1.35",
      "total": "29.35",
      "total_tax": "1.35",
      "prices_include_tax": false,
      "customer_id": 0,
      "customer_ip_address": "",
      "customer_user_agent": "",
      "customer_note": "",
      "billing": {
        "first_name": "John",
        "last_name": "Doe",
        "company": "",
        "address_1": "969 Market",
        "address_2": "",
        "city": "San Francisco",
        "state": "CA",
        "postcode": "94103",
        "country": "US",
        "email": "john.doe@example.com",
        "phone": "(555) 555-5555"
      },
      "shipping": {
        "first_name": "John",
        "last_name": "Doe",
        "company": "",
        "address_1": "969 Market",
        "address_2": "",
        "city": "San Francisco",
        "state": "CA",
        "postcode": "94103",
        "country": "US"
      },
      "payment_method": "bacs",
      "payment_method_title": "Direct Bank Transfer",
      "transaction_id": "",
      "date_paid": "2017-03-22T16:28:08",
      "date_paid_gmt": "2017-03-22T19:28:08",
      "date_completed": null,
      "date_completed_gmt": null,
      "cart_hash": "",
      "meta_data": [
        {
          "id": 13106,
          "key": "_download_permissions_granted",
          "value": "yes"
        }
      ],
      "line_items": [
        {
          "id": 315,
          "name": "Woo Single #1",
          "product_id": 93,
          "variation_id": 0,
          "quantity": 2,
          "tax_class": "",
          "subtotal": "6.00",
          "subtotal_tax": "0.45",
          "total": "6.00",
          "total_tax": "0.45",
          "taxes": [
            {
              "id": 75,
              "total": "0.45",
              "subtotal": "0.45"
            }
          ],
          "meta_data": [],
          "sku": "",
          "price": 3
        },
        {
          "id": 316,
          "name": "Ship Your Idea &ndash; Color: Black, Size: M Test",
          "product_id": 22,
          "variation_id": 23,
          "quantity": 1,
          "tax_class": "",
          "subtotal": "12.00",
          "subtotal_tax": "0.90",
          "total": "12.00",
          "total_tax": "0.90",
          "taxes": [
            {
              "id": 75,
              "total": "0.9",
              "subtotal": "0.9"
            }
          ],
          "meta_data": [
            {
              "id": 2095,
              "key": "pa_color",
              "value": "black"
            },
            {
              "id": 2096,
              "key": "size",
              "value": "M Test"
            }
          ],
          "sku": "Bar3",
          "price": 12
        }
      ],
      "tax_lines": [
        {
          "id": 318,
          "rate_code": "US-CA-STATE TAX",
          "rate_id": 75,
          "label": "State Tax",
          "compound": false,
          "tax_total": "1.35",
          "shipping_tax_total": "0.00",
          "meta_data": []
        }
      ],
      "shipping_lines": [
        {
          "id": 317,
          "method_title": "Flat Rate",
          "method_id": "flat_rate",
          "total": "10.00",
          "total_tax": "0.00",
          "taxes": [],
          "meta_data": []
        }
      ],
      "fee_lines": [],
      "coupon_lines": [],
      "refunds": [],
      "_links": {
        "self": [
          {
            "href": "https://example.com/wp-json/wc/v2/orders/727"
          }
        ],
        "collection": [
          {
            "href": "https://example.com/wp-json/wc/v2/orders"
          }
        ]
      }
    };
    return new Promise(resolve => {
      this.http.post(url, body)
        .subscribe(
        res => {
          console.log(res["_body"]);
          var orderDetails = JSON.parse(res["_body"]);
          return orderDetails;
        },
        error => {
          this.errorMessage = <any>error;
          return this.errorMessage;
        }

        //  res => resolve(res.json())
        );
    });
  }

  // get IP addres
  getIPAdress() {
    return this.http.get('https://ipv4.myexternalip.com/json')
      .map(this.extractData)
      .catch(this.handleError);
  }

  //populate Order details
  populateOrderdata(orders, payments){
    var body = {
      "id": 9997,
      "entity_id": 1,
      "restaurant_id": 1,
      "parent_id": 0,
      "order_number": "728",
      "order_key": "wc_order_58d2d042d1d",
      "created_via": "rest-api",
      "version": "3",
      "order_status": "processing",
      "currency": "USD",
      "date_created": "2017-03-22T16:28:02",
      "date_created_gmt": "2017-03-22T19:28:02",
      "date_modified": "2017-03-22T16:28:08",
      "date_modified_gmt": "2017-03-22T19:28:08",
      "discount_total": "0.00",
      "discount_tax": "0.00",
      "shipping_total": "10.00",
      "shipping_tax": "0.00",
      "cart_tax": "1.35",
      "total": "29.35",
      "total_tax": "1.35",
      "prices_include_tax": false,
      "customer_id": 0,
      "customer_user_agent": "",
      "customer_note": "",
      "billing": {
        "first_name": "John",
        "last_name": "Doe",
        "company": "",
        "address_1": "969 Market",
        "address_2": "",
        "city": "San Francisco",
        "state": "CA",
        "postcode": "94103",
        "country": "US",
        "email": "john.doe@example.com",
        "phone": "(555) 555-5555"
      },
      "shipping": {
        "first_name": "John",
        "last_name": "Doe",
        "company": "",
        "address_1": "969 Market",
        "address_2": "",
        "city": "San Francisco",
        "state": "CA",
        "postcode": "94103",
        "country": "US"
      },
      "payment_method": "bacs",
      "payment_method_title": "Direct Bank Transfer",
      "transaction_id": "",
      "date_paid": "2017-03-22T16:28:08",
      "date_paid_gmt": "2017-03-22T19:28:08",
      "date_completed": null,
      "date_completed_gmt": null,
      "cart_hash": "",
      "meta_data": [
        {
          "id": 13106,
          "key": "_download_permissions_granted",
          "value": "yes"
        }
      ],
      "line_items": [
        {
          "id": 315,
          "name": "Woo Single #1",
          "product_id": 93,
          "variation_id": 0,
          "quantity": 2,
          "tax_class": "",
          "subtotal": "6.00",
          "subtotal_tax": "0.45",
          "total": "6.00",
          "total_tax": "0.45",
          "taxes": [
            {
              "id": 75,
              "total": "0.45",
              "subtotal": "0.45"
            }
          ],
          "meta_data": [],
          "sku": "",
          "price": 3
        },
        {
          "id": 316,
          "name": "Ship Your Idea &ndash; Color: Black, Size: M Test",
          "product_id": 22,
          "variation_id": 23,
          "quantity": 1,
          "tax_class": "",
          "subtotal": "12.00",
          "subtotal_tax": "0.90",
          "total": "12.00",
          "total_tax": "0.90",
          "taxes": [
            {
              "id": 75,
              "total": "0.9",
              "subtotal": "0.9"
            }
          ],
          "meta_data": [
            {
              "id": 2095,
              "key": "pa_color",
              "value": "black"
            },
            {
              "id": 2096,
              "key": "size",
              "value": "M Test"
            }
          ],
          "sku": "Bar3",
          "price": 12
        }
      ],
      "tax_lines": [
        {
          "id": 318,
          "rate_code": "US-CA-STATE TAX",
          "rate_id": 75,
          "label": "State Tax",
          "compound": false,
          "tax_total": "1.35",
          "shipping_tax_total": "0.00",
          "meta_data": []
        }
      ],
      "shipping_lines": [
        {
          "id": 317,
          "method_title": "Flat Rate",
          "method_id": "flat_rate",
          "total": "10.00",
          "total_tax": "0.00",
          "taxes": [],
          "meta_data": []
        }
      ],
      "fee_lines": [],
      "coupon_lines": [],
      "refunds": [],
      "_links": {
        "self": [
          {
            "href": "https://example.com/wp-json/wc/v2/orders/727"
          }
        ],
        "collection": [
          {
            "href": "https://example.com/wp-json/wc/v2/orders"
          }
        ]
      }
    };

    // populate customerIP address
    const url = 'https://ipv4.myexternalip.com/json';
    return new Promise(resolve => {
      this.http.get(url)
        .subscribe(res => {
          body["customer_ip_address"] = res.json()["ip"];
          resolve(body);
        },
        error => this.errorMessage = <any>error);
    });
  }

  //Place Order - Reborn
  postOrder(body): Observable<any> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token );
   const url = this.config.apiUrl + "/api/order";
   // return this.http.post('http://localhost:3001/api/order', body, { headers: headers })
   return this.http.post(url, body, { headers: headers })
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || [];
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
