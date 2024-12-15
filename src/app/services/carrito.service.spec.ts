import { TestBed } from '@angular/core/testing';
import { CarritoService } from './carrito.service';
import { ProductService } from './product.service';
import { Producto } from '../models/producto.model';
import { of } from 'rxjs';

describe('CarritoService', () => {
  let service: CarritoService;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducto: Producto = {
    id: 1, nombre: 'Producto 1', precio: 100,
    descripcion: ''
  };

  beforeEach(() => {
    const productServiceMock = jasmine.createSpyObj('ProductService', [
      'getProductoById',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CarritoService,
        { provide: ProductService, useValue: productServiceMock },
      ],
    });

    service = TestBed.inject(CarritoService);
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>;

    // Simular almacenamiento local
    spyOn(localStorage, 'getItem').and.callFake(() => null);
    spyOn(localStorage, 'setItem').and.callFake(() => { });
    spyOn(localStorage, 'removeItem').and.callFake(() => { });
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería añadir un producto al carrito', () => {
    service.addToCarrito(mockProducto, 2);
    const items = service.getCarritoItems();
    expect(items.length).toBe(1);
    expect(items[0].producto).toEqual(mockProducto);
    expect(items[0].quantity).toBe(2);
  });

  it('debería incrementar la cantidad si el producto ya está en el carrito', () => {
    service.addToCarrito(mockProducto, 2);
    service.addToCarrito(mockProducto, 3);
    const items = service.getCarritoItems();
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(5);
  });

  it('debería eliminar un producto del carrito', () => {
    service.addToCarrito(mockProducto, 2);
    service.removeFromCarrito(mockProducto);
    const items = service.getCarritoItems();
    expect(items.length).toBe(0);
  });

  it('debería actualizar la cantidad de un producto en el carrito', () => {
    service.addToCarrito(mockProducto, 2);
    service.updateQuantity(mockProducto, 5);
    const items = service.getCarritoItems();
    expect(items[0].quantity).toBe(5);
  });

  it('debería limpiar el carrito', () => {
    service.addToCarrito(mockProducto, 2);
    service.clearCarrito();
    const items = service.getCarritoItems();
    expect(items.length).toBe(0);
  });

  it('debería sincronizar el carrito con el backend', () => {
    const updatedProducto: Producto = {
      id: 1,
      nombre: 'Producto Actualizado',
      precio: 150,
      descripcion: ''
    };

    productServiceSpy.getProductoById.and.returnValue(of(updatedProducto));
    service.addToCarrito(mockProducto, 2);
    service.syncCarritoWithBackend();

    const items = service.getCarritoItems();
    expect(items[0].producto).toEqual(updatedProducto);
    expect(productServiceSpy.getProductoById).toHaveBeenCalledWith(1);
  });

  it('debería devolver el número total de productos en el carrito', () => {
    service.addToCarrito(mockProducto, 2);
    service.addToCarrito({
      id: 2, nombre: 'Producto 2', precio: 200,
      descripcion: ''
    }, 3);
    const total = service.getItemCount();
    expect(total).toBe(5);
  });

  it('debería guardar y devolver los productos comprados', () => {
    service.addToCarrito(mockProducto, 2);
    service.savePurchasedItems();
    const purchasedItems = service.getPurchasedItems();
    expect(purchasedItems.length).toBe(1);
    expect(purchasedItems[0].producto).toEqual(mockProducto);
  });
});
