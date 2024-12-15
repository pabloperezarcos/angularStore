import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * ForgotPasswordComponent permite a los usuarios solicitar una nueva contraseña si olvidaron la actual.
 * Utiliza formularios reactivos para validar la entrada del usuario y enrutamiento para navegar entre vistas.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  message: string = '';

  constructor(private readonly formBuilder: FormBuilder, private readonly router: Router) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Getter para facilitar el acceso a los controles del formulario.
   * @returns Las propiedades de los controles del formulario.
   */
  get f() { return this.resetForm.controls; }

  /**
   * Maneja el envío del formulario de restablecimiento de contraseña.
   * Si el formulario es válido, envía una contraseña temporal y redirige al usuario.
   */
  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.message = 'Su nueva contraseña temporal ha sido enviada a su correo';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000);
  }
}
