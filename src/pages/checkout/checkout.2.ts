import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { CardModule } from 'ngx-card/ngx-card';
import { CreditCardValidator } from 'angular-cc-library';

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
  //templateUrl: 'checkout.html',
  template: `<form #demoForm="ngForm" (ngSubmit)="onSubmit(demoForm)" novalidate>
      <input id="cc-number" formControlName="creditCard" type="tel" autocomplete="cc-number" ccNumber>
      <input id="cc-exp-date" formControlName="expirationDate" type="tel" autocomplete="cc-exp" ccExp>
      <input id="cc-cvc" formControlName="cvc" type="tel" autocomplete="off" ccCvc>
  </form>`,
  providers: [Http, CardModule]
})

export class CheckoutPage implements OnInit {
  form: FormGroup;
  submitted: boolean = false;

  constructor(private _fb: FormBuilder) {}

  ngOnInit() {
    this.form = this._fb.group({
      creditCard: ['', [<any>CreditCardValidator.validateCCNumber]],
      expirationDate: ['', [<any>CreditCardValidator.validateExpDate]],
      cvc: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(4)]] 
    });
  }

  onSubmit(form) {
    this.submitted = true;
    console.log(form);
  }
}

/* export class CheckoutPage {
  // The items array to populate with data is created
  item: any;
  cardinfo: any;
  paymentNumber: string = "5424000000000015";
  paymentName1: string = "Shyam";
  paymentName2: string = "Alaparthy";
  paymentExpiry: string = "12/2020";
  paymentCVC: string = "999";
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
  }

  pay() {
    console.log("clicked pay");
  }
} */
