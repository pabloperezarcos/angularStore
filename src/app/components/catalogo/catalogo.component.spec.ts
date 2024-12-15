import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CatalogoComponent } from './catalogo.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CatalogoComponent', () => {
  let component: CatalogoComponent;
  let fixture: ComponentFixture<CatalogoComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockProductos = [
    { id: 1, nombre: 'Producto 1', precio: 100, descripcion: '' },
    { id: 2, nombre: 'Producto 2', precio: 200, descripcion: '' },
  ];

  beforeEach(async () => {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getProductos']);

    await TestBed.configureTestingModule({
      imports: [CatalogoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture = TestBed.createComponent(CatalogoComponent);
    component = fixture.componentInstance;
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializar', () => {
    productService.getProductos.and.returnValue(of(mockProductos));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.productos).toEqual(mockProductos);
    expect(productService.getProductos).toHaveBeenCalled();
  });

  it('debería manejar errores al cargar productos', () => {
    productService.getProductos.and.returnValue(throwError(() => new Error('Error de red')));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.productos).toEqual([]);
    expect(productService.getProductos).toHaveBeenCalled();
  });
});
