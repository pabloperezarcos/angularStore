import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/producto.model';

/**
 * Servicio para gestionar el carrito de compras.
 */
@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  /** Lista de productos en el carrito */
  private carritoItems: { product: Product; quantity: number }[] = [];
  /** Observable para notificar cambios */
  private carritoSubject = new BehaviorSubject<
    { product: Product; quantity: number }[]
  >(this.carritoItems);

  /** Observable del carrito */
  carrito$ = this.carritoSubject.asObservable();

  /**
   * Obtiene los items actuales del carrito.
   */
  getCarritoItems(): { product: Product; quantity: number }[] {
    return [...this.carritoItems];
  }

  /**
   * Añade un producto al carrito o actualiza su cantidad.
   * @param product Producto a añadir.
   * @param quantity Cantidad del producto.
   */
  addToCarrito(product: Product, quantity: number): void {
    const existingItem = this.carritoItems.find(
      (item) => item.product.sku === product.sku
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.carritoItems.push({ product, quantity });
    }

    // Notifica a los suscriptores
    this.carritoSubject.next([...this.carritoItems]);
    console.log('Carrito actualizado:', this.carritoItems);

  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param product Producto a actualizar.
   * @param quantity Nueva cantidad.
   */
  updateQuantity(product: Product, quantity: number): void {
    const existingItem = this.carritoItems.find(
      (item) => item.product.sku === product.sku
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      this.carritoSubject.next(this.carritoItems);
    }
  }

  /**
   * Remueve un producto del carrito.
   * @param product Producto a remover.
   */
  removeFromCarrito(product: Product): void {
    this.carritoItems = this.carritoItems.filter(
      (item) => item.product.sku !== product.sku
    );
    this.carritoSubject.next(this.carritoItems);
  }

  /**
   * Limpia el carrito de compras.
   */
  clearCarrito(): void {
    this.carritoItems = [];
    this.carritoSubject.next([...this.carritoItems]);
  }
}
