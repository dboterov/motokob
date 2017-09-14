import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class CostService {
  public url: string;
  public token;
  public identity;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  public list(token) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(this.url + 'cost/', { headers: headers })
      .map(res => res.json());
  }

  public save(cost, token) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.post(this.url + 'cost/', JSON.stringify(cost), { headers: headers })
      .map(res => res.json());
  }

}
