import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:8080/api/productos'; // URL del backend

  constructor(private readonly http: HttpClient) { }

  /**
   * Obtiene todos los productos desde el backend.
   * @returns Un Observable con un array de productos.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<{ _embedded: { productosList: Producto[] } }>(this.apiUrl).pipe(
      map(response => response._embedded.productosList) // Extrae la lista de productos
    );
  }

  /**
   * Obtiene un producto por su ID desde el backend.
   * @param id ID del producto.
   * @returns Un Observable con el producto encontrado.
   */
  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo producto en el backend.
   * @param producto Los datos del producto a crear.
   * @returns Un Observable con el producto creado.
   */
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  /**
   * Actualiza un producto existente en el backend.
   * @param id ID del producto a actualizar.
   * @param producto Los datos actualizados del producto.
   * @returns Un Observable con el producto actualizado.
   */
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  /**
   * Elimina un producto por su ID en el backend.
   * @param id ID del producto a eliminar.
   * @returns Un Observable que completa cuando se elimina el producto.
   */
  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProductos(term: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}?query=${term}`);
  }

}