import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  productos: Producto[] = [];
  loading = true;

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.loadProductosFromBackend();
  }

  private loadProductosFromBackend(): void {
    this.productService.getProductos().subscribe({
      next: (data) => {
        console.log('Productos obtenidos:', data);
        this.productos = data.slice(0, 3); // Obtén los primeros 3 productos como destacados
        this.loading = false;
      },
      error: (err) => {
        console.error('Error obteniendo productos:', err);
        this.loading = false;
      },
      complete: () => console.log('Carga de productos completa'),
    });
  }

  navigateToCatalog(): void {
    this.router.navigate(['/catalogo']);
  }

}
