import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Http import
import { HttpModule } from '@angular/http';

// Page imports
import { CategoryPage } from '../pages/category/category';
import { ListPage } from '../pages/list/list';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SingleItem } from '../pages/single-item/single-item';
import { CartPage } from '../pages/cart/cart';
import { MenuPage } from '../pages/menu/menu';
import { LocationPage } from '../pages/location/location';
import { IngredientsPage } from '../pages/ingredients/ingredients';
import { CheckoutPage } from '../pages/checkout/checkout';
import { UserprofilePage } from '../pages/userprofile/userprofile';

// Service imports
import { ItemApi } from '../services/item-api.service';
import { LocationApi } from '../services/location-api.service';
import { MenuApi } from '../services/menu-api.service';
import { CartApi } from '../services/cart-api.service';
import { GlobalVarApi } from '../services/global-vars-api.service';

// Native imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    CategoryPage,
    ListPage,
    HomePage,
    SingleItem,
    TabsPage,
    CartPage,
    MenuPage,
    LocationPage,
    IngredientsPage,
    CheckoutPage,
    UserprofilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CategoryPage,
    ListPage,
    HomePage,
    SingleItem,
    TabsPage,
    CartPage,
    MenuPage,
    LocationPage,
    IngredientsPage,
    CheckoutPage,
    UserprofilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ItemApi,
    LocationApi,
    MenuApi,
    CartApi,
    GlobalVarApi,
    HttpModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
