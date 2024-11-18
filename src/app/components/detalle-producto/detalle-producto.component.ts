import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
  
})
export class DetalleProductoComponent {
  producto?: { nombre: string; descripcion: string; precio: number; stock: number };

  constructor() {
    this.producto = {
      nombre: 'Ejemplo Producto',
      descripcion: 'Descripción del producto de ejemplo',
      precio: 100,
      stock: 20
    };
  }
}
