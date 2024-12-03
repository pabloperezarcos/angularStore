import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../models/producto.model';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private jsonUrl = 'assets/data/productos.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los productos desde el archivo JSON.
   */
  getProductsFromJson(): Observable<Producto[]> {
    return this.http.get<{ productos: Producto[] }>(this.jsonUrl).pipe(
      tap(response => console.log('JSON response:', response)), // Verificar respuesta
      map(response => response.productos),
      tap(products => console.log('Mapped products:', products)) // Verificar productos mapeados
    );
  }


  /**
   * Agrega un nuevo producto a Firestore.
   * @param product El producto a agregar.
   * @returns Un Observable que completa cuando se agrega el producto.
   */
  /* addProduct(product: Producto): Observable<void> { */
  /*     const productsRef = collection(this.firestore, 'productos');
      const newDocRef = doc(productsRef);
      return from(setDoc(newDocRef, { ...product })) as Observable<void>; */
  /* } */

  addProducto(arg0: Producto) {
    throw new Error('Method not implemented.');
  }


  /**
   * Actualiza un producto existente en Firestore.
   * @param id El ID del producto a actualizar.
   * @param product El producto actualizado.
   * @returns Un Observable que completa cuando se actualiza el producto.
   */
  /*   updateProduct(id: string, product: Producto): Observable<void> { */
  /*     const productDoc = doc(this.firestore, `productos/${id}`);
      return from(updateDoc(productDoc, { ...product })) as Observable<void>; */
  /*   } */

  updateProducto(productId: string, arg1: Producto) {
    throw new Error('Method not implemented.');
  }

  /**
   * Elimina un producto existente de Firestore.
   * @param id El ID del producto a eliminar.
   * @returns Un Observable que completa cuando se elimina el producto.
   */
  /*   deleteProduct(id: string): Observable<void> {
      const productDoc = doc(this.firestore, `productos/${id}`);
      return from(deleteDoc(productDoc)) as Observable<void>;
    } */

  deleteProducto(productId: string) {
    throw new Error('Method not implemented.');
  }

  /**
   * Carga los productos desde un archivo JSON externo a Firestore.
   * @returns Un Observable que completa cuando se cargan todos los productos.
   */
  /*   loadProductsToFirestore(): Observable<void> {
      return this.getProductsFromJson().pipe(
        map(products => {
          products.forEach(product => {
            const productsRef = collection(this.firestore, 'productos');
            const newDocRef = doc(productsRef);
            setDoc(newDocRef, { ...product });
          });
          return;
        })
      );
    }
   */
  /**
   * Busca productos en Firestore que coincidan con el término de búsqueda.
   * @param queryStr El término de búsqueda.
   * @returns Un Observable que emite un array de productos que coinciden con la búsqueda.
   */
  /*   searchProducts(queryStr: string): Observable<Producto[]> {
      return this.getProducts().pipe(
        map(products => products.filter(producto =>
          producto.nombre.toLowerCase().includes(queryStr.toLowerCase()) ||
          producto.descripcion.toLowerCase().includes(queryStr.toLowerCase())
        ))
      );
    } */
  /* } */


}