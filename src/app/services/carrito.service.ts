import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';
import { BehaviorSubject } from 'rxjs';
import { ProductService } from './product.service';

/**
 * Interfaz que define la estructura de un item en el carrito.
 */
interface CarritoItem {
  producto: Producto;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private carritoItems: CarritoItem[] = [];
  private readonly carritoSubject = new BehaviorSubject<CarritoItem[]>(this.carritoItems);
  carritoActualizado = this.carritoSubject.asObservable();
  private purchasedItems: CarritoItem[] = [];

  constructor(private readonly productService: ProductService) {
    this.loadCarrito();
  }

  private saveCarrito(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
      this.carritoSubject.next(this.carritoItems);
    }
  }

  private loadCarrito(): void {
    if (this.isLocalStorageAvailable()) {
      const carritoSaved = localStorage.getItem('carrito');
      if (carritoSaved) {
        this.carritoItems = JSON.parse(carritoSaved);
        this.carritoSubject.next(this.carritoItems);
      }
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Sincroniza el carrito con el backend.
   * Si algún producto del carrito ha cambiado en el backend, actualiza la información local.
   */
  syncCarritoWithBackend(): void {
    this.carritoItems.forEach((item) => {
      this.productService.getProductoById(item.producto.id).subscribe({
        next: (productoActualizado) => {
          item.producto = productoActualizado;
          this.saveCarrito();
        },
        error: (error) => {
          console.error('Error sincronizando producto:', error);
        }
      });

    });
  }

  getCarritoItems(): CarritoItem[] {
    return this.carritoItems;
  }

  getItemCount(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  addToCarrito(producto: Producto, quantity: number): void {
    const existingProducto = this.carritoItems.find(
      (item) => item.producto.id === producto.id
    );
    if (existingProducto) {
      existingProducto.quantity += quantity;
    } else {
      this.carritoItems.push({ producto, quantity });
    }
    this.saveCarrito();
  }

  removeFromCarrito(producto: Producto): void {
    this.carritoItems = this.carritoItems.filter(
      (item) => item.producto.id !== producto.id
    );
    this.saveCarrito();
  }

  updateQuantity(producto: Producto, quantity: number): void {
    const existingItem = this.carritoItems.find(
      (item) => item.producto.id === producto.id
    );
    if (existingItem) {
      existingItem.quantity = quantity;
    }
    this.saveCarrito();
  }

  clearCarrito(): void {
    this.carritoItems = [];
    this.saveCarrito();
  }

  savePurchasedItems(): void {
    this.purchasedItems = [...this.carritoItems];
  }

  getPurchasedItems(): CarritoItem[] {
    return this.purchasedItems;
  }
}
