import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CardModule } from 'ngx-card/ngx-card';
//import './AcceptUI.js';

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
  template: `
  <form id="send_hptoken" action="https://test.authorize.net/payment/payment" method="post" target="load_payment" >
	<input type="hidden" name="token" value="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.4yLWw73E" />
</form>
  `,
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
  paymentFormUpdate(opaqueData) {
    console.log("clicked payment form update");
   // document.getElementById("dataDescriptor").value = opaqueData.dataDescriptor;
   // document.getElementById("dataValue").value = opaqueData.dataValue;

    // If using your own form to collect the sensitive data from the customer,
    // blank out the fields before submitting them to your server.
    // document.getElementById("cardNumber").value = "";
    // document.getElementById("expMonth").value = "";
    // document.getElementById("expYear").value = "";
    // document.getElementById("cardCode").value = "";

    //document.getElementById("paymentForm").submit();
}

  responseHandler(response) {
    if (response.messages.resultCode === "Error") {
        var i = 0;
        while (i < response.messages.message.length) {
            console.log(
                response.messages.message[i].code + ": " +
                response.messages.message[i].text
            );
            i = i + 1;
        }
    } else {
        this.paymentFormUpdate(response.opaqueData);
    }
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
