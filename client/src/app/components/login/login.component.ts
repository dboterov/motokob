import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user: User;
  public errorMessage: string;
  public identity;
  public token;

  constructor(private _userService: UserService, private _route: ActivatedRoute, private _router: Router) {
    this.user = new User();
  }

  ngOnInit() {
    console.log('iniciando componente de login');
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    //validar vigencia del token/identity
    if(this.identity != null && this.token != null){
      this._router.navigate(['/home']);
    }
  }

  public onSubmit() {
    this.errorMessage = null;
    if (this.user.username === null || this.user.username.trim().length === 0) {
      this.errorMessage = 'Debes ingresar tu usuario';
      console.log('no se ingreso un usuario');
      return;
    }
    if (this.user.password === null || this.user.password.trim().length === 0) {
      this.errorMessage = 'Debes ingresar una contraseña';
      console.log('no se ingreso una contraseña');
      return;
    }

    console.log('iniciando sesion');
    console.log(this.user.username + ", " + this.user.password);

    this._userService.signIn(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity._id) {
          this.errorMessage = 'Error';
        } else {
          localStorage.setItem('motokob.identity', JSON.stringify(this.identity));
          this._userService.signIn(this.user, true).subscribe(
            resp => {
              this.token = resp.token;
              if (this.token.length <= 0) {
                this.errorMessage = 'Error al generar el token';
              } else {
                localStorage.setItem('motokob.token', JSON.stringify(this.token));
                this.user = new User();
                console.log('navegando a /');
                this._router.navigate(['/home']);
              }
            },
            error => {
              const errorResponse = <any>error;
              if (errorResponse != null) {
                this.errorMessage = JSON.parse(errorResponse._body).message;
                console.error(this.errorMessage);
              }
            }
          );
        }
        console.log(response);
      },
      error => {
        const errorResponse = <any>error;
        if (errorResponse != null) {
          this.errorMessage = JSON.parse(errorResponse._body).message;
          console.error(this.errorMessage);
        }
      }
    );
  }
}
