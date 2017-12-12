import { Component } from '@angular/core';
import { NavParams, LoadingController, NavController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';

import { LocationPage } from "../../pages/location/location";
import { CartPage } from '../../pages/cart/cart';
import { IngredientsPage } from '../../pages/ingredients/ingredients';

import { MenuApi, ItemApi, CartApi, GlobalVarApi } from '../../services/service';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
  providers: [Http]
})

export class MenuPage {
  location: any;
  mode: any;
  menu: any;
  passedCategory: any;
  cartCount: any;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public loadingController: LoadingController,
    private translateService: TranslateService,
    private menuApi: MenuApi,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi
  ) {
    this.mode = this.navParams.data;
    if (this.mode && this.mode.resetFlag === true) {
      this.globalvarApi.reset();
      this.cartCount = 0;
    }
    this.location = this.globalvarApi.getLocation();
    this.cartCount = this.globalvarApi.getCount();
  }

  changeLocation($event) {
    this.navCtrl.push(LocationPage, location);
  }

  ionViewDidLoad() {
    let loader = this.loadingController.create();
    this.translateService.get('LOADER.MENU').subscribe(
      value => {
        loader.setContent(value);
        loader.present();
        let restaurantID = this.location.restaurantId;
        let entityID = this.location.entityId;
        this.menuApi.getMenu(entityID, restaurantID).then(data => {
          loader.dismiss();
          this.menu = data[0].category;
        });
      }
    )
  }

  presentPopup($event, item) {
    if (item.step != undefined && item.step[0] != undefined) {
      let alert = this.alertCtrl.create();
      alert.setTitle(item.step[0].stepText);
      for (let option of item.step[0].options) {
        if (option.optionAdditionalPrice !== 0.00) {
          let text = option.optionText + "(+ $" + option.optionAdditionalPrice + ")";
          alert.addInput({
            type: 'radio',
            label: text,
            value: option.optionAdditionalPrice + ',' + option.optionText,
            checked: false
          });
        }
        else {
          alert.addInput({
            type: 'radio',
            label: option.text,
            value: option.optionAdditionalPrice + ',' + option.optionText,
            checked: false
          });
        }
      }
      this.translateService.get('BUTTON.OK').subscribe(
        value => {
          alert.addButton({
            text: value,
            handler: selected => {
              let array = selected.split(',');
              item.stepSelected = array[1];
              item.extraPrice = parseFloat(array[0]);
              //item.itemPrice = item.itemPrice + item.extraPrice;
              this.itemTapped($event, item)
            }
          });
        }
      )
      this.translateService.get('BUTTON.CANCEL').subscribe(
        value => {
          alert.addButton(value);
        }
      )
      alert.present();
    }
    else {
      this.itemTapped($event, item)
    }
  }

  itemTapped($event, item) {
    this.navCtrl.push(IngredientsPage, item);
  }

  navigate($event, name) {
    switch (name) {
      case 'menu':
        break;
      case 'cart':
        break;
      case 'grabby':
        break;
      case 'profile':
        break;
      default:
    }
  }
}
