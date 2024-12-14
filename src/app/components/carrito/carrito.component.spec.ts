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

  let mockProductos: Producto[];
  let mockCarritoItems: any[];

  // Datos de prueba para productos sin precio
  let productosSinPrecio: Producto[];
  let carritoItemsSinPrecio: any[];

  // Definir rutas básicas para el Router usando el componente mock
  const routes: Routes = [
    { path: 'checkout', component: MockCheckoutComponent },
    { path: '', redirectTo: '/checkout', pathMatch: 'full' },
  ];

  beforeEach(async () => {
    // Inicializamos los datos en cada beforeEach:
    mockProductos = [
      { id: 1, nombre: 'Producto 1', precio: 100, descripcion: 'Descripción 1' },
      { id: 2, nombre: 'Producto 2', precio: 200, descripcion: 'Descripción 2' },
      { id: 3, nombre: 'Producto 3', precio: 300, descripcion: 'Descripción 3' },
    ];

    mockCarritoItems = [
      { producto: mockProductos[0], quantity: 2 }, // Total: 200
      { producto: mockProductos[1], quantity: 1 }, // Total: 200
      { producto: mockProductos[2], quantity: 3 }, // Total: 900
    ]; // Total General: 1300

    productosSinPrecio = [
      { id: 4, nombre: 'Producto 4', descripcion: 'Descripción 4', precio: undefined },
      { id: 5, nombre: 'Producto 5', descripcion: 'Descripción 5', precio: undefined },
    ];

    carritoItemsSinPrecio = [
      { producto: productosSinPrecio[0], quantity: 2 },
      { producto: productosSinPrecio[1], quantity: 3 },
    ];

    const carritoServiceMock = jasmine.createSpyObj('CarritoService', [
      'getCarritoItems',
      'removeFromCarrito',
      'updateQuantity',
      'savePurchasedItems',
      'clearCarrito',
    ]);

    await TestBed.configureTestingModule({
      declarations: [MockCheckoutComponent],
      imports: [
        CarritoComponent,
        CommonModule,
        FormsModule,
      ],
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        { provide: CarritoService, useValue: carritoServiceMock },
        CurrencyPipe,
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    carritoService = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    router = TestBed.inject(Router);

    // Configurar el mock de getCarritoItems para devolver los ítems de prueba
    carritoService.getCarritoItems.and.returnValue(mockCarritoItems);

    // Espiar el método navigate del router
    spyOn(router, 'navigate').and.stub();

    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar carritoItems, calcular el total y verificar si el carrito está vacío', () => {
    carritoService.getCarritoItems.and.returnValue(mockCarritoItems);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.carritoItems).toEqual(mockCarritoItems);
    expect(component.total).toBe(1300);
    expect(component.isCartEmpty).toBeFalse();
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar carritoItems, calcular el total y verificar si el carrito está vacío', () => {
    // Asegurar que el mock devuelve los datos correctos
    carritoService.getCarritoItems.and.returnValue(mockCarritoItems);

    // Inicializar el componente
    component.ngOnInit();
    fixture.detectChanges();

    // Verificar que carritoItems se inicializó correctamente
    expect(component.carritoItems).toEqual(mockCarritoItems);

    // Verificar que el total fue calculado correctamente
    expect(component.total).toBe(1300);

    // Verificar que el carrito no está vacío
    expect(component.isCartEmpty).toBeFalse();
  });

  it('debería remover un ítem del carrito correctamente', () => {
    // Configurar el mock para simular la eliminación
    carritoService.removeFromCarrito.and.callFake((producto) => {
      const index = mockCarritoItems.findIndex((i) => i.producto.id === producto.id);
      if (index !== -1) {
        mockCarritoItems.splice(index, 1);
      }
    });

    // Datos actualizados tras la eliminación
    const updatedCarritoItems: any[] = [
      mockCarritoItems[0], // Total: 200
      mockCarritoItems[2], // Total: 900
    ]; // Total General: 1100

    carritoService.getCarritoItems.and.returnValue(updatedCarritoItems);

    // Llamar al método para eliminar el producto con ID 2
    component.removeItem(1);

    // Verificar que removeFromCarrito fue llamado con el producto correcto
    expect(carritoService.removeFromCarrito).toHaveBeenCalledWith(mockProductos[1]);

    // Actualizar los datos del carrito en el componente
    component.carritoItems = carritoService.getCarritoItems();
    component.calculateTotal();

    // Verificar que los datos del carrito están actualizados
    expect(component.carritoItems).toEqual(updatedCarritoItems);

    // Verificar que el total es correcto
    expect(component.total).toBe(1100);

    // Verificar que el carrito no está vacío
    expect(component.isCartEmpty).toBeFalse();
  });

  it('debería actualizar la cantidad correctamente', () => {
    // Configurar el mock para simular el cambio en la cantidad
    const updatedCarritoItems: any[] = [
      { producto: mockCarritoItems[0].producto, quantity: 5 }, // Total: 500
      mockCarritoItems[1], // Total: 200
      mockCarritoItems[2], // Total: 900
    ]; // Total General: 1600

    carritoService.updateQuantity.and.callFake((producto, quantity) => {
      if (producto.id === mockCarritoItems[0].producto.id) {
        updatedCarritoItems[0].quantity = quantity;
      }
    });

    carritoService.getCarritoItems.and.returnValue(updatedCarritoItems);

    // Actualizar la cantidad del primer ítem a 5
    component.updateQuantity(0, 5);

    // Verificar que updateQuantity fue llamado con los parámetros correctos
    expect(carritoService.updateQuantity).toHaveBeenCalledWith(mockCarritoItems[0].producto, 5);

    // Verificar que carritoItems está actualizado
    expect(component.carritoItems).toEqual(updatedCarritoItems);

    // Calcular el total nuevamente
    component.calculateTotal();

    // Verificar que el total ha cambiado correctamente
    expect(component.total).toBe(1600);
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
    // Datos actualizados para el carrito
    const updatedCarritoItems: any[] = [
      { producto: mockCarritoItems[0].producto, quantity: 5 }, // Total: 500
      mockCarritoItems[1], // Total: 200
      mockCarritoItems[2], // Total: 900
    ]; // Total General: 1600

    // Configurar el mock de `updateQuantity` para simular el cambio en la cantidad
    carritoService.updateQuantity.and.callFake((producto, quantity) => {
      const item = mockCarritoItems.find((i) => i.producto.id === producto.id);
      if (item) {
        item.quantity = quantity;
      }
    });

    // Configurar el mock de `getCarritoItems` para devolver los datos actualizados
    carritoService.getCarritoItems.and.callFake(() => [...mockCarritoItems]);

    // Llamar al método para actualizar la cantidad
    component.updateQuantity(0, 5);

    // Verificar que `updateQuantity` fue llamado con los parámetros correctos
    expect(carritoService.updateQuantity).toHaveBeenCalledWith(mockCarritoItems[0].producto, 5);

    // Actualizar el estado del carrito en el componente
    component.carritoItems = carritoService.getCarritoItems();

    // Calcular el total nuevamente
    component.calculateTotal();

    // Verificar que el carrito refleja el cambio esperado
    expect(component.carritoItems[0].quantity).toBe(5);
    expect(component.total).toBe(1600);
  });

});
