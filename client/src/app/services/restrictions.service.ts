import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class RestrictionsService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    public save(restriction, token) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.post(this.url + 'restrictions/', JSON.stringify(restriction), { headers: headers })
            .map(res => res.json());
    }

    public listRestrictions(companyId, token) {
        console.log('consultando restricciones para empresa ' + companyId);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.get(this.url + 'restrictions/installments/' + companyId, { headers: headers })
            .map(res => res.json());
    }

    public getRestrictions(companyId, productId, token) {
        console.log('consultando restricciones para empresa ' + companyId + ' y producto ' + productId);
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.get(this.url + 'restrictions/installments/' + companyId + '/' + productId, { headers: headers })
            .map(res => res.json());
    }
}
