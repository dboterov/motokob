import { Cost } from './cost';
import { Product } from './product';
import { Brand } from './brand';
import { Customer } from './customer';
import { User } from './user';
import { Color } from './color';

export class Quotation {
  public _id: string;
  public customer: Customer;
  public quotationNumber: number;
  public date: Date;
  public total: number;
  public status: string;
  public seller: User;
  public items: Array<QuotationDetail>;

  constructor() {
    this.items = new Array<QuotationDetail>();
  }

  public addLine(item: Product, brand: Brand, installments: number, initialPayment: number, discount: number, additionalCosts: Array<Cost>, paymentValue: number, lineTotal: number, color: Color) {
    this.items.unshift(new QuotationDetail(item, brand, installments, initialPayment, discount, additionalCosts, paymentValue, lineTotal, color));
  }
}

export class QuotationDetail {
  public _id: string;
  public item: Product;
  public brand: Brand;
  public installments: number;
  public initialPayment: number;
  public discount: number;
  public additionalCosts: Array<Cost>;
  public paymentValue: number;
  public lineTotal: number;
  public color: Color;

  constructor(item: Product, brand: Brand, installments: number, initialPayment: number, discount: number, additionalCosts: Array<Cost>, paymentValue: number, lineTotal: number, color: Color) {
    this.item = item;
    this.brand = brand;
    this.installments = installments;
    this.initialPayment = initialPayment;
    this.discount = discount;
    this.additionalCosts = additionalCosts;
    this.paymentValue = paymentValue;
    this.lineTotal = lineTotal;
    this.color = color;
    console.log(this);
  }
}
