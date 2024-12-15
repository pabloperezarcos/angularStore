import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService } from '../../services/product.service';
import { of, throwError } from 'rxjs';
import { Producto } from '../../models/producto.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter, Routes } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCl from '@angular/common/locales/es-CL';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productService: jasmine.SpyObj<ProductService>;

  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 100, descripcion: '' },
    { id: 2, nombre: 'Producto 2', precio: 200, descripcion: '' },
    { id: 3, nombre: 'Producto 3', precio: 300, descripcion: '' },
    { id: 4, nombre: 'Producto 4', precio: 400, descripcion: '' },
  ];

  beforeAll(() => {
    // Registrar datos de localización antes de todas las pruebas
    registerLocaleData(localeEsCl);
  });

  beforeEach(async () => {
    const productServiceMock = jasmine.createSpyObj('ProductService', ['getProductos']);

    const routes: Routes = [
      { path: '', component: HomeComponent },
      // Agrega otras rutas si es necesario
    ];

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent, // Componente standalone
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'es-CL' },
        { provide: ProductService, useValue: productServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        provideHttpClientTesting(), // Proveedor para HttpClientTesting
        provideRouter(routes), // Proveedor para Router con rutas definidas
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los productos destacados al inicializar', () => {
    productService.getProductos.and.returnValue(of(mockProductos));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.productos.length).toBe(3); // Solo los primeros 3 productos
    expect(component.productos).toEqual(mockProductos.slice(0, 3));
  });

  it('debería manejar errores al cargar productos desde el backend', () => {
    spyOn(console, 'error'); // Espía para capturar el error en consola
    productService.getProductos.and.returnValue(throwError(() => new Error('Error de red')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(component.productos).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error obteniendo productos:', jasmine.any(Error));
  });
});
