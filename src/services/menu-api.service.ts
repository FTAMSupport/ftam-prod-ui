import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { EnvConfigurationProvider } from "gl-ionic2-env-configuration";
import { ITestAppEnvConfiguration } from "../env-configuration/ITestAppEnvConfiguration";

@Injectable()
export class MenuApi {
  private config: ITestAppEnvConfiguration;
  constructor(private http: Http, private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>) {
    this.config = envConfiguration.getConfig();
  }
  getMenu(restaurantID) {
    console.log(restaurantID);
    const url = this.config.apiUrl + "/api/menu/getByRestaurantId/" + restaurantID;
    //const url = 'http://localhost:3001/api/menu/getByRestaurantId/' + restaurantID;
    // const url = 'http://grabbyrg.azurewebsites.net/api/menu/getByRestaurantId/' + restaurantID;
    return new Promise(resolve => {
      //this.http.get('assets/menu.json')
      this.http.get(url)
        .subscribe(res => resolve(res.json()));
    });
  }
}

