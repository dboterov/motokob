export class Customer {
  public _id: string;
  public name: string;
  public surname: string;
  public companyName: string;
  public documentType: string;
  public documentNumber: string;
  public stateCode: string;
  public cityCode: string;
  public address: string;
  public landLineNumber: string;
  public cellphoneNumber: string;
  public email: string;
  public image: string;

  constructor() {
    this._id = '';
    this.name = '';
    this.surname = '';
    this.companyName = '';
    this.documentType = '';
    this.documentNumber = '';
    this.stateCode = '';
    this.cityCode = '';
    this.address = '';
    this.landLineNumber = '';
    this.cellphoneNumber = '';
    this.email = '';
    this.image = '';
  }

  setParams(_id, name, surname, companyName, documentType, documentNumber, stateCode, cityCode, address, landLineNumber, cellphoneNumber, email, image) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.companyName = companyName;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.stateCode = stateCode;
    this.cityCode = cityCode;
    this.address = address;
    this.landLineNumber = landLineNumber;
    this.cellphoneNumber = cellphoneNumber;
    this.email = email;
    this.image = image;
  }
}
