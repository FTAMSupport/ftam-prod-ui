import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { GlobalVarApi } from "../services/global-vars-api.service";
import { Observable } from "rxjs/Observable";
import { EnvConfigurationProvider } from "gl-ionic2-env-configuration";
import { ITestAppEnvConfiguration } from "../env-configuration/ITestAppEnvConfiguration";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Injectable()
export class CartApi {
  public cart = [];
  private errorMessage: any = "";
  private config: ITestAppEnvConfiguration;
  constructor(
    private http: Http,
    private globalvarApi: GlobalVarApi,
    private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>
  ) {
    this.config = envConfiguration.getConfig();
    this.cart = this.globalvarApi.getCartItems();
  }

  getCount() {
    return this.cart.length;
  }

  removeItemById(id) {
    //this.cart.filter(x => x.itemId === id);
    // this.cart.filter(x => { return (x.id !== id) });
    for (var i = 0; i < this.cart.length; i++) {
      if (this.cart[i].itemId == id) {
        this.cart.splice(i, 1);
        break;
      }
    }
  }

  quantityPlus(item) {
    let result = item.qty;
    item.qty = result + 1;
  }

  quantityMinus(item) {
    let result = item.qty;
    item.qty = result - 1;
  }

  // amount = total of (price*qty + tax)
  getGrandTotal(): number {
    var amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += this.cart[i].price * this.cart[i].qty;
      amount += this.cart[i].tax;
    }
    this.globalvarApi.grandTotal = amount;
    return amount;
    //return Math.round(amount * 100) / 100;
  }

  // amount = total of (price*qty)
  getSubTotal(): number {
    let amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += this.cart[i].price * this.cart[i].qty;
    }
    this.globalvarApi.subTotal = amount;
    return amount;
    // return Math.round(amount * 100) / 100;
  }

  // amount = toal of (tax)
  getTaxTotal(): number {
    var amount = 0;
    for (var i = 0; i < this.cart.length; i++) {
      amount += this.cart[i].tax;
    }
    this.globalvarApi.taxTotal = amount;
    return amount;
    //return Math.round(amount * 100) / 100;
  }

  taxLookUpNew(cartItems) {
    var data = {
      customerID: "CustomerG",
      deliveredBySeller: false,
      cartID: "00001",
      destination: {
        Address1: "SW A Street",
        City: "Bentonville",
        State: "AR",
        Zip5: "72712",
        Zip4: ""
      },
      origin: {
        Address1: "SW A Street",
        City: "Bentonville",
        State: "AR",
        Zip5: "72712",
        Zip4: ""
      },
      cartItems: []
    };
    for (var i = 0; i < cartItems.length; i++) {
      data["cartItems"].push({
        Qty: cartItems[i].qty,
        Price: cartItems[i].price,
        TIC: "00000",
        ItemID: cartItems[i].itemId,
        Index: i
      });
    }
    const url = this.config.apiUrl + "/api/tax/lookup";
    return new Promise(resolve => {
      this.http.post(url, data).subscribe(
        res => {
          let taxes = JSON.parse(res["_body"]);
          for (var i = 0; i < cartItems.length; i++) {
            let cartItem = taxes["CartItemsResponse"].filter(function(obj) {
              return obj.CartItemIndex === i;
            });
            cartItems[i]["tax"] = cartItem[0]["TaxAmount"];
          }
        },
        error => (this.errorMessage = <any>error)
        //  res => resolve(res.json())
      );
    });
  }

  taxLookUp(cartItems) {
    var data = {
      customerID: "CustomerG",
      deliveredBySeller: false,
      cartID: "00001",
      destination: {
        Address1: "SW A Street",
        City: "Bentonville",
        State: "AR",
        Zip5: "72712",
        Zip4: ""
      },
      origin: {
        Address1: "SW A Street",
        City: "Bentonville",
        State: "AR",
        Zip5: "72712",
        Zip4: ""
      },
      cartItems: []
    };

    console.log(this.globalvarApi.location);

    const taxDocument = {
      type: 'SalesOrder',
      companyCode: 'REBORNTECHNOLOGYLLC',
      date: new Date(),
      customerCode: 'CustomerG',
      addresses: {
        SingleLocation: {
          line1: this.globalvarApi.location.address[0].address1,
          city: this.globalvarApi.location.address[0].city,
          region: this.globalvarApi.location.address[0].state,
          country: "US",
          postalCode: this.globalvarApi.location.address[0].zip
        }
      },
      lines: []
    }


    for (var i = 0; i < cartItems.length; i++) {
      taxDocument["lines"].push({
        quantity: cartItems[i].qty,
        amount: cartItems[i].price,
        taxCode: "00000",
        itemCode: cartItems[i].itemId,
        number: i,
        description: cartItems[i].name
      });
    }
    const url = this.config.apiUrl + "/api/tax/lookup";
    return new Promise(resolve => {
      this.http.post(url, taxDocument).subscribe(
        res => {
          let taxes = JSON.parse(res["_body"]);
          for (var i = 0; i < cartItems.length; i++) {
            let cartItem = taxes["lines"].filter(function(obj) {
              return parseInt(obj.lineNumber) === i;
            });
            cartItems[i]["tax"] = cartItem[0]["taxCalculated"];
          }
        },
        error => (this.errorMessage = <any>error)
        //  res => resolve(res.json())
      );
    });
  }

  // get IP addres
  getIPAdress() {
    return this.http
      .get("https://ipv4.myexternalip.com/json")
      .map(this.extractData)
      .catch(this.handleError);
  }

  //populate Order details Sample
  populateOrderdataSample(orders, payments) {
    var body = {
      id: 9997,
      entity_id: 1,
      restaurant_id: 1,
      parent_id: 0,
      order_number: "728",
      order_key: "wc_order_58d2d042d1d",
      created_via: "rest-api",
      version: "3",
      order_status: "processing",
      currency: "USD",
      date_created: "2017-03-22T16:28:02",
      date_created_gmt: "2017-03-22T19:28:02",
      date_modified: "2017-03-22T16:28:08",
      date_modified_gmt: "2017-03-22T19:28:08",
      discount_total: "0.00",
      discount_tax: "0.00",
      shipping_total: "10.00",
      shipping_tax: "0.00",
      cart_tax: "1.35",
      total: "29.35",
      total_tax: "1.35",
      prices_include_tax: false,
      customer_id: 0,
      customer_user_agent: "",
      customer_note: "",
      billing: {
        first_name: "John",
        last_name: "Doe",
        company: "",
        address_1: "969 Market",
        address_2: "",
        city: "San Francisco",
        state: "CA",
        postcode: "94103",
        country: "US",
        email: "john.doe@example.com",
        phone: "(555) 555-5555"
      },
      shipping: {
        first_name: "John",
        last_name: "Doe",
        company: "",
        address_1: "969 Market",
        address_2: "",
        city: "San Francisco",
        state: "CA",
        postcode: "94103",
        country: "US"
      },
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      transaction_id: "",
      date_paid: "2017-03-22T16:28:08",
      date_paid_gmt: "2017-03-22T19:28:08",
      date_completed: null,
      date_completed_gmt: null,
      cart_hash: "",
      meta_data: [
        {
          id: 13106,
          key: "_download_permissions_granted",
          value: "yes"
        }
      ],
      line_items: [
        {
          id: 315,
          name: "Woo Single #1",
          product_id: 93,
          variation_id: 0,
          quantity: 2,
          tax_class: "",
          subtotal: "6.00",
          subtotal_tax: "0.45",
          total: "6.00",
          total_tax: "0.45",
          taxes: [
            {
              id: 75,
              total: "0.45",
              subtotal: "0.45"
            }
          ],
          meta_data: [],
          sku: "",
          price: 3
        },
        {
          id: 316,
          name: "Ship Your Idea &ndash; Color: Black, Size: M Test",
          product_id: 22,
          variation_id: 23,
          quantity: 1,
          tax_class: "",
          subtotal: "12.00",
          subtotal_tax: "0.90",
          total: "12.00",
          total_tax: "0.90",
          taxes: [
            {
              id: 75,
              total: "0.9",
              subtotal: "0.9"
            }
          ],
          meta_data: [
            {
              id: 2095,
              key: "pa_color",
              value: "black"
            },
            {
              id: 2096,
              key: "size",
              value: "M Test"
            }
          ],
          sku: "Bar3",
          price: 12
        }
      ],
      tax_lines: [
        {
          id: 318,
          rate_code: "US-CA-STATE TAX",
          rate_id: 75,
          label: "State Tax",
          compound: false,
          tax_total: "1.35",
          shipping_tax_total: "0.00",
          meta_data: []
        }
      ],
      shipping_lines: [
        {
          id: 317,
          method_title: "Flat Rate",
          method_id: "flat_rate",
          total: "10.00",
          total_tax: "0.00",
          taxes: [],
          meta_data: []
        }
      ],
      fee_lines: [],
      coupon_lines: [],
      refunds: [],
      _links: {
        self: [
          {
            href: "https://example.com/wp-json/wc/v2/orders/727"
          }
        ],
        collection: [
          {
            href: "https://example.com/wp-json/wc/v2/orders"
          }
        ]
      }
    };

    /*     // populate customerIP address
        const url = 'https://ipv4.myexternalip.com/json';
        return new Promise(resolve => {  
          this.http.get(url)
            .subscribe(res => {
              body["customer_ip_address"] = res.json()["ip"];
              resolve(body);
            },
            error => this.errorMessage = <any>error);
        }); */
    return new Promise(resolve => {
      body["customer_ip_address"] = "162.233.86.111";
      resolve(body);
    });
  }

  //populate payment data
  populatePaymentdata() {
    let body = {
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: this.globalvarApi.grandTotal,
        payment: {
          opaqueData: {
            dataDescriptor: this.globalvarApi.paymentInfo["dataDescriptor"],
            dataValue: this.globalvarApi.paymentInfo["dataValue"]
          }
        },
        lineItems: {},
        poNumber: "",
        billTo: {},
        shipTo: { },
        customerIP: "",
        userFields: {}
      }
    };

    return new Promise(resolve => {
      body["customer_ip_address"] = "162.233.86.111";
      let lineItemList = [];
      this.globalvarApi.cartItems.forEach(element => {
        let items = {};
        items["itemId"] = element.itemId;
        items["name"] = element.name.substring(0,10);
        items["unitPrice"] = element.price; 
        items["description"] =  "description";
        items["quantity"] = element.qty;
        lineItemList.push(items);
      });
      body.transactionRequest["lineItems"] = lineItemList;
      resolve(body);
    });
  }

  //populate Order details
  populateOrderdata() {
    let body = {
      entity_id: this.globalvarApi.location.entityId,
      restaurant_id: this.globalvarApi.location.restaurantId,
      parent_id: 0,
      created_via: "grabby-app",
      currency: "USD",
      version: "1",
      discount_total: "0.00",
      discount_tax: "0.00",
      shipping_total: "0.00",
      shipping_tax: "0.00",
      cart_tax: this.globalvarApi.taxTotal,
      total: this.globalvarApi.grandTotal,
      total_tax: this.globalvarApi.taxTotal,
      prices_include_tax: false,
      customer_id: 0,
      customer_phone_no: this.globalvarApi.getPhoneNo(),
      customer_user_agent: "grabby app",
      customer_note: "",
      payment_method: "cc",
      payment_method_title: "Credit Card Payment",
      line_items: []
    };

    /*     // populate customerIP address
        const url = 'https://ipv4.myexternalip.com/json';
        return new Promise(resolve => {  
          this.http.get(url)
            .subscribe(res => {
              body["customer_ip_address"] = res.json()["ip"];
              resolve(body);
            },
            error => this.errorMessage = <any>error);
        }); */
    return new Promise(resolve => {
      body["customer_ip_address"] = "162.233.86.111";
      this.globalvarApi.cartItems.forEach(element => {
        let items = {};
        items["id"] = element.itemId;
        items["name"] = element.name;
        items["price"] = element.price;
        items["notes"] = element.notes;
        items["qty"] = element.qty;
        items["tax"] = element.tax;
        items["totalPrice"] = element.totalPrice;
        body.line_items.push(items);
      });
      resolve(body);
    });
  }

  postOrder(body): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    const url = this.config.apiUrl + "/api/order";
    return this.http
      .post(url, body, { headers: headers })
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
    let errMsg = error.message
      ? error.message
      : error.status ? `${error.status} - ${error.statusText}` : "Server error";
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
