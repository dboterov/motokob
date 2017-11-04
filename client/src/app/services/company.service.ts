import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class CompanyService {
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
    return this._http.get(this.url + 'company/', { headers: headers })
      .map(res => res.json());
  }

  public find(id, token) {
    console.log('consultando empresa ' + id);
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(this.url + 'company/' + id, { headers: headers })
      .map(res => res.json());
  }

  public save(company, token) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    if (company && company._id) {
      //Si viene el ID, se modifica
      return this._http.put(this.url + 'company/', JSON.stringify(company), { headers: headers })
        .map(res => res.json());
    } else {
      //Si no viene el ID, se crea una nueva
      return this._http.post(this.url + 'company/', JSON.stringify(company), { headers: headers })
        .map(res => res.json());
    }

  }
}
