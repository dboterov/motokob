import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Quotation } from '../models/quotation';

@Injectable()
export class QuotationService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  public cancelActiveQuotation(quotationId: string, token: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.delete(this.url + 'quotation/' + quotationId, { headers: headers })
      .map(res => res.json());
  }

  public createDocument(quotationId: string, token: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + 'quotation/create/' + quotationId, { headers: headers })
      .map(res => res.json());
  }

  public saveQuotation(quotation: Quotation, token: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    if (quotation && quotation._id) {
      //modify existing
      return this._http.put(this.url + 'quotation/' + quotation._id, quotation, { headers: headers })
        .map(res => res.json());
    } else if (quotation && !quotation._id) {
      //create new
      return this._http.post(this.url + 'quotation/', quotation, { headers: headers })
        .map(res => res.json());
    }
  }

  public loadStartedQuotation(user: string, token: string) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.get(this.url + 'quotation?started=yes', { headers: headers })
      .map(res => res.json());
  }
}
