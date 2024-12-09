import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Producto } from '../models/producto.model';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/productos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    const mockProductos: Producto[] = [
      {
        id: 1, nombre: 'Producto 1', precio: 100,
        descripcion: ''
      },
      {
        id: 2, nombre: 'Producto 2', precio: 200,
        descripcion: ''
      },
    ];

    service.getProductos().subscribe((productos) => {
      expect(productos.length).toBe(2);
      expect(productos).toEqual(mockProductos);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { productosList: mockProductos } });
  });

  it('should fetch a product by ID', () => {
    const mockProducto: Producto = {
      id: 1, nombre: 'Producto 1', precio: 100,
      descripcion: ''
    };

    service.getProductoById(1).subscribe((producto) => {
      expect(producto).toEqual(mockProducto);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducto);
  });

  it('should create a product', () => {
    const newProducto: Producto = {
      id: 3, nombre: 'Producto 3', precio: 300,
      descripcion: ''
    };

    service.crearProducto(newProducto).subscribe((producto) => {
      expect(producto).toEqual(newProducto);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newProducto);
  });

  it('should update a product', () => {
    const updatedProducto: Producto = {
      id: 1, nombre: 'Producto Actualizado', precio: 150,
      descripcion: ''
    };

    service.actualizarProducto(1, updatedProducto).subscribe((producto) => {
      expect(producto).toEqual(updatedProducto);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProducto);
  });

  it('debería eliminar un producto', () => {
    const productId = 1;

    service.eliminarProducto(productId).subscribe((response) => {
      expect(response).toBeNull(); // Cambiado para esperar null
    });

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null); // Elimina el producto y devuelve null
  });

});
