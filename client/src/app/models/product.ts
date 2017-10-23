import { Color } from './color';
import { Brand } from './brand';
import { ProductType } from './productType';

export class Product {
  public _id: string = '';
  public name: string = '';
  public brand: Brand;
  public model: number;
  public cylinder: string = '';
  public price: number;
  public productType: ProductType;
  public colors: Array<Color> = new Array<Color>();
  public images: Array<string> = new Array<string>();

  constructor() {
    this.initialize();
  }

  public initialize() {
    this._id = '';
    this.name = '';
    this.brand = new Brand();
    this.model = null;
    this.cylinder = '';
    this.price = null;
    this.productType = new ProductType();
    this.colors = new Array<Color>();
    this.images = new Array<string>();

    return this;
  }
}
