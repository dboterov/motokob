import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class ProductService {
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

  list(page, pageSize, strFilter) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    if(strFilter){
      return this._http.get(this.url + 'product/list/?page=' + page + '&pageSize=' + pageSize + '&strFilter=' + strFilter, { headers: headers })
        .map(res => res.json());
    } else {
      return this._http.get(this.url + 'product/list/?page=' + page + '&pageSize=' + pageSize, { headers: headers })
        .map(res => res.json());
    }
  }

  save(productToSave) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.post(this.url + 'product/save', JSON.stringify(productToSave), { headers: headers })
      .map(res => res.json());
  }

  updateProduct(productToUpdate) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.put(this.url + 'product/update/' + productToUpdate._id, JSON.stringify(productToUpdate), { headers: headers })
      .map(res => res.json());
  }
}
