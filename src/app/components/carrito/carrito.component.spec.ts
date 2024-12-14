import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoComponent } from './carrito.component';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';
import { provideRouter, Routes, Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { provideLocationMocks } from '@angular/common/testing';

// Verificar que CarritoComponent está definido
console.log('CarritoComponent:', CarritoComponent);

// Definir un componente mock para CheckoutComponent
@Component({
  selector: 'app-checkout',
  template: '',
})
class MockCheckoutComponent { }

// Verificar que MockCheckoutComponent está definido
console.log('MockCheckoutComponent:', MockCheckoutComponent);

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;
  let carritoService: jasmine.SpyObj<CarritoService>;
  let router: Router;

  // Datos de prueba
  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción 1' },
    { id: 2, nombre: 'Producto 2', precio: 200, descripcion: 'Descripción 2' },
    { id: 3, nombre: 'Producto 3', precio: 300, descripcion: 'Descripción 3' },
  ];

  const mockCarritoItems: any[] = [
    { producto: mockProductos[0], quantity: 2 }, // Total: 200
    { producto: mockProductos[1], quantity: 1 }, // Total: 200
    { producto: mockProductos[2], quantity: 3 }, // Total: 900
  ]; // Total General: 1300

  // Datos de prueba para productos sin precio
  const productosSinPrecio: Producto[] = [
    { id: 4, nombre: 'Producto 4', descripcion: 'Descripción 4', precio: undefined }, // precio undefined
    { id: 5, nombre: 'Producto 5', descripcion: 'Descripción 5', precio: undefined }, // precio undefined
  ];

  const carritoItemsSinPrecio: any[] = [
    { producto: productosSinPrecio[0], quantity: 2 },
    { producto: productosSinPrecio[1], quantity: 3 },
  ];

  // Definir rutas básicas para el Router usando el componente mock
  const routes: Routes = [
    { path: 'checkout', component: MockCheckoutComponent },
    { path: '', redirectTo: '/checkout', pathMatch: 'full' },
  ];

  beforeEach(async () => {
    // Crear mocks para CarritoService sin redefinir la interfaz
    const carritoServiceMock = jasmine.createSpyObj('CarritoService', [
      'getCarritoItems',
      'removeFromCarrito',
      'updateQuantity',
      'savePurchasedItems',
      'clearCarrito',
    ]);

    await TestBed.configureTestingModule({
      declarations: [MockCheckoutComponent], // Declarar el componente mock
      imports: [
        CarritoComponent, // Importar el componente standalone
        CommonModule,
        FormsModule,
      ],
      providers: [
        provideRouter(routes), // Usar provideRouter en providers
        provideLocationMocks(), // Proveer mocks de Location
        { provide: CarritoService, useValue: carritoServiceMock }, // Mock de CarritoService
        CurrencyPipe, // Proveer CurrencyPipe ya que el componente lo importa
        provideHttpClientTesting(), // Proveedor para pruebas de HTTP
      ],
    }).compileComponents();

    // Inyectar los mocks
    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    router = TestBed.inject(Router);

    // Configurar el mock de getCarritoItems para devolver los ítems de prueba
    carritoService.getCarritoItems.and.returnValue(mockCarritoItems);

    // Espiar el método navigate del router
    spyOn(router, 'navigate').and.stub();

    // Crear la instancia del componente
    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar carritoItems, calcular el total y verificar si el carrito está vacío', () => {
    // Verificar que getCarritoItems fue llamado
    expect(carritoService.getCarritoItems).toHaveBeenCalled();

    // Verificar que carritoItems fue asignado correctamente
    expect(component.carritoItems).toEqual(mockCarritoItems);

    // Verificar que el total fue calculado correctamente
    expect(component.total).toBe(1300);

    // Verificar que isCartEmpty es false
    expect(component.isCartEmpty).toBeFalse();
  });

  it('debería calcular el total correctamente', () => {
    // Asignar los ítems del carrito
    component.carritoItems = mockCarritoItems;

    // Calcular el total
    component.calculateTotal();

    // Verificar que el total es correcto
    expect(component.total).toBe(1300);
  });

  it('debería remover un ítem del carrito correctamente', () => {
    // Remover el segundo ítem (índice 1)
    component.removeItem(1);

    // Verificar que removeFromCarrito fue llamado con el producto correcto
    expect(carritoService.removeFromCarrito).toHaveBeenCalledWith(mockCarritoItems[1].producto);

    // Configurar el mock para devolver los ítems actualizados
    const updatedCarritoItems: any[] = [
      mockCarritoItems[0],
      mockCarritoItems[2],
    ];
    carritoService.getCarritoItems.and.returnValue(updatedCarritoItems);

    // Actualizar la asignación
    component.carritoItems = carritoService.getCarritoItems();

    // Calcular el total
    component.calculateTotal();

    // Verificar que el total es correcto
    expect(component.total).toBe(1100);

    // Verificar que isCartEmpty es false
    expect(component.isCartEmpty).toBeFalse();
  });

  it('debería manejar correctamente un carrito vacío', () => {
    // Configurar el mock para devolver un carrito vacío
    carritoService.getCarritoItems.and.returnValue([]);

    // Inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();

    // Verificar que carritoItems está vacío
    expect(component.carritoItems).toEqual([]);

    // Verificar que el total es 0
    expect(component.total).toBe(0);

    // Verificar que isCartEmpty es true
    expect(component.isCartEmpty).toBeTrue();
  });

  it('debería manejar correctamente productos sin precio definido', () => {
    // Configurar el mock para devolver los ítems sin precio
    carritoService.getCarritoItems.and.returnValue(carritoItemsSinPrecio);

    // Inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();

    // Verificar que carritoItems fue asignado correctamente
    expect(component.carritoItems).toEqual(carritoItemsSinPrecio);

    // Verificar que el total es 0 debido a precios undefined
    expect(component.total).toBe(0);

    // Verificar que isCartEmpty es false
    expect(component.isCartEmpty).toBeFalse();
  });

  it('debería actualizar la cantidad correctamente', () => {
    // Definir los ítems actualizados
    const updatedCarritoItems: any[] = [
      { producto: mockCarritoItems[0].producto, quantity: 5 }, // Total: 500
      mockCarritoItems[1], // Total: 200
      mockCarritoItems[2], // Total: 900
    ]; // Total General: 1600

    // Configurar getCarritoItems para devolver mockCarritoItems en la primera llamada
    // y updatedCarritoItems en la segunda llamada
    carritoService.getCarritoItems.and.returnValues(mockCarritoItems, updatedCarritoItems);

    // Actualizar la cantidad del primer ítem a 5
    component.updateQuantity(0, 5);

    // Verificar que updateQuantity fue llamado con los parámetros correctos
    expect(carritoService.updateQuantity).toHaveBeenCalledWith(mockCarritoItems[0].producto, 5);

    // Verificar que carritoItems está actualizado
    expect(component.carritoItems).toEqual(updatedCarritoItems);

    // Verificar que el total ha cambiado correctamente
    expect(component.total).toBe(1600);
  });

});
