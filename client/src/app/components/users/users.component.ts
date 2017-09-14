import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { User } from '../../models/user';

@Component({
  selector: 'user-admin',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  providers: [UserService, CompanyService]
})
export class UsersComponent implements OnInit {
  public identity;
  public token;
  public errorMessage: string;
  public errorMessageModal: string;
  public successMessage: string;
  public users: Array<User>;
  public user: User;
  public activar: boolean;
  public perfilSeleccionado: string;
  public password1: string;
  public password2: string;
  public companies: Array<string>;

  constructor(private _userService: UserService, private _companyService: CompanyService, private _route: ActivatedRoute, private _router: Router) {
    this.errorMessage = null;
    this.successMessage = null;
    this.errorMessageModal = null;
    this.users = new Array<User>();
    this.user = new User();
    this.perfilSeleccionado = 'Selecciona un perfil';
    this.password1 = '';
    this.password2 = '';
    this.companies = new Array<string>();
  }

  ngOnInit() {
    console.log('iniciando componente de administracion de usuarios');
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    if (this.identity === null) {
      this._router.navigate(['/']);
    }
    if (this.identity.role === 'ROLE_ADMIN') {
      this.listarUsuarios();
    } else {
      this.seleccionarUsuario(this.identity);
    }
    this.listarEmpresas();
  }

  private listarEmpresas() {
    this.companies = new Array<string>();
    this._companyService.list(this.token).subscribe(
      response => {
        this.companies = response;
      }, error => { console.error(error); }
    );
  }

  seleccionarUsuario(usuario) {
    this.user = usuario;
    this.seleccionarPerfil(this.user.role);
  }

  seleccionarPerfil(perfil) {
    console.log('seleccionando el perfil ' + perfil);
    this.user.role = perfil;
    switch (perfil) {
      case 'ROLE_ADMIN':
        this.perfilSeleccionado = 'Administrador';
        break;
      case 'ROLE_COORD':
        this.perfilSeleccionado = 'Coordinador';
        break;
      case 'ROLE_USER':
        this.perfilSeleccionado = 'Asesor';
        break;
      default:
        break;
    }
  }

  listarUsuarios() {
    this.users = new Array<User>();
    this._userService.listUsers().subscribe(
      response => {
        this.users = response.users;
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

  validarUsuario() {
    if (this.user.name.length > 0 && this.user.surname.length > 0 &&
      this.user.username.length > 0 && this.user.password.length > 0 &&
      this.user.role.length > 0) {
      return true;
    }
    return false;
  }

  limpiarFormulario() {
    this.user = new User();
    this.perfilSeleccionado = 'Selecciona un perfil';
  }

  guardar() {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.user._id) {
      //modificar
      this._userService.updateUser(this.user).subscribe(
        response => {
          this.user = response.user;
          if (!this.user._id) {
            this.errorMessage = 'No se pudo actualizar el usuario';
          } else {
            this.successMessage = 'Se actualizó el usuario ' + this.user.username + " satisfactoriamente";
            this.user = new User();
            this.perfilSeleccionado = 'Selecciona un perfil';
            this.listarUsuarios();
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
    } else {
      //crear
      this._userService.register(this.user).subscribe(
        response => {
          this.user = response.user;
          if (!this.user._id) {
            this.errorMessage = 'No se pudo crear el usuario';
          } else {
            this.successMessage = 'Se creó el usuario ' + this.user.username + " satisfactoriamente";
            this.user = new User();
            this.perfilSeleccionado = 'Selecciona un perfil';
            this.listarUsuarios();
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
  }

  cambiarContrasena() {
    this.errorMessageModal = null;
    if (this.password1.length === 0 || this.password2.length === 0) {
      this.errorMessageModal = 'Debes completar ambos campos';
      return;
    }
    if (this.password1 != this.password2) {
      this.errorMessageModal = 'Las contraseñas no concuerdan';
      return;
    }
    this.user.password = this.password1;
    this._userService.changePassword(this.user).subscribe(
      response => {
        this.user = response.user;
        if (!this.user._id) {
          this.errorMessage = 'No se pudo crear el usuario';
        } else {
          this.successMessage = 'Se cambió la contraseña del usuario ' + this.user.username + " satisfactoriamente";
          this.user = new User();
          this.perfilSeleccionado = 'Selecciona un perfil';
          this.listarUsuarios();
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

  seleccionarUsuarioCambioEstado(usuario, activar) {
    this.user = usuario;
    //this.user.active = activar;
    this.activar = activar;
  }

  cambiarEstadoUsuario() {
    this.user.active = this.activar;
    this.guardar();
  }
}
