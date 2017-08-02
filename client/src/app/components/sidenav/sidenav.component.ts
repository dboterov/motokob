import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'motokob-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.css'],
  providers: [UserService]
})
export class SideNavComponent implements OnInit {
  public identity;
  public token;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router) {

  }

  ngOnInit() {
    console.log('iniciando componente de navegacion lateral');
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    if (this.identity === null || this.token === null) {
      this._router.navigate(['/']);
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
    document.getElementById("mySidenav").style.width = "350px";
    document.getElementById("overlay").style.display = "inline-block";
    //$('#overlay').toggleClass('overlay-visible');
    //console.log($('#overlay').class('overlay-visible'));
    //$('.body-overlay').css('display: inline-block');
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("overlay").style.display = "none";
  }
}
