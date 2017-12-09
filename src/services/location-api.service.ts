import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVarApi } from '../services/global-vars-api.service';
import { EnvConfigurationProvider } from "gl-ionic2-env-configuration";
import { ITestAppEnvConfiguration } from "../env-configuration/ITestAppEnvConfiguration";
@Injectable()
export class LocationApi {
  private config: ITestAppEnvConfiguration;
  constructor(private http: Http,
    private globalvarApi: GlobalVarApi,
    private envConfiguration: EnvConfigurationProvider<ITestAppEnvConfiguration>) {
    this.config = envConfiguration.getConfig();
    // Reset all the values
    this.globalvarApi.reset();
  }
  getLocation() {
    this.globalvarApi.reset();
    return new Promise(resolve => {
      const url = this.config.apiUrl + "/api/restaurant/getAllRestaurants";
      // this.http.get('http://localhost:3001/api/restaurant/getAllRestaurants')
      // this.http.get('http://grabbyrg.azurewebsites.net/api/restaurant/getAllRestaurants')
      this.http.get(url)
        .subscribe(
        res => resolve(res.json()));
    });
  }
}
