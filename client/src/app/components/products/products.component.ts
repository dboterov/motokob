import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';

import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { ProductTypeService } from '../../services/productType.service';
import { UploadService } from '../../services/upload.service';
import { ColorService } from '../../services/color.service';
import { UserService } from '../../services/user.service';

import { Product } from '../../models/product';
import { Brand } from '../../models/brand';
import { ProductType } from '../../models/productType';
import { Color } from '../../models/color';

declare var $: any;

@Component({
  selector: 'product',
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  providers: [ProductService, BrandService, ProductTypeService, UploadService, ColorService, UserService]
})

export class ProductsComponent implements OnInit {
  public totalRecords: number = 0;
  public page: number = 1;
  public pageSize: number = 10;
  public pasoProducto: number = 1;
  public errorMessage: string;
  public successMessage: string;
  public marcaSeleccionada: string;
  public productTypeSeleccionado: string;
  public colorSeleccionado: string = "";
  public nombreColor: string;
  public url: string;
  public image: string;
  public filtroBusqueda: string = '';
  public logoMarca: string = '';
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
  public colors: Array<Color>;

  constructor(private _productService: ProductService, private _brandService: BrandService, private _productTypeService: ProductTypeService,
    private _uploadService: UploadService, private _colorService: ColorService, private _route: ActivatedRoute, private _userService: UserService,
    private _router: Router) {
    this.errorMessage = null;
    this.successMessage = null;
    this.marcaSeleccionada = '';
    this.productTypeSeleccionado = '';
    this.colorSeleccionado = '';
    this.url = GLOBAL.url;
    this.image = '';
    this.images = new Array<File>();
    this.product = new Product();
    this.brand = new Brand();
    this.productType = new ProductType();
    this.products = new Array<Product>();
    this.brands = new Array<Brand>();
    this.productTypes = new Array<ProductType>();
  }

  ngOnInit() {
    console.log('iniciando componente de productos');
    this.cargarMarcas();
    this.cargarTiposProducto();
    this.listarProductos();
    this.cargarColores();
  }

  private cargarMarcas() {
    this.brands = new Array<Brand>();
    this.errorMessage = null;
    this.successMessage = null;
    this._brandService.listBrands().subscribe(
      response => {
        for (let i = 0; i < response.length; i++) {
          let newBrand = new Brand();
          newBrand._id = response[i]._id;
          newBrand.name = response[i].name;
          newBrand.logo = response[i].logo;
          this.brands.push(newBrand);
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

  public cargarColores() {
    this.errorMessage = null;
    this.successMessage = null;
    this.colors = new Array<Color>();
    this._colorService.listColors().subscribe(
      response => {
        this.colors = response.colors;
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

  public guardarColor() {
    this.errorMessage = '';
    if (this.colorSeleccionado != null && this.colorSeleccionado.length > 0) {
      for (let j = 0; j < this.product.colors.length; j++) {
        if (this.product.colors[j]._id === this.colorSeleccionado) {
          this.errorMessage = 'El color ya fue asignado';
          return;
        }
      }

      for (let i = 0; i < this.colors.length; i++) {
        if (this.colors[i]._id === this.colorSeleccionado) {
          this.product.colors.push(this.colors[i]);
          break;
        }
      }
    } else {
      this.addColor();
    }
    this.colorSeleccionado = '';
    this.nombreColor = null;
    $('#modalColor').modal('hide');
  }

  private addColor() {
    this.errorMessage = null;
    this.successMessage = null;
    if (this.nombreColor == null || this.nombreColor.length == 0) {
      this.errorMessage = 'Debe ingresar el nombre del color';
      return;
    }

    let color = {
      name: this.nombreColor.substring(0, 1).toUpperCase() + this.nombreColor.substring(1).toLowerCase()
    }

    // Validar si el color ya existe en la base de datos
    this._colorService.find(color.name).subscribe(
      response => {
        console.log(response);
        if (response.color != null && response.color._id != null && response.color._id.length > 0) {
          this.errorMessage = 'El color que esta intentando guardar ya existe';
          return;
        } else {
          this._colorService.save(color).subscribe(
            response => {
              if (response.color._id != null && response.color._id.length > 0) {
                this.product.colors.push(response.color);
                this.nombreColor = null;
                this.colors.push(response.color);
                this.colors[this.colors.length - 1].seleccionado = true;
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

  public seleccionarColor(_id: string, validateAdmin: boolean = true) {
    if (validateAdmin && !this.isAdmin()) {
      return;
    }
    let eliminar: boolean = false;
    let colors = new Color('', '', false);

    for (let i = 0; i < this.colors.length; i++) {
      if (this.colors[i]._id === _id) {
        colors = this.colors[i];
        if (this.colors[i].seleccionado) {
          this.colors[i].seleccionado = false;
          eliminar = true;
        } else {
          this.colors[i].seleccionado = true;
          eliminar = false;
        }
        break;
      }
    }

    if (!eliminar) {
      this.product.colors.push(colors);
    } else {
      for (let i = 0; i < this.product.colors.length; i++) {
        if (this.product.colors[i]._id === _id) {
          this.product.colors.splice(i, 1);
          break;
        }
      }
    }
  }

  public listarProductos() {
    this.errorMessage = null;
    this.successMessage = null;
    this.products = new Array<Product>();
    this._productService.list(this.page, this.pageSize, this.filtroBusqueda).subscribe(
      response => {
        this.products = response.products;
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
    if (this.marcaSeleccionada && this.marcaSeleccionada === '0') {
      this.product.brand = new Brand();
      return;
    }
    for (let i = 0; i < this.brands.length; i++) {
      if (this.brands[i]._id === this.marcaSeleccionada) {
        this.product.brand = this.brands[i];
        this.product.brand.logo = this.url + 'brand/get-image/' + this.brands[i].logo;
        break;
      }
    }
  }

  public seleccionarTipoProducto() {
    if (this.productTypeSeleccionado && this.productTypeSeleccionado === '0') {
      this.product.productType = new ProductType();
      return;
    }
    for (let i = 0; i < this.productTypes.length; i++) {
      if (this.productTypes[i]._id === this.productTypeSeleccionado) {
        this.product.productType = this.productTypes[i];
        break;
      }
    }
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
          this.product.brand.logo = this.url + 'brand/get-image/' + this.brand.logo;
          this.brand = new Brand();
          this.logoMarca = null;
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
          this.productType = new ProductType();
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
            this.limpiar();
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
      for (let i = 0; i < this.product.images.length; i++) {
        this.product.images[i] = this.product.images[i].replace(this.url + 'product/get-image/', '');
      }
      this._productService.save(this.product).subscribe(
        response => {
          console.log(this.product);
          this.product = response.product;
          if (!this.product._id) {
            this.errorMessage = 'Ocurrió un error al crear el producto';
          } else {
            this.successMessage = 'Se creó el producto ' + this.product.name + ' correctamente';
            this.limpiar();
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
    this.product = new Product();

    this.product._id = producto._id;
    this.product.name = producto.name;
    if (producto.brandId) {
      this.product.brand = producto.brandId;
      this.product.brand.logo = this.url + 'brand/get-image/' + producto.brandId.logo;
      this.marcaSeleccionada = this.product.brand._id;
    }
    this.product.model = producto.model;
    this.product.cylinder = producto.cylinder;
    if (!producto.colors || producto.colors.length <= 0) {
      this.product.colors = new Array<any>();
    } else {
      for (let i = 0; i < producto.colors.length; i++) {
        this.seleccionarColor(producto.colors[i]._id, false);
      }
    }
    this.product.price = producto.price;
    if (producto.images) {
      for (let i = 0; i < producto.images.length; i++) {
        let image_path = this.url + 'product/get-image/' + producto.images[i];
        this.product.images.push(image_path);
      }
    }
    if (producto.productTypeId) {
      this.product.productType._id = producto.productTypeId._id;
      this.product.productType.name = producto.productTypeId.name;
      this.productTypeSeleccionado = this.product.productType._id;
    }
    if (!this.isAdmin()) {
      this.pasoProducto = 6;
    } else {
      this.pasoProducto = 1;
    }
    $('#modalProducto').modal('show');
  }

  public eliminarColorSeleccionado() {
    for (let i = 0; i < this.product.colors.length; i++) {
      if (this.product.colors[i]._id === this.colorSeleccionado) {
        this.product.colors.splice(i, 1);
        this.colorSeleccionado = '';
        break;
      }
    }
  }

  public imageSelected(fileInput: any) {
    let images = <Array<File>>(fileInput.target.files);
    this.image = '';

    this.subirImagen(images);
  }

  public imageLogo(fileInput: any) {
    console.log('Subiendo logo');
    let images = <Array<File>>(fileInput.target.files);
    this.logoMarca = images[0].name;
    this.subirLogo(images);
  }

  public quitarImagen(imagen) {
    console.log('Intentando eliminar imagen: ' + imagen);
    for (let i = 0; i < this.product.images.length; i++) {
      if (this.product.images[i] === imagen) {
        console.log('Se eliminara la imagen');
        this.product.images.splice(i, 1);
        console.log(this.product.images);
        break;
      }
    }
  }

  private subirLogo(imagen) {
    if (imagen) {
      this._uploadService.makeFileRequest(GLOBAL.url + 'brand/upload', 'PUT', [], imagen, 'image', null).then(
        (result: string) => {
          let respObject = JSON.parse(result);
          this.brand.logo = respObject.images[0];
          console.log(this.brand.logo);
        }, (error) => {
          console.error(error);
          this.errorMessage = 'Error al guardar las imagenes ' + JSON.parse(error._body).message;
        }
      );
    } else {
      console.log('no hay archivos para subir');
    }
  }

  private subirImagen(imagen) {
    if (imagen) {
      this._uploadService.makeFileRequest(GLOBAL.url + 'product/upload', 'PUT', [], imagen, 'image', null).then(
        (result: string) => {
          let respObject = JSON.parse(result);
          console.log(respObject);
          for (let i = 0; i < respObject.images.length; i++) {
            let image_path = this.url + 'product/get-image/' + respObject.images[i];
            this.product.images.push(image_path);
          }
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

  public siguientePasoProducto() {
    this.errorMessage = '';
    if (this.pasoProducto === 1) {
      if (this.product.brand == null || this.product.brand._id == null || this.product.brand._id.length <= 0) {
        this.errorMessage = 'Seleccione una marca';
        return;
      }
    } else if (this.pasoProducto === 2) {
      if (this.product.productType == null || this.product.productType._id == null || this.product.productType._id.length <= 0) {
        this.errorMessage = 'Seleccione una tipo';
        return;
      }
    } else if (this.pasoProducto === 3) {
      if (this.product.name == null || this.product.name.length <= 0 || this.product.cylinder == null || this.product.cylinder.length <= 0
        || this.product.model == null || this.product.model <= 0 || this.product.price == null || this.product.price <= 0) {
        this.errorMessage = 'Todos los datos son obligatorios';
        return;
      }
    } else if (this.pasoProducto === 4) {
      if (this.product.colors == null || this.product.colors.length <= 0) {
        this.errorMessage = 'Debe seleccionar al menos un color';
        return;
      }
    }
    this.pasoProducto++;
  }

  public anteriorPasoProducto() {
    this.pasoProducto--;
  }

  public limpiar() {
    this.product = new Product();
    this.marcaSeleccionada = '';
    this.productTypeSeleccionado = '';
    this.images = new Array<File>();
    this.image = '';
    this.pasoProducto = 1;
    this.valid = true;
    this.listarProductos();
    this.cargarColores();

    $('#modalProducto').modal('hide');
  }

  public isAdmin() {
    return this._userService.isAdmin();
  }

  public mostrarOpcionNueva(tipo: string) {
    if (tipo === 'marca') {
      return this.isAdmin && this.marcaSeleccionada && this.marcaSeleccionada == "0";
    } else if (tipo === 'tipo') {
      return this.isAdmin && this.productTypeSeleccionado && this.productTypeSeleccionado == "0";
    } else {
      return false;
    }
  }
}
