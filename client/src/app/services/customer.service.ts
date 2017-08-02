import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class CustomerService {
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

  save(customerToSave) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.post(this.url + 'customer/save', JSON.stringify(customerToSave), { headers: headers })
      .map(res => res.json());
  }

  updateCustomer(customerToUpdate) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.put(this.url + 'customer/update/' + customerToUpdate._id, JSON.stringify(customerToUpdate), { headers: headers })
      .map(res => res.json());
  }

  list(page, pageSize, strFilter) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    if (strFilter) {
      return this._http.get(this.url + 'customer/list/?page=' + page + '&pageSize=' + pageSize + '&strFilter=' + strFilter, { headers: headers })
        .map(res => res.json());
    } else {
      return this._http.get(this.url + 'customer/list/?page=' + page + '&pageSize=' + pageSize, { headers: headers })
        .map(res => res.json());
    }
  }

  find(documentNumber) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.get(this.url + 'customer/find/' + documentNumber, { headers: headers })
      .map(res => res.json());
  }
}
