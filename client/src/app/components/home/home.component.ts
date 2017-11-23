import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'motokob-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  public identity;
  public token;
  public selectedCompanyId: string = "";
  public selectedCompany: any;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
    //valida que exista informacion de inicio de sesion
    if (this.identity === null) {
      this._router.navigate(['/']);
    }
    //valida que el usuario tenga al menos una empresa asociada
    if (!this.identity.permissions || this.identity.permissions.length === 0) {
      this._userService.removeLocalStorageData();
      this._router.navigate(['/']);
    }
    //si tiene mas de una empresa, le pide que seleccione en cual desea trabajar
    if (this.identity.permissions && this.identity.permissions.length > 1) {
      $("#modal_select_company").modal({ backdrop: 'static', keyboard: false, show: true });
    } else if (this.identity.permissions) {
      this.seleccionarEmpresa(this.identity.permissions[0].company_id);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('motokob.identity');
    localStorage.removeItem('motokob.token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  public seleccionarEmpresa(company_id) {
    localStorage.removeItem('motokob.selectedCompany');
    for (let i = 0; i < this.identity.permissions.length; i++) {
      if (this.identity.permissions[i].companyId === company_id) {
        this.selectedCompany = this.identity.permissions[i];
        localStorage.setItem('motokob.selectedCompany', JSON.stringify(this.identity.permissions[i]));
        $("#modal_select_company").modal('hide');
        this._router.navigate(['/cotizaciones']);
        break;
      }
    }
  }

  public printSelectedCompany() {
    console.log(this.selectedCompanyId);
  }
}
