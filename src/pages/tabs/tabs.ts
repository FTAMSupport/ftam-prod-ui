import { Component } from '@angular/core';

import { ListPage } from '../list/list';
import { HomePage } from '../home/home';
import { CartPage } from '../cart/cart';
import { MenuPage } from '../menu/menu';
import { UserprofilePage } from '../userprofile/userprofile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MenuPage;
  tab2Root = CartPage;
  tab3Root = UserprofilePage;
  tab4Root = HomePage;
  tab5Root = ListPage;
  constructor() {

  }
}
