import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { RegionService } from '../../services/region.service';
import { Customer } from '../../models/customer';
import { State } from '../../models/state';
import { City } from '../../models/city';

@Component({
  selector: 'customer-admin',
  templateUrl: './customers.html',
  styleUrls: ['./customers.css'],
  providers: [CustomerService, RegionService]
})
export class CustomersComponent implements OnInit {
  public identity;
  public token;
  public errorMessage: string;
  public errorMessageModal: string;
  public successMessage: string;
  public tipoDocumentoSeleccionado: string = 'Seleciona el tipo de documento...';
  public departamentoSeleccionado: string;
  public states: Array<State>;
  public ciudadSeleccionada: string;
  public cities: Array<City>;
  public customers: Array<Customer>;
  public customer: Customer;
  public totalRecords: number = 0;
  public page: number = 1;
  public pageSize: number = 10;
  public pages: Array<String>;
  public filtroBusqueda: string = '';

  constructor(private _customerService: CustomerService, private _regionService: RegionService, private _route: ActivatedRoute, private _router: Router) {
    this.errorMessage = null;
    this.successMessage = null;
    this.errorMessageModal = null;
    this.customers = new Array<Customer>();
    this.cities = new Array<City>();
    this.states = new Array<State>();
    this.customer = new Customer();
    this.departamentoSeleccionado = '';
    this.ciudadSeleccionada = '';
  }

  ngOnInit() {
    console.log('iniciando componente de administracion de clientes');
    this.identity = this._customerService.getItentity();
    this.token = this._customerService.getToken();
    console.log(this.token);
    if (this.identity === null) {
      this._router.navigate(['/']);
    }
    this.cargarDepartamentos();
    this.listarClientes();
  }

  listarClientes() {
    this.customers = new Array<Customer>();
    this.limpiarFormulario();
    this._customerService.list(this.page, this.pageSize, this.filtroBusqueda).subscribe(
      response => {
        this.customers = response.customers;
        this.totalRecords = response.records;
        this.calcularPaginas();
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

  cargarDepartamentos() {
    this._regionService.listStates().subscribe(
      response => {
        this.states = response.states;
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

  private calcularPaginas() {
    this.pages = new Array<String>();
    let totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (totalPages > 5) {
      let pagesLeft = 4;
      //agrega hasta dos paginas a la izquierda de la pagina actual
      if (totalPages - this.page < 2) {
        //si esta en las ultimas dos paginas
        for (let i = totalPages - pagesLeft; i <= this.page - 1 && this.page - i > 0; i++) {
          this.pages.push(i.toString());
          pagesLeft--;
        }
      } else {
        for (let i = (this.page > 2 ? this.page - 2 : 1); i <= this.page - 1 && this.page - i > 0; i++) {
          this.pages.push(i.toString());
          pagesLeft--;
        }
      }
      //agrega la pagina actual
      this.pages.push(this.page.toString());
      //agrega las paginas restantes a la derecha de la pagina actual
      for (let i = this.page + 1; pagesLeft > 0 && i <= totalPages; i++) {
        this.pages.push(i.toString());
        pagesLeft--;
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        this.pages.push(i.toString());
      }
    }
  }

  seleccionarCliente(cliente: Customer) {
    this.customer = new Customer();
    this.customer.setParams(cliente._id, cliente.name, cliente.surname, cliente.companyName, cliente.documentType, cliente.documentNumber,
      cliente.stateCode, cliente.cityCode, cliente.address, cliente.landLineNumber, cliente.cellphoneNumber, cliente.email);
    this.departamentoSeleccionado = this.customer.stateCode;
    this.seleccionarDepartamento();
  }

  validarCliente() {
    if (this.customer.name.length > 0 && this.customer.surname.length > 0 &&
      this.customer.documentType.length > 0 && this.customer.documentNumber.length > 0 &&
      this.customer.stateCode.length > 0 && this.customer.cityCode.length > 0 &&
      this.customer.address.length > 0 && this.customer.cellphoneNumber.length > 0 &&
      this.customer.landLineNumber.length > 0) {
      return true;
    }
    return false;
  }

  limpiarFormulario() {
    this.departamentoSeleccionado = null;
    this.ciudadSeleccionada = null;
    this.cities = new Array<City>();
    this.customer = new Customer();
  }

  guardar() {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.customer._id) {
      //modificar
      this._customerService.updateCustomer(this.customer).subscribe(
        response => {
          this.customer = response.customer;
          if (!this.customer._id) {
            this.errorMessage = 'No se pudo actualizar el cliente';
          } else {
            this.successMessage = 'Se actualizó el cliente ' + this.customer.name + " satisfactoriamente";
            this.customer = new Customer();
            this.listarClientes();
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
      this._customerService.save(this.customer).subscribe(
        response => {
          this.customer = response.customer;
          if (!this.customer._id) {
            this.errorMessage = 'No se pudo crear el cliente';
          } else {
            this.successMessage = 'Se creó el cliente ' + this.customer.name + " satisfactoriamente";
            this.customer = new Customer();
            this.listarClientes();
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

  seleccionarDepartamento() {
    this.customer.stateCode = this.departamentoSeleccionado;
    this.cities = new Array<City>();
    this._regionService.listCities(this.departamentoSeleccionado).subscribe(
      response => {
        this.cities = response.cities;
        if (this.customer.cityCode) {
          this.ciudadSeleccionada = this.customer.cityCode;
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

  seleccionarCiudad() {
    this.customer.cityCode = this.ciudadSeleccionada;
  }

  mostrarPagina(pageToShow) {
    if (pageToShow <= 0) {
      this.page = 1;
    } else if (pageToShow > this.pages.length) {
      this.page = this.pages.length;
    } else {
      this.page = pageToShow;
    }
    this.listarClientes();
  }

  cambioTamanoPagina() {
    console.log('tamano pagina ' + this.pageSize);
    this.listarClientes();
  }
}
