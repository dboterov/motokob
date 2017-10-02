import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class FactorService {
    public url: string;
    private token;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    private getToken() {
        this.token = null;
        const token = JSON.parse(localStorage.getItem('motokob.token'));
        if (typeof token !== 'undefined') {
            this.token = token;
        }
        return this.token;
    }

    listFactors() {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()
        });

        return this._http.get(this.url + 'factor/', { headers: headers })
            .map(res => res.json());
    }
}
