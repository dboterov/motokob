export class ProductType {
  public _id: string;
  public name: string;
  constructor() { }

  public newProductType() {
    this._id = '';
    this.name = '';

    return this;
  }
}
