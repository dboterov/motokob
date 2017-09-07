export class Quotation {
  public _id: string;
  public customer: {
    documentNumber: string,
    completeName: string
  };
  public quotationNumber: number;
  public date: Date;
  public total: number;
  public status: string;
  public seller: {
    _id: string,
    name: string
  };
  public items: Array<QuotationDetail>;

  constructor() {
    this.items = new Array<QuotationDetail>();
  }

  public addLine(itemId: string, itemName: string, itemImage: string, quantity: number, unitPrice: number, brandId: string) {
    this.items.unshift(new QuotationDetail(itemId, itemName, itemImage, quantity, unitPrice, brandId))
    //this.items.push(new QuotationDetail(itemId, quantity, unitPrice));
  }
}

export class QuotationDetail {
  public _id: string;
  public itemId: string;
  public itemName: string;
  public itemImage: string;
  public brandId: string;
  public quantity: number;
  public unitPrice: number;

  constructor(itemId: string, itemName: string, itemImage: string, quantity: number, unitPrice: number, brandId: string) {
    this.itemId = itemId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.itemName = itemName;
    this.itemImage = itemImage;
    this.brandId = brandId;
  }
}
