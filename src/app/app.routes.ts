import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'producto/:sku', component: ProductDetailComponent },
  { path: 'carrito', component: CarritoComponent }
];
