import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CustomerService } from '../../services/customer.service';
import { BrandService } from '../../services/brand.service';
import { ProductService } from '../../services/product.service';
import { CostService } from '../../services/cost.service';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { Brand } from '../../models/brand';
import { Cost } from '../../models/cost';
import { Quotation, QuotationDetail } from '../../models/quotation';
import { GLOBAL } from '../../services/global';

declare var $: any;

@Component({
  selector: 'motokob-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css'],
  providers: [UserService, CustomerService, BrandService, ProductService, CostService]
})
export class QuotationsComponent implements OnInit {
  public identity;
  public token;
  public customerDocumentNumber: string = '';
  public customerName: string = '';
  public items: Array<any>;
  public adding: boolean = false;
  public selectedBrand: string = '';
  public selectedBike: string = '';
  public selectedColor: string = '';
  public selectedCostName: string = '';
  public selectedCostOption: string = '';
  public selectedQuotationType: string = '';
  public initialPayment: number;
  public quantity: number = 0;
  public brands: Array<Brand>;
  public bikes: Array<any>;
  public errorMessageAdding: string = '';
  public successMessageAdding: string = '';
  public panelShown: string = 'brands';
  public quotation: Quotation;
  public costOptions: Array<string>;
  public filteredOptions: Array<Cost>;
  public additionalCosts: Array<any>;

  private customer: Customer;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService,
    private _customerService: CustomerService,
    private _costService: CostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.brands = new Array<Brand>();
    this.quotation = new Quotation();
    this.costOptions = new Array<string>();
    this.filteredOptions = new Array<Cost>();
    this.additionalCosts = new Array<any>();
  }

  ngOnInit() {
    console.log('iniciando componente de cotizaciones');
    this.identity = this._userService.getItentity();
    console.log(this.identity);
    this.token = this._userService.getToken();
    if (this.identity === null || this.token === null) {
      this._router.navigate(['/']);
    }
    this.loadBrands();
  }

  private loadBrands() {
    this._brandService.listBrands().subscribe(
      response => {
        this.brands = response.brands;
      }, error => { const errorResponse = <any>error; }
    );
  }

  public searchCustomer() {
    console.log('buscando cliente ' + this.customerDocumentNumber);
    if (this.customerDocumentNumber && this.customerDocumentNumber.length > 0) {
      this._customerService.find(this.customerDocumentNumber).subscribe(
        response => {
          console.log(response);
          this.customer = response.customer;
          this.getCustomerName();
        }, error => {
          if (error.status == 404) {
            $('#modalNavigate').modal('show');
          }
          console.error(error);
        }
      );
    }
  }

  private getCustomerName() {
    console.log('construyendo nombre del cliente');
    if (this.customer && this.customer.name.length > 0) {
      this.customerName = this.customer.name + ' ' + this.customer.surname;
    } else {
      this.customerName = '';
    }
  }

  public navigateToCustomer() {
    this._router.navigate(['/clientes']);
  }

  public startAdding() {
    this.adding = true;
    if (!this.brands || this.brands.length === 0) {
      this.loadBrands();
    }
  }

  public selectBrand(brand) {
    console.log('selecciono la marca ', brand._id);
    this.selectedBrand = brand;
    this._productService.list(1, 10000, brand._id).subscribe(
      response => {
        console.log(response);
        this.bikes = response.products;
        this.panelShown = 'bikes';
      }, error => { console.error(error); }
    );
  }

  public selectBike(bike) {
    console.log('selecciono la moto ', bike);
    this.selectedBike = bike;
    this.panelShown = 'modelAndColor';
    this._costService.listCostNames(this.token).subscribe(
      response => {
        this.costOptions = response;
      }, error => { console.error(error); }
    );
  }

  public selectQuotationType(quotationType) {
    this.selectedQuotationType = quotationType;
    this.panelShown = 'credit-params';
  }

  public selectCostName() {
    console.log(this.selectedCostName);
    this._costService.listCostOptions(this.token, this.selectedCostName).subscribe(
      response => {
        this.filteredOptions = response;
      }, error => { console.error(error); }
    );
  }

  public addSelectedCost() {
    console.log(this.selectedCostName);
    console.log(this.selectedCostOption);
    for(let i = 0; i < this.costOptions.length; i++){
      if(this.selectedCostOption === this.filteredOptions[i]._id){
        this.additionalCosts.push({costName: this.selectedCostName, costOption: this.filteredOptions[i]});
        this.selectedCostName = '';
        this.selectedCostOption = '';
        this.filteredOptions = new Array<Cost>();
        break;
      }
    }
  }

  public addBike() {
    this.errorMessageAdding = '';
    this.successMessageAdding = '';
    if (!this.selectedBrand) {
      this.errorMessageAdding = 'Debes seleccionar una marca de moto';
      return;
    }
    console.log('selectedBrand: ' + this.selectedBrand);

    if (!this.selectedBike) {
      this.errorMessageAdding = 'Debes seleccionar una moto';
      return;
    }
    console.log('selectedBike: ' + this.selectedBike);

    if (this.quantity === 0) {
      this.errorMessageAdding = 'Debes ingresar la cantidad';
      return;
    }

    let exists = false;
    for (let i = 0; i < this.quotation.items.length; i++) {
      if (this.quotation.items[i].itemId === this.selectedBike) {
        exists = true;
        this.quotation.items[i].quantity = this.quantity;
        this.clearAddingForm();
        this.successMessageAdding = 'Artículo modificado con éxito';
        return;
      }
    }

    console.log(this.bikes);
    if (!exists) {
      for (let i = 0; i < this.bikes.length; i++) {
        if (this.bikes[i]._id === this.selectedBike) {
          console.log(this.bikes[i]);
          this.quotation.addLine(this.selectedBike, this.bikes[i].name, this.bikes[i].images[0], this.quantity, this.bikes[i].price, this.bikes[i].brandId._id);
          this.successMessageAdding = 'Artículo adicionado con éxito';
          this.clearAddingForm();
          break;
        }
      }
    }

    console.log(this.quotation);
  }

  private clearAddingForm() {
    this.selectedBike = '';
    this.selectedBrand = '';
    this.quantity = 0;
    this.bikes = new Array<any>();
  }

  public getImage(imageName) {
    return GLOBAL.url + 'product/get-image/' + imageName;
  }
}
