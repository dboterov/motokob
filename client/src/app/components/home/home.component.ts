import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'motokob-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  public identity;
  public token;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router) {
    
  }

  ngOnInit() {
    console.log('iniciando componente de home');
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    console.log(this.identity);
    console.log(this.token);
    if (this.identity === null) {
      this._router.navigate(['/']);
    }
  }

  cerrarSesion() {
    console.log('cerrando sesion');
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
}
