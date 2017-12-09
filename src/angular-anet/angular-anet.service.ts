import { Injectable } from "@angular/core";
import { WindowRef } from "./window-service";
import { Subject, Observable } from "rxjs";
import { AnetResponse, CardData, MerchantAuthentication, OpaqueData, Message } from "./angular-anet.model";
import Accept from "./Accept.js";
import * as Accept1 from "./Accept.js";
//declare var Accept;

@Injectable()
export class AuthNetService {
  constructor(
    private windowRef: WindowRef) {
    if (!windowRef.nativeWindow.Accept) throw "AuthorizeNet AcceptJS Dependency Missing";
    this.createAnetResponseHandler();
  }

  public merchantAuthentication: MerchantAuthentication;
  private _anetResponse = new Subject<OpaqueData>();
  public anetResponses = this._anetResponse.asObservable();
  public accept = Accept;
  authorize(cardData: CardData) {
    let message = new Message();
    message.code = "0";
    /*     this.merchantAuthentication.clientKey = "5MpJ8um8d4QErWbHXfxynsf8K3Bb7uQd6m42JhMwr5y2HraSWcdLpUbGjuqZD627";
        this.merchantAuthentication.apiLogin = "4yLWw73E";
        message.code = "0";
        if(!this.merchantAuthentication) {
          message.text = "Merchant Auth missing";
          this._anetResponse.error(message);
          return;
        } */
    let secureData: any = {}, authData: any = {};
    secureData.cardData = cardData;
    authData.clientKey = "5MpJ8um8d4QErWbHXfxynsf8K3Bb7uQd6m42JhMwr5y2HraSWcdLpUbGjuqZD627"; //this.merchantAuthentication.clientKey;
    authData.apiLoginID = "4yLWw73E";//this.merchantAuthentication.apiLogin;
    secureData.authData = authData;
    try {
      //  const Accept4 = new Accept();
      this.windowRef.nativeWindow.Accept.dispatchData(secureData, 'anetResponseHandler');
      // this.accept.dispatchData(secureData, 'anetResponseHandler');
    }
    catch (ex) {
      message.text = ex;
      this._anetResponse.error(message);
    }

  }

  private createAnetResponseHandler = () => {
    this.windowRef.nativeWindow['anetResponseHandler'] = (response: AnetResponse) => {
      if (response.messages.resultCode === 'Error') {
        for (var i = 0; i < response.messages.message.length; i++) {
          console.log(response.messages.message[i].code + ':' + response.messages.message[i].text);
        }
        this._anetResponse.error(response.messages.message[0]);
      }
      else {
        this._anetResponse.next(response.opaqueData);
      }
    }
  }
}
