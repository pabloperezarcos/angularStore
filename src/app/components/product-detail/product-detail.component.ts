import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  /** Producto actual */
  producto: Producto | undefined;

  /** Productos relacionados */
  relatedProductos: Producto[] = [];

  /** Indicador de carga */
  loading = true;

  /** Cantidad del producto a agregar al carrito */
  quantity: number = 1;
  

  /**
   * Constructor que inyecta las dependencias necesarias para obtener los detalles del producto y manejar el carrito.
   * @param route Servicio para obtener información de la ruta activa.
   * @param productService Servicio para gestionar productos.
   * @param carritoService Servicio para gestionar el carrito de compras.
   */
  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly carritoService: CarritoService
  ) { }

  

  /**
   * Inicializa el componente cargando el producto y los productos relacionados.
   */
  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id'); // Cambiado a `id` en lugar de `sku`
          this.loading = true;
          return this.productService.getProductoById(Number(id));
        })
      )
      .subscribe({
        next: (producto) => {
          this.producto = producto;
          this.loadRelatedProductos(); // Cargar productos relacionados
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar el producto:', err);
          this.loading = false;
        },
      });
  }

  /**
   * Carga productos relacionados desde el backend.
   */
  loadRelatedProductos(): void {
    this.productService.getProductos().subscribe({
      next: (productos) => {
        this.relatedProductos = productos
          .filter((p) => p.id !== this.producto?.id) // Excluir el producto actual
          .slice(0, 3); // Limitar a 3 productos
        console.log('Productos relacionados:', this.relatedProductos);
      },
      error: (err) => {
        console.error('Error al cargar productos relacionados:', err);
      },
    });
  }

  /**
   * Agrega el producto actual al carrito de compras.
   * Muestra una alerta al usuario confirmando la acción.
   */
  addToCarrito(): void {
    if (this.producto) {
      this.carritoService.addToCarrito(this.producto, this.quantity);
      alert('Producto agregado al carrito');
    }
  }
}
