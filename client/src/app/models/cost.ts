export class Cost {
  public _id: string;
  public name: string;
  public value: number;
  public companyName: string;
  public state: {
    code: string,
    name: string
  };

  constructor() {
    this._id = '';
    this.name = '';
    this.companyName = '';
    this.state = {
      code: '',
      name: null
    };
  }
}
