import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class BrandService {
  public url: string;
  public token;
  public identity;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  getItentity() {
    this.identity = null;
    const identity = JSON.parse(localStorage.getItem('motokob.identity'));
    if (typeof identity !== 'undefined') {
      this.identity = identity;
    }
    return this.identity;
  }

  getToken() {
    this.token = null;
    const token = JSON.parse(localStorage.getItem('motokob.token'));
    if (typeof token !== 'undefined') {
      this.token = token;
    }
    return this.token;
  }

  listBrands(){
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.get(this.url + 'brand/list/', { headers: headers })
      .map(res => res.json());
  }

  save(brandToSave) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.post(this.url + 'brand/save', JSON.stringify(brandToSave), { headers: headers })
      .map(res => res.json());
  }

  find(brandId) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.get(this.url + 'brand/find/' + brandId, { headers: headers })
      .map(res => res.json());
  }
}
