import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
  public url: string;

  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }

  public makeFileRequest(url: string, method: string, params: Array<string>, files: Array<File>, name: string, token: string) {
    return new Promise(function(resolve, reject) {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append(name, files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr.response);
            //resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open(method, url, true);
      if (token != null) {
        xhr.setRequestHeader('Authorization', token);
      }
      xhr.send(formData);
    });
  }
}
