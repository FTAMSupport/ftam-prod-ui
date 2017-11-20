import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Content } from "ionic-angular";

// Import pages to allow links to the page
import { SingleItem } from '../../pages/single-item/single-item';
import { CartPage } from '../../pages/cart/cart';
import { MenuPage } from '../menu/menu';

// Service import for items
import { ItemApi, CartApi, GlobalVarApi } from '../../services/service';

// The component imports the specific parts from the html and scss file.
// The Http provider is included to make the API call to the service.
@Component({
  selector: 'page-ingredients',
  templateUrl: 'ingredients.html',
  providers: [Http],
  styles: [`
  .scroll-content {
    display: flex;
    flex-direction: column;
  }
  .scroll-content ion-list {
    margin-top: auto;
    margin-bottom: 0;
  }
`]
})

export class IngredientsPage {
  // The items array to populate with data is created
  public item: any;
  public location: any;
  public passedCategory: any;
  public toggleShowHide = true;
  public qty: number = 1;
  public notes: string;
  cartCount: any;
  
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private itemApi: ItemApi,
    private cartApi: CartApi,
    private globalvarApi: GlobalVarApi,
    public loadingController: LoadingController
  ) {
    // Get location details from global-var
    this.location = this.globalvarApi.getLocation();
    this.item = this.navParams.data;
    if (this.item.stepSelected != undefined) {
      this.item.name = this.item.name + " " + this.item.stepSelected;
    }
    if (this.item.extraPrice != undefined) {
      //this.item.price = parseInt(this.item.itemPrice, 100) + parseInt(this.item.extraPrice, 100);
      this.item.price = this.item.itemPrice + parseInt(this.item.extraPrice);
      
    }
    else{
      this.item.price = this.item.itemPrice;
    }
    console.log(this.item);
    // Cart Count
    this.cartCount = this.globalvarApi.getCount();
  }
  //Scroll
  callScroll() {
    // use the content's dimension to obtain the current height of the scroll
    let dimension = this.content.getContentDimensions();
    // scroll to it (you can also set the duration in ms by passing a third parameter to the scrollTo(x,y,duration) method.
    this.content.scrollTo(0, dimension.scrollHeight);
  }

  // This function is an event to listen to clicks on elements.
  modifyItem($event, item) {
    this.toggleShowHide = !this.toggleShowHide;
    this.callScroll();
    // console.log("modify pressed");
  }

  selectIng(e, ing) {
    console.log(e.checked);
    if (ing.ingredientAdditionalPrice != undefined) {
      switch (e.checked) {
        case true:
         // this.item.itemPrice = parseInt(this.item.itemPrice, 100) + parseInt(ing.ingredientAdditionalPrice, 100);
         this.item.itemPrice = this.item.itemPrice + ing.ingredientAdditionalPrice;
         console.log(this.item.itemPrice);
          break;
        case false:
          //this.item.itemPrice = parseInt(this.item.itemPrice, 100) - parseInt(ing.ingredientAdditionalPrice, 100);
          this.item.itemPrice = this.item.itemPrice - ing.ingredientAdditionalPrice;
          console.log(this.item.itemPrice);
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
    //if (value < parseInt(this.location.config.maxOrders, 10)) {
      if (value < this.location.config.maxOrders) {
      //this.qty = parseInt(value, 10) + 1;
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
     // this.qty = parseInt(value, 10) - 1;
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
