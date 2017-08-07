export class Product {
    constructor(
      public _id: string,
      public name: string,
      public brand: {
        _id: string,
        name: string
      },
      public model: number,
      public cylinder: string,
      public price: number,
      public productType: {
        _id: string,
        name: string
      },
      public color: string,
      public images: Array<string>
    ) {}
}
