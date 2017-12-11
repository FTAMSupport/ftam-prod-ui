import { Component, OnDestroy } from '@angular/core';
import { AuthNetService } from "../angular-anet/angular-anet.service";
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CardModule } from 'ngx-card/ngx-card';
import { Subscription } from "rxjs";
import {
  AnetResponse, MerchantAuthentication, Message, OpaqueData,
  CardData
} from "../angular-anet/angular-anet.model";
// Service import for items
import { ItemApi, GlobalVarApi } from '../services/service';
import { CartPage } from '../pages/cart/cart';

@Component({
  selector: 'page-checkout',
  templateUrl: 'exm.component.html',
  providers: [Http, CardModule]
})
export class ExmComponentPage implements OnDestroy {
  // The items array to populate with data is created
  item: any;
  authNetResponses: Subscription;
  merchantAuth: MerchantAuthentication;
  cardData: CardData;
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

  constructor(private navParams: NavParams,
    public navCtrl: NavController,
    private authNetService: AuthNetService,
    private itemApi: ItemApi,
    private globalApi: GlobalVarApi,
    public loadingController: LoadingController,
    private alertCtrl: AlertController) {
    this.item = this.navParams.data;
    this.paymentInfo = this.globalApi.getPaymentInfo();
    if (this.paymentInfo["number"]) {
      this.paymentNumber = this.paymentInfo["number"];
    }
    if (this.paymentInfo["name1"]) {
      this.paymentName1 = this.paymentInfo["name1"];
    }
    if (this.paymentInfo["name2"]) {
      this.paymentName2 = this.paymentInfo["name2"];
    }
    if (this.paymentInfo["expiry"]) {
      this.paymentExpiry = this.paymentInfo["expiry"];
    }
    if (this.paymentInfo["cvc"]) {
      this.paymentCVC = this.paymentInfo["cvc"];
    }
    console.log(this.item);

    this.item = this.navParams.data;
/*     this.authNetResponses = authNetService
      .anetResponses
      .subscribe(this.onSuccess, this.onError); */
  }

  private sendPaymentDataToAnet(form) {
    this.authNetResponses = this.authNetService
    .anetResponses
    .subscribe(this.onSuccess, this.onError);
    this.merchantAuth = new MerchantAuthentication();
    this.merchantAuth.clientKey = "5MpJ8um8d4QErWbHXfxynsf8K3Bb7uQd6m42JhMwr5y2HraSWcdLpUbGjuqZD627";
    this.merchantAuth.apiLogin = "4yLWw73E";
    this.cardData = {
      fullName: this.paymentName1 + " " + this.paymentName2,
      cardNumber: this.paymentNumber,
      cardCode: this.paymentCVC,
      zip: "46282",
      month: this.paymentExpiry.substring(0, 2),
      year: this.paymentExpiry.substring(3, 7)
    }
    this.authNetService.authorize(this.cardData);
  }

  private onError = (errMesg: Message) => {
    let alert = this.alertCtrl.create({
      title: 'Incorrect info',
      subTitle: JSON.stringify(errMesg.text),
    });
    alert.addButton({
      text: 'Ok',
      role: 'cancel',
      handler: data => {
        console.log("card info - Ok");
       // this.authNetResponses.unsubscribe();
       // this.navCtrl.push(ExmComponentPage);
       // alert.dismiss();
        //this.checkOut($event, item);
      }
    });
    alert.addButton({
      text: 'Cancel',
      handler: data => {
        console.log("card info - Cancel");
        this.navCtrl.push(CartPage, {"payment" : "cancel"});
        //this.checkOut($event, item);
      }
    });
    alert.present();
  }
  private onSuccess = (opaqueData: OpaqueData) => {
    //capture opaqueData
    this.paymentInfo = this.globalApi.getPaymentInfo();
    this.paymentInfo["number"] = this.paymentNumber;
    this.paymentInfo["name1"] = this.paymentName1;
    this.paymentInfo["name2"] = this.paymentName2;
    this.paymentInfo["expiry"] = this.paymentExpiry;
    this.paymentInfo["cvc"] = this.paymentCVC;
    this.paymentInfo["dataDescriptor"] = opaqueData["dataDescriptor"];
    this.paymentInfo["dataValue"] = opaqueData["dataValue"];
    this.globalApi.setPaymentInfo(this.paymentInfo);
    this.paymentInfo = this.globalApi.getPaymentInfo();
    this.navCtrl.push(CartPage, {"payment" : "OK"});
    }

  ngOnDestroy() {
    this.authNetResponses.unsubscribe();
  }


}
