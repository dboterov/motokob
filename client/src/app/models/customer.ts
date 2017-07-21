export class Customer {
    constructor(
      public _id: string,
      public name: string,
      public surname: string,
      public documentType: string,
      public documentNumber: string,
      public stateCode: string,
      public cityCode: string,
      public address: string,
      public landLineNumber: string,
      public cellphoneNumber: string,
      public email: string
    ) {}
}
