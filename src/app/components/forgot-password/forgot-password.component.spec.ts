import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerMock }]
    }).compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.resetForm).toBeTruthy();
    expect(component.resetForm.controls['email']).toBeTruthy();
  });

  it('debería mostrar error si el campo email está vacío', () => {
    // Configurar el valor del control como vacío y marcarlo como tocado
    const emailControl = component.f['email'];
    emailControl.setValue('');
    emailControl.markAsTouched();

    // Detectar cambios en el DOM
    fixture.detectChanges();

    // Buscar el elemento de error
    const errorElement = fixture.debugElement.query(By.css('.text-danger')); // Cambiar el selector según la clase utilizada

    // Validaciones
    expect(emailControl.invalid).toBeTrue(); // El control debe ser inválido
    expect(errorElement).not.toBeNull(); // El mensaje de error debe aparecer en el DOM
    expect(errorElement.nativeElement.textContent).toContain('El correo electrónico es obligatorio.'); // Verificar el texto del mensaje
  });

  it('debería mostrar error si el email no tiene un formato válido', () => {
    // Configurar un email inválido y marcar el control como tocado
    const emailControl = component.f['email'];
    emailControl.setValue('email_invalido');
    emailControl.markAsTouched();

    // Detectar cambios en el DOM
    fixture.detectChanges();

    // Buscar el elemento de error
    const errorElement = fixture.debugElement.query(By.css('.text-danger')); // Cambiar el selector según la clase utilizada

    // Validaciones
    expect(emailControl.invalid).toBeTrue(); // El control debe ser inválido
    expect(errorElement).not.toBeNull(); // El mensaje de error debe aparecer en el DOM
    expect(errorElement.nativeElement.textContent).toContain('Ingrese un correo electrónico válido.'); // Verificar el texto del mensaje
  });

  it('debería enviar el formulario si es válido y mostrar un mensaje de éxito', fakeAsync(() => {
    const emailControl = component.f['email'];
    emailControl.setValue('usuario@correo.com');
    component.onSubmit();

    tick(5000); // Simula 5 segundos
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('no debería enviar el formulario si es inválido', () => {
    const emailControl = component.f['email'];
    emailControl.setValue('');
    component.onSubmit();

    expect(component.resetForm.invalid).toBeTrue();
    expect(component.message).toBe('');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
