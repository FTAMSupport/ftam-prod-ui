import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Content } from "ionic-angular";

import { SingleItem } from '../../pages/single-item/single-item';
import { CartPage } from '../../pages/cart/cart';
import { MenuPage } from '../menu/menu';

import { ItemApi, CartApi, GlobalVarApi } from '../../services/service';


@Component({
  selector: 'page-ingredients',
  templateUrl: 'ingredients.html',
  providers: [Http]
})

export class IngredientsPage {
  public item: any;
  public location: any;
  public cartCount: any;
  public passedCategory: any;
  public toggleShowHide = true;
  public qty: number = 1;
  public notes: string;
  
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public loadingController: LoadingController,
    private itemApi: ItemApi,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi
  ) {
    this.location = this.globalvarApi.getLocation();
    this.cartCount = this.globalvarApi.getCount();
    this.item = this.navParams.data;
    this.item.name = this.item.stepSelected != undefined ? (this.item.itemName + " ( " + this.item.stepSelected + " )") : this.item.itemName;
    this.item.price = this.item.extraPrice != undefined ? (this.item.itemPrice + parseFloat(this.item.extraPrice)) : this.item.itemPrice;
  }

  callScroll() {
    // use the content's dimension to obtain the current height of the scroll
    let dimension = this.content.getContentDimensions();
    // scroll to it (you can also set the duration in ms by passing a third parameter to the scrollTo(x,y,duration) method.
    this.content.scrollTo(0, dimension.scrollHeight);
  }

  modifyItem($event, item) {
    this.toggleShowHide = !this.toggleShowHide;
    this.callScroll();
  }

  selectIng(e, ing) {
    console.log(e.checked);
    if (ing.ingredientAdditionalPrice != undefined) {
      switch (e.checked) {
        case true:
         this.item.price = this.item.price + ing.ingredientAdditionalPrice;
          break;
        case false:
          this.item.price = this.item.price - ing.ingredientAdditionalPrice;
          break;
        default:
          console.log("default");
      }
    }
  }

  addToCart($event, item) {
    console.log("item added to cart");
    item.notes = this.notes;
    item.qty = this.qty;
    if (this.qty != undefined || this.qty != null) {
      item.totalPrice = this.qty * item.price;
    }
    item = this.itemApi.updateName(item);
    this.navCtrl.push(CartPage, item);
  }

  increment(value) {
      if (value < this.location.config.maxOrders) {
      this.qty = value + 1;
    } else {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'This is considered a bulk order! Please contact restaurant for better service.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  decrement(value) {
    if (value > 0) {
     this.qty = value - 1;
    } else {
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Quantity cannot be negetive',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  navigate($event, name) {
    switch (name) {
      case 'menu':
        this.navCtrl.push(MenuPage);
        break;
      case 'cart':
        console.log("Cart TAPPED");
        break;
      case 'grabby':
        console.log("Grabby TAPPED");
        break;
      case 'profile':
        console.log("Profile TAPPED");
        break;
      default:
    }
  }
}
