import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LOCALE_ID } from '@angular/core';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let router: jasmine.SpyObj<Router>;

  // Datos de prueba
  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción 1' },
    { id: 2, nombre: 'Producto 2', precio: 200, descripcion: 'Descripción 2' },
    { id: 3, nombre: 'Producto 3', precio: 300, descripcion: 'Descripción 3' },
  ];

  const mockCarritoItems = [
    { producto: mockProductos[0], quantity: 2 }, // Total: 200
    { producto: mockProductos[1], quantity: 1 }, // Total: 200
    { producto: mockProductos[2], quantity: 3 }, // Total: 900
  ]; // Total General: 1300

  // Definir rutas básicas para el Router
  const routes: Routes = [
    { path: '', component: CheckoutComponent },
    // Puedes agregar más rutas si es necesario
  ];

  beforeEach(async () => {
    // Crear mocks para CarritoService y Router
    const carritoServiceMock = jasmine.createSpyObj('CarritoService', ['getPurchasedItems']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CheckoutComponent, // Importar el componente standalone
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'es-CL' }, // Proveer locale si es necesario
        { provide: CarritoService, useValue: carritoServiceMock }, // Mock de CarritoService
        { provide: Router, useValue: routerMock }, // Mock de Router
        provideHttpClientTesting(), // Proveedor para pruebas de HTTP
        provideRouter(routes), // Proveedor para Router con rutas definidas
      ],
    }).compileComponents();

    // Inyectar los mocks
    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Crear la instancia del componente
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería generar un número de orden al crear el componente', () => {
    expect(component.orderNumber).toBeDefined();
    expect(component.orderNumber.length).toBe(8); // substring(2,10) genera 8 caracteres
    expect(component.orderNumber).toEqual(component.orderNumber.toUpperCase()); // Debe estar en mayúsculas
  });

  it('debería cargar los ítems del carrito y calcular el total al inicializar', () => {
    // Configurar el mock para devolver los ítems del carrito
    carritoService.getPurchasedItems.and.returnValue(mockCarritoItems);

    // Inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();

    // Verificar que getPurchasedItems fue llamado
    expect(carritoService.getPurchasedItems).toHaveBeenCalled();

    // Verificar que carritoItems fue asignado correctamente
    expect(component.carritoItems).toEqual(mockCarritoItems);

    // Verificar que el total fue calculado correctamente
    expect(component.total).toBe(1300);
  });

  it('debería calcular el total correctamente', () => {
    // Asignar los ítems del carrito
    component.carritoItems = mockCarritoItems;

    // Calcular el total
    component.calculateTotal();

    // Verificar que el total es correcto
    expect(component.total).toBe(1300);
  });

  it('debería navegar a la página de inicio cuando se llama a goHome', () => {
    // Llamar al método goHome
    component.goHome();

    // Verificar que router.navigate fue llamado con la ruta correcta
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería manejar correctamente un carrito vacío', () => {
    // Configurar el mock para devolver un carrito vacío
    carritoService.getPurchasedItems.and.returnValue([]);

    // Inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();

    // Verificar que carritoItems está vacío
    expect(component.carritoItems).toEqual([]);

    // Verificar que el total es 0
    expect(component.total).toBe(0);
  });

  it('debería manejar correctamente productos sin precio definido', () => {
    // Crear ítems con productos sin precio
    const productosSinPrecio: Producto[] = [
      { id: 4, nombre: 'Producto 4', descripcion: 'Descripción 4' }, // precio undefined
      { id: 5, nombre: 'Producto 5', descripcion: 'Descripción 5' }, // precio undefined
    ];

    const carritoItemsSinPrecio = [
      { producto: productosSinPrecio[0], quantity: 2 },
      { producto: productosSinPrecio[1], quantity: 3 },
    ];

    // Configurar el mock para devolver los ítems
    carritoService.getPurchasedItems.and.returnValue(carritoItemsSinPrecio);

    // Inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();

    // Verificar que carritoItems fue asignado correctamente
    expect(component.carritoItems).toEqual(carritoItemsSinPrecio);

    // Verificar que el total es 0 debido a precios undefined
    expect(component.total).toBe(0);
  });
});
