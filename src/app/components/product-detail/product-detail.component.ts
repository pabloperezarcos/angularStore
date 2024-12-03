import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

/**
 * ProductoDetailComponent maneja la visualización de los detalles de un productoo individual,
 * incluyendo productoos relacionados y la opción de agregar al carrito.
 */
@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  /** Productoo actual */
  producto: Producto | undefined;

  /** Productoos relacionados */
  relatedProductos: Producto[] = [];

  /** Indicador de carga */
  loading = true;

  /** Cantidad del productoo a agregar al carrito */
  quantity: number = 1;

  /**
   * Constructor que inyecta las dependencias necesarias para obtener los detalles del productoo y manejar el carrito.
   * @param route Servicio para obtener información de la ruta activa.
   * @param productoService Servicio para gestionar productoos.
   * @param carritoService Servicio para gestionar el carrito de compras.
   */
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private carritoService: CarritoService
  ) { }

  /**
   * Inicializa el componente cargando el productoo y los productoos relacionados basados en el SKU de la ruta.
   */
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const sku = params.get('sku');
        this.loading = true;
        return this.productService.getProductsFromJson(); // Cambiado para cargar productoos desde JSON
      })
    ).subscribe({
      next: (data) => {
        const sku = this.route.snapshot.paramMap.get('sku');
        this.producto = data.find(p => p.sku === sku);
        this.relatedProductos = data.filter(p => p.sku !== sku).slice(0, 3);
        console.log('Productoo actual:', this.producto);
        console.log('Productoos relacionados:', this.relatedProductos);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productoo completa')
    });
  }

  /**
   * Agrega el productoo actual al carrito de compras.
   * Muestra una alerta al usuario confirmando la acción.
   */
  addToCarrito(): void {
    if (this.producto) {
      this.carritoService.addToCarrito(this.producto, this.quantity);
      alert('Productoo agregado al carrito');
    }
  }
}
