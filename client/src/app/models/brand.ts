export class Brand {
  public _id: string = '';
  public name: string = '';
  public logo: string = '';
  constructor() { }

  public initialize() {
    this._id = '';
    this.name = '';
    this.logo = '';

    return this;
  }
}
