export class Product {
  public _id: string;
  public name: string;
  public brand: {
    _id: string,
    name: string,
    logo: string
  };
  public model: number;
  public cylinder: string;
  public price: number;
  public productType: {
    _id: string,
    name: string
  };
  public colors: Array<any>;
  public images: Array<string>;

  constructor() { }

  public newProduct() {
    this._id = '';
    this.name = '';
    this.brand = { _id: null, name: null, logo: null };
    this.model = null;
    this.cylinder = '';
    this.price = null;
    this.productType = { _id: null, name: null };
    this.colors = new Array<any>();
    this.images = new Array<string>();

    return this;
  }
}
