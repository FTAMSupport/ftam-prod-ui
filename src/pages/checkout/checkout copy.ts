import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CardModule } from 'ngx-card/ngx-card';

// Import pages to allow links to the page
import { MenuPage } from '../menu/menu';
import { CartPage } from '../cart/cart';

// Service import for items
import { ItemApi, GlobalVarApi } from '../../services/service';
import { templateJitUrl } from '@angular/compiler';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  providers: [Http, CardModule]
})

export class CheckoutPage {
  // The items array to populate with data is created
  item: any;
  cardinfo: any;
  paymentNumber: string = "";
  paymentName1: string = "";
  paymentName2: string = "";
  paymentExpiry: string = "";
  paymentCVC: string = "";
  paymentInfo = {};

  messages: any = { validDate: 'valid\ndate', monthYear: 'mm/yyyy' }; //Strings for translation
  placeholders: any = { number: '•••• •••• •••• ••••', name: 'Full Name', expiry: '••/••', cvc: '•••' };// Placeholders for rendered fields
  masks: any;
  formatting: boolean = false;
  debug: boolean = false; // If true, will log helpful messages for setting up Card
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private itemApi: ItemApi,
    private globalApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {
    this.item = this.navParams.data;
    this.paymentInfo = this.globalApi.getPaymentInfo();
    if (this.paymentInfo["number"]){
      this.paymentNumber = this.paymentInfo["number"];
    }
    if(this.paymentInfo["name1"]){
      this.paymentName1 = this.paymentInfo["name1"];
    }  
    if(this.paymentInfo["name2"]){
      this.paymentName2 = this.paymentInfo["name2"];
    }
    if(this.paymentInfo["expiry"]){
      this.paymentExpiry = this.paymentInfo["expiry"];
    }
    if(this.paymentInfo["cvc"]){
      this.paymentCVC = this.paymentInfo["cvc"];
    }
    console.log(this.item);
  }

  placeNeworder($event) {
    this.paymentInfo = this.globalApi.getPaymentInfo();
    this.paymentInfo["number"] = this.paymentNumber;
    this.paymentInfo["name1"] = this.paymentName1;
    this.paymentInfo["name2"] = this.paymentName2;
    this.paymentInfo["expiry"] = this.paymentExpiry;
    this.paymentInfo["cvc"] = this.paymentCVC;
    this.globalApi.setPaymentInfo(this.paymentInfo);
    console.log("Place New Order tapped");
    this.navCtrl.push(CartPage);
    /* this.paymentInfo = this.globalApi.getPaymentInfo();
      if (document.getElementById("card-number") != undefined) {
          this.paymentInfo["card-number"] = document.getElementById("card-number")["value"];
        }
        if (document.getElementById("card-name1") != undefined) {
          this.paymentInfo["card-name1"] = document.getElementById("card-name1")["value"];
        }
        if (document.getElementById("card-name2") != undefined) {
          this.paymentInfo["card-name2"] = document.getElementById("card-name2")["value"];
        }
        if (document.getElementById("card-expiry") != undefined) {
          this.paymentInfo["card-expiry"] = document.getElementById("card-expiry")["value"];
        }
        if (document.getElementById("card-cvc") != undefined) {
          this.paymentInfo["card-cvc"] = document.getElementById("card-cvc")["value"];
        }
        if (document.getElementById("card-number")["value"] != "" &&
          document.getElementById("card-name1")["value"] != "" &&
          document.getElementById("card-name2")["value"] != "" &&
          document.getElementById("card-expiry")["value"] != "" &&
          document.getElementById("card-cvc")["value"] != "") {
          //paymentInfo.falg = true;
          this.globalApi.setPaymentInfo(paymentInfo);
          console.log("Place New Order tapped");
          this.navCtrl.push(CartPage);
        }else{
          this.navCtrl.push(CheckoutPage);
        } */
  }

  pay() {
    console.log("clicked pay");
  }
}
