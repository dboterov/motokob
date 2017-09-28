import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CostService } from '../../services/cost.service';
import { RegionService } from '../../services/region.service';
import { ProductService } from '../../services/product.service';
import { RestrictionsService } from '../../services/restrictions.service';
import { Cost } from '../../models/cost';
import { State } from '../../models/state';
import { Product } from '../../models/product';
import { Restriction } from '../../models/restriction';

declare var $: any;

@Component({
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
  providers: [UserService, CostService, RegionService, ProductService, RestrictionsService]
})
export class ConfigurationComponent implements OnInit {
  public identity;
  public token;
  public cost: Cost;
  public costs: Array<Cost>;
  public restrictions: Array<Restriction>;
  public states: Array<State>;
  public bikes: Array<Product>;
  public maxInstallments: number;
  public selectedState: string = '';
  public selectedBike: string = '';
  public errorMessage: string = '';
  public successMessage: string = '';
  private workingCompany: any;

  constructor(
    private _userService: UserService,
    private _costService: CostService,
    private _regionService: RegionService,
    private _productService: ProductService,
    private _restrictionsService: RestrictionsService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.cost = new Cost();
    this.costs = new Array<Cost>();
    this.states = new Array<State>();
    this.bikes = new Array<Product>();
    this.restrictions = new Array<Restriction>();
    console.log(localStorage.getItem('motokob.selectedCompany'));
    this.workingCompany = JSON.parse(localStorage.getItem('motokob.selectedCompany'));
  }

  ngOnInit() {
    this.identity = this._userService.getItentity();
    console.log(this.identity);
    this.token = this._userService.getToken();
    if (this.identity === null || this.token === null) {
      this._router.navigate(['/']);
    } else {
      this.listCosts();
      this.listRestrictions();
      this.listStates();
      this.listBikes();

      $('#modal_cost').on('hidden.bs.modal', () => {
        this.cost = new Cost();
        this.selectedState = '';
        console.log(this.cost);
      });
    }
  }

  private listBikes() {
    console.log('cargando lista de productos');
    this._productService.list(1, 10000, null).subscribe(
      response => {
        console.log(response);
        this.bikes = response.products;
        console.log('bikes: ', this.bikes);
      }, error => { console.error(error); }
    );
  }

  private listStates() {
    this._regionService.listStates().subscribe(
      response => {
        this.states = response.states
      }, error => { console.error(error); }
    );
  }

  public saveMaxInstallments() {
    let restriction = {
      product_id: this.selectedBike,
      max_installments: this.maxInstallments,
      company_id: this.workingCompany.company_id
    };
    this._restrictionsService.save(restriction, this.token).subscribe(
      response => {
        this.maxInstallments = null;
        this.selectedBike = null;
        console.log('se creo con exito el nuevo limite de cuotas por producto', response);
        $('#modal_installments').modal('hide');
        this.listRestrictions();
      }, error => { console.error(error); }
    );
  }

  public saveCost() {
    this.errorMessage = '';
    if (this.cost.state == null || this.cost.state.code == null || this.cost.state.code.trim().length === 0) {
      this.errorMessage = 'Debes seleccionar el departamento para el cual aplica el costo';
      return;
    }
    if (this.cost.name == null || this.cost.name.trim().length === 0) {
      this.errorMessage = 'Debes ingresar un nombre para identificar el costo';
      return;
    }
    if (this.cost.value == null || this.cost.value <= 0) {
      this.errorMessage = 'Debes ingresar valor para el costo';
      return;
    }
    this._costService.save(this.cost, this.token).subscribe(
      response => {
        console.log('se creo con exito el nuevo costo', response);
        $('#modal_cost').modal('hide');
        this.listCosts();
      }, error => { console.error(error); }
    );
  }

  private listCosts() {
    this._costService.list(this.token).subscribe(
      response => {
        this.costs = response;
      }, error => {
        if (error.status === 401) {
          this._userService.removeLocalStorageData();
          this._router.navigate(['/']);
        }
        console.error(error);
      }
    );
  }

  private listRestrictions() {
    this._restrictionsService.listRestrictions(this.workingCompany.company_id, this.token).subscribe(
      result => {
        this.restrictions = result;
      }, error => { console.error(error); }
    );
  }

  public seleccionarCosto(cost) {
    this.cost = cost;
    $('#modal_cost').modal('show');
  }

  public seleccionarDepartamento() {
    this.cost.state.code = '';
    this.cost.state.name = '';
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i].code === this.selectedState) {
        this.cost.state.code = this.states[i].code;
        this.cost.state.name = this.states[i].name;
        break;
      }
    }
  }

  public seleccionarRestriccion(restriction) {
    console.log('restriction selected: ', restriction);
  }

  public seleccionarProducto() {
    console.log('selecciono la moto ' + this.selectedBike);
  }
}
