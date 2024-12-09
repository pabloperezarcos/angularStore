import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CarritoComponent } from './carrito.component';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto.model';

describe('CarritoComponent', () => {
  let component: CarritoComponent;
  let fixture: ComponentFixture<CarritoComponent>;
  let carritoServiceSpy: jasmine.SpyObj<CarritoService>;

  // Mock products for testing
  const mockProductos: Producto[] = [
    {
      id: 1,
      nombre: 'Producto 1',
      precio: 100,
      descripcion: 'Descripción del producto 1',
      imagen: 'url-imagen-1'
    },
    {
      id: 2,
      nombre: 'Producto 2',
      precio: 200,
      descripcion: 'Descripción del producto 2',
      imagen: 'url-imagen-2'
    }
  ];

  beforeEach(async () => {
    // Create a spy object for CarritoService
    const spy = jasmine.createSpyObj('CarritoService', [
      'getCarritoItems',
      'removeFromCarrito',
      'updateQuantity',
      'clearCarrito',
      'savePurchasedItems'
    ]);

    await TestBed.configureTestingModule({
      imports: [CarritoComponent], // Standalone component import
      providers: [
        { provide: CarritoService, useValue: spy },
        provideRouter([]) // Modern routing configuration
      ]
    }).compileComponents();

    // Setup spy return values
    carritoServiceSpy = TestBed.inject(CarritoService) as jasmine.SpyObj<CarritoService>;
    carritoServiceSpy.getCarritoItems.and.returnValue([
      { producto: mockProductos[0], quantity: 2 },
      { producto: mockProductos[1], quantity: 1 }
    ]);

    // Create component and detect changes
    fixture = TestBed.createComponent(CarritoComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with cart items and calculate total correctly', () => {
    expect(component.carritoItems.length).toBe(2);
    expect(component.total).toBe(400); // (100 * 2) + (200 * 1)
    expect(component.isCartEmpty).toBeFalse();
  });

  it('should remove item from cart', () => {
    component.removeItem(0);

    expect(carritoServiceSpy.removeFromCarrito).toHaveBeenCalledWith(mockProductos[0]);
    expect(component.carritoItems.length).toBe(1);
    expect(component.total).toBe(200);
  });

  it('should update item quantity', () => {
    component.updateQuantity(0, 3);

    expect(carritoServiceSpy.updateQuantity).toHaveBeenCalledWith(mockProductos[0], 3);
    expect(component.carritoItems.length).toBe(2);
  });

  it('should clear cart', () => {
    component.limpiarCarrito();

    expect(carritoServiceSpy.clearCarrito).toHaveBeenCalled();
    expect(component.carritoItems.length).toBe(0);
    expect(component.total).toBe(0);
    expect(component.isCartEmpty).toBeTrue();
  });

  it('should validate payment method', () => {
    // No payment method selected
    component.paymentMethod = '';
    component.procederAlPago();

    expect(component.paymentMessage).toBe('Seleccione un método de pago');
  });

  it('should process payment and navigate to checkout', () => {
    // Use jasmine.clock() for testing async operations instead of fakeAsync/tick
    jasmine.clock().install();

    // Create a spy for router navigation
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    // Set payment method
    component.paymentMethod = 'Tarjeta';
    component.procederAlPago();

    // Simulate passage of time
    jasmine.clock().tick(3000);
    expect(component.paymentMessage).toBe('Pago Exitoso, estás siendo redireccionado al checkout...');
    expect(carritoServiceSpy.savePurchasedItems).toHaveBeenCalled();

    // Simulate navigation
    jasmine.clock().tick(4000);
    expect(navigateSpy).toHaveBeenCalledWith(['/checkout']);

    jasmine.clock().uninstall();
  });
});