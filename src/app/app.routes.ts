import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AdminUsuariosComponent } from './components/admin-usuarios/admin-usuarios.component';
import { AdminProductosComponent } from './components/admin-productos/admin-productos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'admin/usuarios', component: AdminUsuariosComponent },
  { path: 'admin/productos', component: AdminProductosComponent },
  { path: 'mi-perfil', component: PerfilComponent },
  { path: 'checkout', component: CheckoutComponent }

];