import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/producto.model';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/**
 * HomeComponent maneja la visualización de la página principal, incluyendo una lista de productos destacados y testimonios.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /** Lista de productos */
  productos: Product[] = [];

  /** Indicador de carga */
  loading = true;

  /**
   * Constructor que inyecta el servicio de productos y el cliente HTTP.
   * @param productService Servicio que proporciona operaciones relacionadas con los productos.
   * @param http Cliente HTTP para solicitudes a servicios externos.
   */
  constructor(private productService: ProductService, private http: HttpClient) { }

  /**
   * Inicializa el componente cargando la lista de productos y testimonios.
   */
  ngOnInit() {
    this.loadProductosFromJson(); // Cambiado para cargar productos desde JSON
  }


  /**
   * Carga la lista de productos desde el JSON.
   */
  private loadProductosFromJson(): void {
    this.productService.getProductsFromJson().subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data); // Agregar este log
        this.productos = data.slice(0, 3);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error obteniendo productos:', err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa')
    });
  }


}
