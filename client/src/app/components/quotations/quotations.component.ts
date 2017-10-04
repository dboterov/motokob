import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CustomerService } from '../../services/customer.service';
import { BrandService } from '../../services/brand.service';
import { ProductService } from '../../services/product.service';
import { CostService } from '../../services/cost.service';
import { RestrictionsService } from '../../services/restrictions.service';
import { FactorService } from '../../services/factor.service';
import { Customer } from '../../models/customer';
import { Product } from '../../models/product';
import { Brand } from '../../models/brand';
import { Cost } from '../../models/cost';
import { Factor } from '../../models/factor';
import { Quotation, QuotationDetail } from '../../models/quotation';
import { GLOBAL } from '../../services/global';

declare var $: any;

@Component({
  selector: 'motokob-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css'],
  providers: [UserService, CustomerService, BrandService, ProductService, CostService, RestrictionsService, FactorService]
})
export class QuotationsComponent implements OnInit {
  public identity;
  public token;
  public errorMessageInstallments: string = '';
  public customerDocumentNumber: string = '';
  public customerName: string = '';
  public items: Array<any>;
  public selectedBrand: Brand;
  public selectedBike: Product;
  public selectedColor: string = '';
  public selectedCostName: string = '';
  public selectedCostOption: string = '';
  public selectedQuotationType: string = '';
  public selectedInstallments: number;
  public initialPayment: number;
  public discount: number;
  public maxInstallments: number;
  public brands: Array<Brand>;
  public bikes: Array<any>;
  public panelShown: string = 'brands';
  public quotation: Quotation;
  public costOptions: Array<string>;
  public filteredOptions: Array<Cost>;
  public additionalCosts: Array<any>;
  private factors: Array<Factor>;
  private company: any;

  private customer: Customer;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService,
    private _customerService: CustomerService,
    private _costService: CostService,
    private _restrictionsService: RestrictionsService,
    private _factorsService: FactorService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router) {
    this.brands = new Array<Brand>();
    this.quotation = new Quotation();
    this.costOptions = new Array<string>();
    this.filteredOptions = new Array<Cost>();
    this.additionalCosts = new Array<any>();
    this.factors = new Array<Factor>();
  }

  ngOnInit() {
    this.identity = this._userService.getItentity();
    console.log(this.identity);
    this.token = this._userService.getToken();
    if (this.identity === null || this.token === null) {
      this._router.navigate(['/']);
    } else {
      this.loadBrands();
      this.loadSelectedCompany();
      this.loadFactors();
    }
  }

  private loadFactors() {
    this.factors = new Array<Factor>();
    this._factorsService.listFactors().subscribe(
      result => {
        for (let i = 0; i < result.length; i++) {
          let factor: Factor = new Factor();
          factor._id = result[i]._id;
          factor.factor = result[i].factor;
          factor.period = result[i].period;
          this.factors.push(factor);
        }
      }, error => { console.error(error); }
    );
  }

  private loadSelectedCompany() {
    this.company = JSON.parse(localStorage.getItem('motokob.selectedCompany'));
    console.log(this.company);
  }

  private loadBrands() {
    this._brandService.listBrands().subscribe(
      response => {
        this.brands = response;
      }, error => { const errorResponse = <any>error; }
    );
  }

  public searchCustomer() {
    if (this.customerDocumentNumber && this.customerDocumentNumber.length > 0) {
      this._customerService.find(this.customerDocumentNumber).subscribe(
        response => {
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
    if (this.customer && this.customer.name.length > 0) {
      this.customerName = this.customer.name + ' ' + this.customer.surname;
    } else {
      this.customerName = '';
    }
  }

  public navigateToCustomer() {
    this._router.navigate(['/clientes']);
  }

  /*public startAdding() {
    this.adding = true;
    if (!this.brands || this.brands.length === 0) {
      this.loadBrands();
    }
  }*/

  public selectBrand(brand) {
    this.selectedBrand = brand;
    this._productService.list(1, 10000, brand._id).subscribe(
      response => {
        this.bikes = response.products;
        this.panelShown = 'bikes';
      }, error => { console.error(error); }
    );
  }

  public selectBike(bike) {
    this.selectedBike = bike;
    this.panelShown = 'modelAndColor';
    this._restrictionsService.getRestrictions(this.company.company_id, this.selectedBike._id, this.token).subscribe(
      response => {
        this.maxInstallments = response.max_installments;
      }, error => { console.error(error); }
    );
    this._costService.listCostNames(this.token).subscribe(
      response => {
        this.costOptions = response;
      }, error => { console.error(error); }
    );
  }

  public selectQuotationType(quotationType) {
    this.selectedQuotationType = quotationType;
    if (quotationType === 'contado') {
      this.panelShown = 'summary';
      this.selectedInstallments = 0;
      this.initialPayment = 0;
    } else {
      this.panelShown = 'credit-params';
    }
  }

  public selectCostName() {
    this._costService.listCostOptions(this.token, this.selectedCostName).subscribe(
      response => {
        this.filteredOptions = response;
      }, error => { console.error(error); }
    );
  }

  public addSelectedCost() {
    for (let i = 0; i < this.costOptions.length; i++) {
      if (this.selectedCostOption === this.filteredOptions[i]._id) {
        this.additionalCosts.push({ costName: this.selectedCostName, costOption: this.filteredOptions[i] });
        this.selectedCostName = '';
        this.selectedCostOption = '';
        this.filteredOptions = new Array<Cost>();
        break;
      }
    }
  }

  public removeCost(cost) {
    for (let i = 0; i < this.additionalCosts.length; i++) {
      if (this.additionalCosts[i].costName === cost.costName) {
        this.additionalCosts.splice(i, 1);
        break;
      }
    }
  }

  public getImage(imageName) {
    return GLOBAL.url + 'product/get-image/' + imageName;
  }

  public getLineTotal() {
    let total = 0;
    for (let i = 0; i < this.additionalCosts.length; i++) {
      total += this.additionalCosts[i].costOption.value;
    }
    total += this.selectedBike ? this.selectedBike.price : 0;
    total -= this.initialPayment ? this.initialPayment : 0;
    total -= this.discount ? this.discount : 0;
    return total;
  }

  public getSelectedColorName() {
    for (let i = 0; i < this.selectedBike.colors.length; i++) {
      if (this.selectedBike.colors[i]._id === this.selectedColor) {
        return this.selectedBike.colors[i].name;
      }
    }
    return "Sin selección de color";
  }

  public getSelectedColor() {
    for (let i = 0; i < this.selectedBike.colors.length; i++) {
      if (this.selectedBike.colors[i]._id === this.selectedColor) {
        return this.selectedBike.colors[i];
      }
    }
    return null;
  }

  public validateInstallments() {
    this.errorMessageInstallments = '';
    if (this.selectedInstallments <= this.maxInstallments) {
      this.panelShown = 'summary';
    } else {
      this.errorMessageInstallments = 'El número máximo de cuotas permitidas para la financiación de esta moto es ' + this.maxInstallments;
    }
  }

  public calculatePaymentsValue() {
    if (this.selectedInstallments > 0) {
      let grossPrice = this.getLineTotal() * this.factors[this.selectedInstallments - 1].factor;
      let roundedGrossPrice = Math.ceil(grossPrice / 1000) * 1000;
      //Al valor total redondeado a la cifra superior de 1000, se le suman 2000 pesos correspondientes a seguro de deuda
      return roundedGrossPrice + 2000;
    }
    return 0;
  }

  public addQuotationLine() {
    console.log('adding line to quotation');
    this.quotation.addLine(
      this.selectedBike,
      this.selectedBrand,
      this.selectedInstallments ? this.selectedInstallments : 0,
      this.initialPayment ? this.initialPayment : 0,
      this.discount ? this.discount : 0,
      this.additionalCosts,
      this.calculatePaymentsValue(),
      this.getLineTotal(),
      this.getSelectedColor()
    );
    this.clearSelections();
    console.log(this.quotation);
  }

  public clearSelections() {
    this.panelShown = 'brands';
    this.selectedBrand = new Brand();
    this.selectedBike = new Product();
    this.selectedInstallments = null;
    this.initialPayment = null;
    this.discount = null;
    this.selectedQuotationType = '';
    this.selectedColor = '';
    this.additionalCosts = new Array<Cost>();
    $('#modalNewItem').modal('hide');
  }
}
