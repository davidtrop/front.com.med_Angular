import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = {
    login: '',
    senha: ''
  };

  isLoading = signal<boolean>(false);
  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Usuário registrado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error?.message || 'Erro ao registrar usuário. Tente novamente.');
      }
    });
  }
}
