import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductosComponent } from './admin-productos.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { Producto } from '../../models/producto.model';
import { of, throwError } from 'rxjs';

describe('AdminProductosComponent', () => {
  let component: AdminProductosComponent;
  let fixture: ComponentFixture<AdminProductosComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProductos: Producto[] = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción 1', precio: 100, imagen: 'img1.jpg' },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción 2', precio: 200, imagen: 'img2.jpg' },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductService', ['getProductos', 'crearProducto', 'actualizarProducto', 'eliminarProducto']);

    await TestBed.configureTestingModule({
      imports: [
        AdminProductosComponent,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: ProductService, useValue: spy },
      ],
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    productServiceSpy.getProductos.and.returnValue(of(mockProductos));

    fixture = TestBed.createComponent(AdminProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar productos al inicializar', () => {
    expect(productServiceSpy.getProductos).toHaveBeenCalled();
    expect(component.productos).toEqual(mockProductos);
    expect(component.filteredProductos).toEqual(mockProductos);
    expect(component.loading).toBeFalse();
  });

  it('debería manejar errores al cargar productos', () => {
    // Configurar el servicio para lanzar un error
    productServiceSpy.getProductos.and.returnValue(throwError(() => new Error('Error al cargar productos')));

    // Restablecer el estado de productos antes de llamar al método
    component.productos = [];
    component.filteredProductos = [];

    // Llamar a loadProductos
    component.loadProductos();

    // Verificar que productos y filteredProductos estén vacíos
    expect(component.productos).toEqual([]);
    expect(component.filteredProductos).toEqual([]);
    expect(component.loading).toBeFalse();
  });



  it('debería filtrar productos correctamente', () => {
    component.searchQuery = 'Producto 1';
    component.filterProductos();
    expect(component.filteredProductos).toEqual([mockProductos[0]]);
  });

  it('debería seleccionar un producto para edición', () => {
    component.selectProduct(mockProductos[0]);
    expect(component.selectedProduct).toEqual(mockProductos[0]);
    expect(component.isEditing).toBeTrue();
    expect(component.isAdding).toBeFalse();
  });

  it('debería preparar un nuevo producto para agregar', () => {
    component.crearProducto();
    expect(component.selectedProduct).toEqual({ id: 0, nombre: '', descripcion: '', precio: 0, imagen: '' });
    expect(component.isEditing).toBeTrue();
    expect(component.isAdding).toBeTrue();
  });

  it('debería cancelar la edición o adición', () => {
    component.cancelEdit();
    expect(component.selectedProduct).toBeNull();
    expect(component.isEditing).toBeFalse();
    expect(component.isAdding).toBeFalse();
  });

  it('debería crear un nuevo producto', () => {
    const newProduct: Producto = { id: 0, nombre: 'Nuevo Producto', descripcion: 'Nuevo Desc', precio: 150, imagen: 'img.jpg' };
    component.selectedProduct = newProduct;
    component.isAdding = true;

    productServiceSpy.crearProducto.and.returnValue(of(newProduct));
    component.actualizarProducto();

    expect(productServiceSpy.crearProducto).toHaveBeenCalledWith(newProduct);
    expect(component.isEditing).toBeFalse();
    expect(component.isAdding).toBeFalse();
  });

  it('debería manejar errores al crear un producto', () => {
    const newProduct: Producto = { id: 0, nombre: 'Nuevo Producto', descripcion: 'Nuevo Desc', precio: 150, imagen: 'img.jpg' };
    component.selectedProduct = newProduct;
    component.isAdding = true;

    productServiceSpy.crearProducto.and.returnValue(throwError(() => new Error('Error al crear producto')));
    component.actualizarProducto();

    expect(productServiceSpy.crearProducto).toHaveBeenCalledWith(newProduct);
    expect(component.isAdding).toBeTrue();
    expect(component.isEditing).toBeTrue();
  });

  it('debería actualizar un producto existente', () => {
    const updatedProduct: Producto = { ...mockProductos[0], precio: 120 };
    component.selectedProduct = updatedProduct;

    productServiceSpy.actualizarProducto.and.returnValue(of(updatedProduct));
    component.actualizarProducto();

    expect(productServiceSpy.actualizarProducto).toHaveBeenCalledWith(updatedProduct.id, updatedProduct);
    expect(component.isEditing).toBeFalse();
  });

  it('debería manejar errores al actualizar un producto', () => {
    const updatedProduct: Producto = { ...mockProductos[0], precio: 120 };
    component.selectedProduct = updatedProduct;

    productServiceSpy.actualizarProducto.and.returnValue(throwError(() => new Error('Error al actualizar producto')));
    component.actualizarProducto();

    expect(productServiceSpy.actualizarProducto).toHaveBeenCalledWith(updatedProduct.id, updatedProduct);
    expect(component.isEditing).toBeTrue();
  });

  it('debería eliminar un producto', () => {
    const productToDelete = mockProductos[0];

    productServiceSpy.eliminarProducto.and.returnValue(of());
    component.eliminarProducto(productToDelete);

    expect(productServiceSpy.eliminarProducto).toHaveBeenCalledWith(productToDelete.id);
  });

  it('debería manejar errores al eliminar un producto', () => {
    const productToDelete = mockProductos[0];

    productServiceSpy.eliminarProducto.and.returnValue(throwError(() => new Error('Error al eliminar producto')));
    component.eliminarProducto(productToDelete);

    expect(productServiceSpy.eliminarProducto).toHaveBeenCalledWith(productToDelete.id);
  });
});
