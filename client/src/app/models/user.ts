export class User {
  public _id: string;
  public name: string;
  public surname: string;
  public username: string;
  public password: string;
  public active: boolean;
  public permissions: Array<Permission>;

  constructor() {
    this._id = '';
    this.name = '';
    this.surname = '';
    this.username = '';
    this.password = '';
    this.permissions = new Array<Permission>();
    this.active = true;
  }
}

export class Permission {
  public companyId: string;
  public companyName: string;
  public role: string;

  constructor() { }
}