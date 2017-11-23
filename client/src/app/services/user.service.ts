import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UserService {
  public url: string;
  public token;
  public identity;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  public signIn(userToLogin, gethash = null) {
    if (gethash != null) {
      userToLogin.gethash = gethash;
    }

    const params = JSON.stringify(userToLogin);
    const headers = new Headers({ 'Content-Type': 'application/json' });

    return this._http.post(this.url + 'user/login', params, { headers: headers })
      .map(res => res.json());
  }

  public getItentity() {
    this.identity = null;
    const identity = JSON.parse(localStorage.getItem('motokob.identity'));
    if (typeof identity !== 'undefined' && identity != null) {
      this.identity = identity;
      this.identity.password = null;
    }
    return this.identity;
  }

  public getToken() {
    this.token = null;
    const token = JSON.parse(localStorage.getItem('motokob.token'));
    if (typeof token !== 'undefined') {
      this.token = token;
    }
    return this.token;
  }

  public removeLocalStorageData() {
    localStorage.removeItem('motokob.token');
    localStorage.removeItem('motokob.identity');
  }

  public register(userToRegister) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + 'user/register', JSON.stringify(userToRegister), { headers: headers })
      .map(res => res.json());
  }

  public updateUser(userToUpdate) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.put(this.url + 'user/update/' + userToUpdate._id, JSON.stringify(userToUpdate), { headers: headers })
      .map(res => res.json());
  }

  public changePassword(userToUpdate) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.put(this.url + 'user/changepassword/' + userToUpdate._id, JSON.stringify(userToUpdate), { headers: headers })
      .map(res => res.json());
  }

  public listUsers(activeOnly: boolean, token) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.get(this.url + 'user/list/' + (activeOnly ? '?showActiveOnly=true' : ''), { headers: headers })
      .map(res => res.json());
  }

  public isAdmin() {
    try {
      return JSON.parse(localStorage.getItem("motokob.selectedCompany")).role === 'ROLE_ADMIN';
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
