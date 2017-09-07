export class User {
  public _id: string;
  public name: string;
  public surname: string;
  public username: string;
  public password: string;
  public role: string;
  public active: boolean;
  public company: string;

  constructor() {
    this._id = '';
    this.name = '';
    this.surname = '';
    this.username = '';
    this.password = '';
    this.role = '';
    this.company = '';
    this.active = true;
  }
}
