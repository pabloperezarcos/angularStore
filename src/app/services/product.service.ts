import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private jsonUrl = 'assets/data/productos.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los productos desde el archivo JSON.
   */
  getProductsFromJson(): Observable<Product[]> {
    return this.http.get<Product[]>(this.jsonUrl);
  }
}
