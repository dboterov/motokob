import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CostService } from '../../services/cost.service';
import { RegionService } from '../../services/region.service';
import { Cost } from '../../models/cost';
import { State } from '../../models/state';

declare var $: any;

@Component({
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
  providers: [UserService, CostService, RegionService]
})
export class ConfigurationComponent implements OnInit {
  public identity;
  public token;
  public cost: Cost;
  public costs: Array<Cost>;
  public states: Array<State>;
  public selectedState: string = '';
  public errorMessage: string = '';
  public successMessage: string = '';

  constructor(
    private _userService: UserService,
    private _costService: CostService,
    private _regionService: RegionService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.cost = new Cost();
    this.costs = new Array<Cost>();
    this.states = new Array<State>();
  }

  ngOnInit() {
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    if (this.identity === null || this.token === null) {
      this._router.navigate(['/']);
    } else {
      this.listCosts();
      this.listStates();

      $('#modal_cost').on('hidden.bs.modal', () => {
        this.cost = new Cost();
        this.selectedState = '';
        console.log(this.cost);
      });
    }
  }

  private listStates() {
    this._regionService.listStates().subscribe(
      response => {
        this.states = response.states
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
}
