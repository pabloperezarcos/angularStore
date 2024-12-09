import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it('debería autenticar al usuario y redirigir al dashboard en un login exitoso', () => {
    authService.login.and.returnValue(of(true));

    component.username = 'testuser';
    component.password = 'password';
    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'password');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loginFailed).toBeFalse();
  });

  it('debería mostrar un mensaje de error en caso de login fallido', () => {
    authService.login.and.returnValue(of(false));

    component.username = 'wronguser';
    component.password = 'wrongpassword';
    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.loginFailed).toBeTrue();
  });
});
