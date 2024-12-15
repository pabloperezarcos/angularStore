import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: any;
  let productService: jasmine.SpyObj<ProductService>;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let httpMock: HttpTestingController;

  const mockProducto: Producto = {
    id: 1,
    nombre: 'Producto Test',
    precio: 100,
    descripcion: 'Descripción de prueba',
    imagenUrl: 'url-de-imagenUrl',
    stock: 10,
  };

  const mockRelatedProductos: Producto[] = [
    { id: 2, nombre: 'Producto Relacionado 1', precio: 50, descripcion: '', imagenUrl: '', stock: 5 },
    { id: 3, nombre: 'Producto Relacionado 2', precio: 75, descripcion: '', imagenUrl: '', stock: 8 },
    { id: 4, nombre: 'Producto Relacionado 3', precio: 120, descripcion: '', imagenUrl: '', stock: 3 },
  ];

  beforeEach(() => {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getProductoById', 'getProductos']);
    const carritoServiceMock = jasmine.createSpyObj('CarritoService', ['addToCarrito']);

    TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceMock },
        { provide: CarritoService, useValue: carritoServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => (key === 'id' ? '1' : null) }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    httpMock = TestBed.inject(HttpTestingController);

    productService.getProductoById.and.returnValue(of(mockProducto));
    productService.getProductos.and.returnValue(of(mockRelatedProductos));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el producto y los productos relacionados al inicializar', () => {
    component.ngOnInit();

    expect(productService.getProductoById).toHaveBeenCalledWith(1);
    expect(component.producto).toEqual(mockProducto);

    expect(productService.getProductos).toHaveBeenCalled();
    expect(component.relatedProductos.length).toBe(3);
    expect(component.relatedProductos).not.toContain(mockProducto);
  });

  it('debería manejar errores al cargar el producto', () => {
    productService.getProductoById.and.returnValue(throwError(() => new Error('Error al cargar producto')));

    component.ngOnInit();

    expect(component.producto).toBeUndefined();
    expect(component.loading).toBeFalse();
  });

  it('debería agregar el producto actual al carrito', () => {
    component.producto = mockProducto;
    component.quantity = 2;

    component.addToCarrito();

    expect(carritoService.addToCarrito).toHaveBeenCalledWith(mockProducto, 2);
  });

  it('debería manejar errores al cargar productos relacionados', () => {
    productService.getProductos.and.returnValue(
      throwError(() => new Error('Error de red'))
    );

    component.loadRelatedProductos();

    expect(component.relatedProductos).toEqual([]);
  });
});
