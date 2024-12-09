import { TestBed } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: any;
  let productService: ProductService;
  let httpMock: HttpTestingController;

  const mockProductos: Producto[] = [
    {
      id: 1, nombre: 'Producto A', precio: 100,
      descripcion: ''
    },
    {
      id: 2, nombre: 'Producto B', precio: 200,
      descripcion: ''
    },
    {
      id: 3, nombre: 'Producto C', precio: 300,
      descripcion: ''
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService,
      ],
    });

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería buscar productos por término', () => {
    component.searchTerm = 'Producto';
    component.searchProductos('Producto');

    const req = httpMock.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { productosList: mockProductos } });

    expect(component.productos.length).toBe(3);
    expect(component.productos).toEqual(mockProductos);
    expect(component.loading).toBeFalse();
  });

  it('debería filtrar productos basados en el término de búsqueda', () => {
    component.searchTerm = 'Producto A';
    component.searchProductos('Producto A');

    const req = httpMock.expectOne('http://localhost:8080/api/productos');
    expect(req.request.method).toBe('GET');
    req.flush({ _embedded: { productosList: mockProductos } });

    expect(component.productos.length).toBe(1);
    expect(component.productos[0].nombre).toBe('Producto A');
    expect(component.loading).toBeFalse();
  });

  it('debería manejar errores al buscar productos', () => {
    component.searchTerm = 'Producto X';
    component.searchProductos('Producto X');

    const req = httpMock.expectOne('http://localhost:8080/api/productos');
    req.error(new ErrorEvent('Network error'));

    expect(component.productos.length).toBe(0);
    expect(component.loading).toBeFalse();
  });
});
