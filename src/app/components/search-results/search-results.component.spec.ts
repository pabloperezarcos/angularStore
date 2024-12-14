import { TestBed } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Producto } from '../../models/producto.model';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: any;
  let productService: ProductService;
  let httpMock: HttpTestingController;

  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Producto A', precio: 100, descripcion: '' },
    { id: 2, nombre: 'Producto B', precio: 200, descripcion: '' },
    { id: 3, nombre: 'Producto C', precio: 300, descripcion: '' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ query: 'Producto' }), // Simula el parámetro de consulta
          },
        },
      ],
    });

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería buscar productos por término', () => {
    // Ejecuta la lógica de búsqueda
    component.searchProductos('Producto');

    const req = httpMock.expectOne('http://localhost:8080/api/productos?query=Producto');
    expect(req.request.method).toBe('GET');

    // Simula la respuesta del backend
    req.flush(mockProductos);

    // Verifica los resultados
    expect(component.productos.length).toBe(3);
    expect(component.productos).toEqual(mockProductos);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar errores al buscar productos', () => {
    // Ejecuta la lógica de búsqueda
    component.searchProductos('Producto X');

    const req = httpMock.expectOne('http://localhost:8080/api/productos?query=Producto X');
    req.error(new ProgressEvent('error'));

    // Verifica los resultados en caso de error
    expect(component.productos.length).toBe(0);
    expect(component.errorMessage).toBe('Hubo un error al cargar los resultados de búsqueda.');
    expect(component.loading).toBeFalse();
  });
});
