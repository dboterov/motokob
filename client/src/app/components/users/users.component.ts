import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { UploadService } from '../../services/upload.service';
import { User, Permission } from '../../models/user';
import { Company } from '../../models/company';
import { GLOBAL } from '../../services/global';

declare var $: any;

@Component({
  selector: 'user-admin',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  providers: [UserService, CompanyService, UploadService]
})
export class UsersComponent implements OnInit {
  public identity;
  public token;
  public selectedCompany: string = '';
  public selectedProfile: string = '';
  public errorMessage: string;
  public errorMessageModal: string;
  public successMessage: string;
  public users: Array<User>;
  public user: User;
  public activar: boolean;
  public password1: string;
  public password2: string;
  public companyName: string = '';
  public companyStores: string = '';
  public companyNit: string = '';
  public companyActive: boolean = true;
  public companyLogo: string = '';
  public availableCompanies: Array<Company>;

  constructor(private _userService: UserService, private _uploadService: UploadService, private _companyService: CompanyService, private _route: ActivatedRoute, private _router: Router) {
    this.errorMessage = null;
    this.successMessage = null;
    this.errorMessageModal = null;
    this.users = new Array<User>();
    this.user = new User();
    this.password1 = '';
    this.password2 = '';
    this.availableCompanies = new Array<Company>();
  }

  ngOnInit() {
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    if (this.identity === null) {
      this._router.navigate(['/']);
    }
    if (this.isAdmin()) {
      this.listarUsuarios();
    } else {
      this.seleccionarUsuario(this.identity);
    }
    this.listarEmpresas();
  }

  public selectedCompanyListener() {
    console.log(this.selectedCompany);
  }

  public selectedProfileListener() {
    console.log(this.selectedProfile);
  }

  private listarEmpresas() {
    this.availableCompanies = new Array<Company>();
    this._companyService.list(this.token).subscribe(
      response => {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
          let company = new Company();
          company._id = response[i]._id;
          company.nit = response[i].nit;
          company.name = response[i].name;
          company.active = response[i].active;
          company.stores = response[i].stores;
          this.availableCompanies.push(company);
        }
      }, error => { console.error(error); }
    );
  }

  seleccionarUsuario(usuario) {
    this.user = usuario;
  }

  listarUsuarios() {
    this.users = new Array<User>();
    this._userService.listUsers().subscribe(
      response => {
        for (let i = 0; i < response.users.length; i++) {
          let usr = new User();
          usr._id = response.users[i]._id;
          usr.active = response.users[i].active;
          usr.name = response.users[i].name;
          usr.password = response.users[i].password;
          usr.permissions = response.users[i].permissions;
          usr.surname = response.users[i].surname;
          usr.username = response.users[i].username;
        }
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

  public validarUsuario(validatePassword: boolean = true) {
    if (this.user.name.length > 0 && this.user.surname.length > 0 &&
      this.user.username.length > 0) {
      if ((validatePassword && this.user.password && this.user.password.length > 0) || !validatePassword) {
        return true;
      }
    }
    return false;
  }

  limpiarFormulario() {
    this.user = new User();
    this.selectedProfile = '';
    this.selectedCompany = '';
  }

  public guardar() {
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
            //this.perfilSeleccionado = 'Selecciona un perfil';
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

  public addCompanyToUser() {
    console.log('agregando empresa ' + this.selectedCompany + ' y perfil ' + this.selectedProfile);
    if (!this.selectedCompany || this.selectedCompany.length === 0) {
      return;
    }
    if (!this.selectedProfile || this.selectedProfile.length === 0) {
      return;
    }

    let perm = new Permission();
    perm.companyId = this.selectedCompany;
    perm.companyName = this.getCompanyName();
    perm.role = this.selectedProfile;
    this.user.permissions.push(perm);

    this.selectedCompany = '';
    this.selectedProfile = '';
  }

  private getCompanyName() {
    for (let i = 0; i < this.availableCompanies.length; i++) {
      if (this.availableCompanies[i]._id === this.selectedCompany) {
        return this.availableCompanies[i].name;
      }
    }
    return "";
  }

  public cambiarContrasena() {
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
          //this.perfilSeleccionado = 'Selecciona un perfil';
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
    this.activar = activar;
  }

  cambiarEstadoUsuario() {
    this.user.active = this.activar;
    this.guardar();
  }

  public guardarEmpresa() {
    let newCompany = new Company();
    newCompany._id = this.selectedCompany;
    newCompany.name = this.companyName;
    newCompany.nit = this.companyNit;
    newCompany.stores = this.companyStores;
    newCompany.logo = this.companyLogo;

    if (newCompany._id) {
      newCompany.active = this.companyActive;
    } else {
      newCompany.active = true;
    }

    this._companyService.save(newCompany, this.token).subscribe(
      result => {
        this.selectedCompany = result._id;
        this.listarEmpresas();
        this.companyName = '';
        this.companyNit = '';
        $("#modalCompany").modal('hide');
      }, error => { console.error(error); }
    );
  }

  public isAdmin() {
    return this._userService.isAdmin();
  }

  public selectCompany() {
    if (!this.selectedCompany) {
      this.companyName = '';
      this.companyNit = '';
      this.companyStores = '';
      this.companyActive = true;
      this.companyLogo = '';
      return;
    }
    for (let i = 0; i < this.availableCompanies.length; i++) {
      if (this.availableCompanies[i]._id === this.selectedCompany) {
        this.companyName = this.availableCompanies[i].name;
        this.companyNit = this.availableCompanies[i].nit;
        this.companyStores = this.availableCompanies[i].stores;
        this.companyActive = this.availableCompanies[i].active;
        this.companyLogo = this.availableCompanies[i].logo;
        $('#modalCompany').modal('show');
        break;
      }
    }
  }

  public imageSelected(fileInput: any) {
    let images = <Array<File>>(fileInput.target.files);
    this.uploadCompanyLogo(images);
  }

  private uploadCompanyLogo(image) {
    if (image) {
      this._uploadService.makeFileRequest(GLOBAL.url + 'company/upload', 'PUT', [], image, 'image', null).then(
        (result: string) => {
          let respObject = JSON.parse(result);
          console.log('logo cargado al servidor ', respObject);
          for (let i = 0; i < respObject.images.length; i++) {
            let image_path = GLOBAL.url + 'company/get-image/' + respObject.images[i];
            this.companyLogo = image_path;
          }
        }, (error) => {
          console.error(error);
          this.errorMessage = 'Error al guardar la imagen ' + JSON.parse(error._body).message;
        }
      );
    } else {
      console.error('no hay archivos para subir');
    }
  }
}
