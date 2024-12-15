import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { of, throwError } from 'rxjs';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, imagen: 'img1.jpg' },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200, imagen: 'img2.jpg' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['searchProductos']);

    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        { provide: ProductService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ query: 'Producto' }),
          },
        },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el término de búsqueda desde queryParams y buscar productos', () => {
    productServiceSpy.searchProductos.and.returnValue(of(mockProductos));

    fixture.detectChanges();

    expect(component.searchTerm).toBe('Producto');
    expect(productServiceSpy.searchProductos).toHaveBeenCalledWith('Producto');
    expect(component.productos).toEqual(mockProductos);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar error al buscar productos', () => {
    productServiceSpy.searchProductos.and.returnValue(throwError(() => new Error('Error al buscar productos')));

    fixture.detectChanges();

    expect(component.searchTerm).toBe('Producto');
    expect(productServiceSpy.searchProductos).toHaveBeenCalledWith('Producto');
    expect(component.productos).toEqual([]);
    expect(component.errorMessage).toBe('Hubo un error al cargar los resultados de búsqueda.');
    expect(component.loading).toBeFalse();
  });
});

describe('SearchResultsComponent sin término de búsqueda', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['searchProductos']);

    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent],
      providers: [
        { provide: ProductService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}), // Sin término de búsqueda
          },
        },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
  });

  it('debería manejar caso donde no se provee un término de búsqueda', () => {
    fixture.detectChanges();

    expect(component.searchTerm).toBe('');
    expect(component.productos).toEqual([]);
    expect(productServiceSpy.searchProductos).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
