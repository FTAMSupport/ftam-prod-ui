import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CardModule } from 'ngx-card/ngx-card';

// Http import
import { HttpModule } from '@angular/http';

// Page imports
import { CartPage } from '../pages/cart/cart';
import { MenuPage } from '../pages/menu/menu';
import { LocationPage } from '../pages/location/location';
import { IngredientsPage } from '../pages/ingredients/ingredients';
import { CheckoutPage } from '../pages/checkout/checkout';
import { ConfirmationPage } from '../pages/confirmation/confirmation';

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
    LocationPage,
    MenuPage,
    IngredientsPage,
    CartPage,
    CheckoutPage, 
    ConfirmationPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CardModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CartPage,
    MenuPage,
    LocationPage,
    IngredientsPage,
    CheckoutPage,
    ConfirmationPage
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
    CardModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
