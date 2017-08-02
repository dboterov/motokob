import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'prueba',
  templateUrl: 'prueba.component.html',
  providers: [UploadService]
})
export class PruebaComponent implements OnInit {
  public image: string;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _uploadService: UploadService) {
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('iniciando componente de prueba');
  }

  public fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    console.log(this.filesToUpload);
  }

  public submit() {
    if (this.filesToUpload) {
      this._uploadService.makeFileRequest(GLOBAL.url + 'prueba/upload/', [], this.filesToUpload, 'image').then(
        (result:string) => {
          console.log(JSON.parse(result));
          console.log(typeof result);
          this.image = JSON.parse(result).image;
          this.filesToUpload = new Array<File>();
        }, (error) => {
          console.error(error);
        }
      );
    } else {
      console.log('no hay archivos para subir');
    }
  }
}
