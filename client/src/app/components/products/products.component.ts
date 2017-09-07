import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { ProductTypeService } from '../../services/productType.service';
import { UploadService } from '../../services/upload.service';

import { Product } from '../../models/product';
import { Brand } from '../../models/brand';
import { ProductType } from '../../models/productType';

@Component({
  selector: 'product',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  providers: [ProductService, BrandService, ProductTypeService, UploadService]
})

export class ProductsComponent implements OnInit {
  public totalRecords: number = 0;
  public page: number = 1;
  public pageSize: number = 10;
  public errorMessage: string;
  public successMessage: string;
  public marcaSeleccionada: string;
  public productTypeSeleccionado: string;
  public url: string;
  public image: string;
  public filtroBusqueda: string = '';
  public agregarColor = false;
  public valid = true;
  public product: Product;
  public brand: Brand;
  public productType: ProductType;
  public pages: Array<String>;
  public images: Array<File>;
  public products: Array<Product>;
  public brands: Array<Brand>;
  public productTypes: Array<ProductType>;

  constructor(private _productService: ProductService, private _brandService: BrandService, private _productTypeService: ProductTypeService, private _uploadService: UploadService, private _route: ActivatedRoute, private _router: Router) {
    this.errorMessage = null;
    this.successMessage = null;
    this.marcaSeleccionada = '';
    this.productTypeSeleccionado = '';
    this.url = GLOBAL.url;
    this.image = '';
    this.images = new Array<File>();
    this.product = new Product('', '', { _id: null, name: null }, null, '', null, { _id: null, name: null }, '#000000', new Array<string>());
    this.brand = new Brand('', '');
    this.productType = new ProductType('', '');
    this.products = new Array<Product>();
    this.brands = new Array<Brand>();
    this.productTypes = new Array<ProductType>();
  }

  ngOnInit() {
    console.log('iniciando componente de productos');
    this.cargarMarcas();
    this.cargarTiposProducto();
    this.listarProductos();
  }

  private cargarMarcas() {
    this.errorMessage = null;
    this.successMessage = null;
    this._brandService.listBrands().subscribe(
      response => {
        this.brands = response.brands;
      },
      error => {
        const errorResponse = <any>error;
        if (errorResponse != null) {
          this.errorMessage = JSON.parse(errorResponse._body).message;
          console.error(this.errorMessage);
        }
      }
    );
  }

  private cargarTiposProducto() {
    this.errorMessage = null;
    this.successMessage = null;
    this._productTypeService.list().subscribe(
      response => {
        this.productTypes = response.productTypes;
      },
      error => {
        const errorResponse = <any>error;
        if (errorResponse != null) {
          this.errorMessage = JSON.parse(errorResponse._body).message;
          console.error(this.errorMessage);
        }
      }
    );
  }

  public listarProductos() {
    this.errorMessage = null;
    this.successMessage = null;
    this.products = new Array<Product>();
    this._productService.list(this.page, this.pageSize, this.filtroBusqueda).subscribe(
      response => {
        this.products = response.products;
        console.log(this.products);
        this.totalRecords = response.records;
        this.calcularPaginas();
      },
      error => {
        const errorResponse = <any>error;
        if (errorResponse != null) {
          this.errorMessage = JSON.parse(errorResponse._body).message;
          console.error(this.errorMessage);
        }
      }
    );
  }

  private calcularPaginas() {
    this.pages = new Array<String>();
    let totalPages = Math.ceil(this.totalRecords / this.pageSize);
    if (totalPages > 5) {
      let pagesLeft = 4;
      //agrega hasta dos paginas a la izquierda de la pagina actual
      if (totalPages - this.page < 2) {
        //si esta en las ultimas dos paginas
        for (let i = totalPages - pagesLeft; i <= this.page - 1 && this.page - i > 0; i++) {
          this.pages.push(i.toString());
          pagesLeft--;
        }
      } else {
        for (let i = (this.page > 2 ? this.page - 2 : 1); i <= this.page - 1 && this.page - i > 0; i++) {
          this.pages.push(i.toString());
          pagesLeft--;
        }
      }
      //agrega la pagina actual
      this.pages.push(this.page.toString());
      //agrega las paginas restantes a la derecha de la pagina actual
      for (let i = this.page + 1; pagesLeft > 0 && i <= totalPages; i++) {
        this.pages.push(i.toString());
        pagesLeft--;
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        this.pages.push(i.toString());
      }
    }
  }

  public seleccionarMarca() {
    this.product.brand._id = this.marcaSeleccionada;
    console.log('Se selecciono la marca ' + this.product.brand._id);
  }

  public seleccionarTipoProducto() {
    this.product.productType._id = this.productTypeSeleccionado;
    console.log('Se selecciono el tipo de producto ' + this.product.productType._id);
  }

  public validarProducto() {
    if (this.product.name.length > 0 && this.product.brand._id.length > 0 &&
      this.product.model > 0 && this.product.cylinder.length > 0) {
      return true;
    }
    return false;
  }

  public addBrand() {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.brand.name == null || this.brand.name.length == 0) {
      this.errorMessage = 'Debe ingresar el nombre de la marca';
      return;
    }
    //crear marca
    this._brandService.save(this.brand).subscribe(
      response => {
        console.log(response);
        this.brand = response.brand;
        if (!this.brand._id) {
          this.errorMessage = 'Ocurrió un error al crear la marca';
        } else {
          this.successMessage = 'Se creó la marca ' + this.brand.name + ' correctamente';
          this.marcaSeleccionada = this.brand._id;
          this.product.brand = this.brand;
          this.brand = new Brand('', '');
          this.cargarMarcas();
        }
      },
      error => {
        const errorResponse = <any>error;
        if (errorResponse != null) {
          this.errorMessage = JSON.parse(errorResponse._body).message;
          console.error(this.errorMessage);
        }
      }
    );
  }

  public addProductType() {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.productType.name == null || this.productType.name.length == 0) {
      this.errorMessage = 'Debe ingresar el nombre del tipo de producto';
      return;
    }
    //crear tipo producto
    this._productTypeService.save(this.productType).subscribe(
      response => {
        console.log(response);
        this.productType = response.productType;
        if (!this.productType._id) {
          this.errorMessage = 'Ocurrió un error al crear el tipo de producto';
        } else {
          this.successMessage = 'Se creó el tipo de producto ' + this.productType.name + ' correctamente';
          this.productTypeSeleccionado = this.productType._id;
          this.product.productType = this.productType;
          this.productType = new ProductType('', '');
          this.cargarTiposProducto();
        }
      },
      error => {
        const errorResponse = <any>error;
        if (errorResponse != null) {
          this.errorMessage = JSON.parse(errorResponse._body).message;
          console.error(this.errorMessage);
        }
      }
    );
  }

  public addProduct() {
    this.errorMessage = null;
    this.successMessage = null;
    //Se valida que los datos del producto esten conpletos
    if (!this.product.name || this.product.name.length <= 0 || !this.product.brand || !this.product.brand._id || this.product.brand._id.length <= 0
      || !this.product.cylinder || this.product.cylinder.length <= 0 || !this.product.model || this.product.model <= 0
      || !this.product.productType || !this.product.productType._id || this.product.productType._id.length <= 0
      || !this.product.price || this.product.price <= 0) {
      this.errorMessage = 'Debe llenar todos los campos obligatorios';
      this.valid = false;
      return;
    }
    if (this.product._id) {
      //modificar
      for (let i = 0; i < this.product.images.length; i++) {
        this.product.images[i] = this.product.images[i].replace(this.url + 'product/get-image/', '');
      }
      this._productService.updateProduct(this.product).subscribe(
        response => {
          this.product = response.product;
          if (!this.product._id) {
            this.errorMessage = 'Ocurrió un error al actualizar el producto';
          } else {
            console.log(this.product);
            this.successMessage = 'Se actualizó el producto ' + this.product.name + ' correctamente';
            if (this.images && this.images.length > 0) {
              this.subirImagen(this.product._id);
            } else {
              this.limpiar();
            }
          }
        },
        error => {
          const errorResponse = <any>error;
          if (errorResponse != null) {
            this.errorMessage = JSON.parse(errorResponse._body).message;
            console.error(this.errorMessage);
          }
        }
      );
    } else {
      //crear
      this._productService.save(this.product).subscribe(
        response => {
          console.log(this.product);
          this.product = response.product;
          if (!this.product._id) {
            this.errorMessage = 'Ocurrió un error al crear el producto';
          } else {
            this.successMessage = 'Se creó el producto ' + this.product.name + ' correctamente';
            if (this.images && this.images.length > 0) {
              this.subirImagen(this.product._id);
            } else {
              this.limpiar();
            }
          }
        },
        error => {
          const errorResponse = <any>error;
          if (errorResponse != null) {
            this.errorMessage = JSON.parse(errorResponse._body).message;
            console.error(this.errorMessage);
          }
        }
      );
    }
  }

  public selectProduct(producto) {
    this.marcaSeleccionada = '';
    this.productTypeSeleccionado = '';
    this.product = new Product('', '', { _id: null, name: null }, null, '', null, { _id: null, name: null }, '#000000', new Array<string>());

    this.product._id = producto._id;
    this.product.name = producto.name;
    if (producto.brandId) {
      this.product.brand._id = producto.brandId._id;
      this.product.brand.name = producto.brandId.name;
      this.marcaSeleccionada = this.product.brand._id;
    }
    this.product.model = producto.model;
    this.product.cylinder = producto.cylinder;
    if (!producto.color || producto.color.length <= 0) {
      this.product.color = '#000000';
    } else {
      this.product.color = producto.color;
    }
    this.product.price = producto.price;
    if (producto.images) {
      for (let i = 0; i < producto.images.length; i++) {
        let image_path = this.url + 'product/get-image/' + producto.images[i];
        this.product.images.push(image_path);
      }
    }
    //this.product.images = producto.images;
    if (producto.productTypeId) {
      this.product.productType._id = producto.productTypeId._id;
      this.product.productType.name = producto.productTypeId.name;
      this.productTypeSeleccionado = this.product.productType._id;
    }
    console.log(this.product);
    console.log(producto.images);
  }

  public imageSelected(fileInput: any) {
    console.log('------------------Hola--------------------');
    this.images = <Array<File>>(fileInput.target.files);
    this.image = '';
    for (let i = 0; i < this.images.length; i++) {
      console.log('Se incluyo la imagen: ' + this.images[i].name);
      this.image += this.images[i].name + '; ';
    }
  }

  private subirImagen(id) {
    console.log(this.images);
    if (this.images) {
      this._uploadService.makeFileRequest(GLOBAL.url + 'product/upload/' + id, 'PUT', [], this.images, 'image', null).then(
        (result: string) => {
          console.log(JSON.parse(result));
          console.log(typeof result);
          this.limpiar();
        }, (error) => {
          console.error(error);
          this.errorMessage = 'Error al guardar las imagenes ' + JSON.parse(error._body).message;
        }
      );
    } else {
      console.log('no hay archivos para subir');
    }
  }

  mostrarPagina(pageToShow) {
    if (pageToShow <= 0) {
      this.page = 1;
    } else if (pageToShow > this.pages.length) {
      this.page = this.pages.length;
    } else {
      this.page = pageToShow;
    }
    this.listarProductos();;
  }

  cambioTamanoPagina() {
    console.log('tamano pagina ' + this.pageSize);
    this.listarProductos();
  }

  public limpiar(){
    this.product = new Product('', '', { _id: null, name: null }, null, '', null, { _id: null, name: null }, '#000000', new Array<string>());
    this.marcaSeleccionada = '';
    this.productTypeSeleccionado = '';
    this.images = new Array<File>();
    this.image = '';
    this.valid = true;
    this.listarProductos();
  }
}
