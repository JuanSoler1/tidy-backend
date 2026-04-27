import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-bg">
      <div class="auth-card">
        <div class="brand">
          <span class="brand-icon">◈</span>
          <h1>Tidy</h1>
          <p>Gestiona tus recibos sin estrés</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field">
            <label>Correo electrónico</label>
            <input type="email" [(ngModel)]="correo" name="correo"
                   placeholder="tu@correo.com" required autocomplete="email" />
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input [type]="showPass ? 'text' : 'password'" [(ngModel)]="contrasena"
                   name="contrasena" placeholder="••••••••" required autocomplete="current-password" />
            <button type="button" class="toggle-pass" (click)="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>

          <div class="error" *ngIf="error">{{ error }}</div>

          <button type="submit" class="btn-primary" [disabled]="loading">
            <span *ngIf="!loading">Iniciar sesión</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>
        </form>

        <p class="auth-link">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .auth-bg {
      min-height: 100vh;
      background: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background-image:
        radial-gradient(ellipse 60% 50% at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 60%);
    }

    .auth-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 3rem 2.5rem;
      width: 100%;
      max-width: 420px;
      backdrop-filter: blur(20px);
      animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .brand { text-align: center; margin-bottom: 2.5rem; }
    .brand-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
    .brand h1 {
      font-family: 'Syne', sans-serif;
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin: 0;
      letter-spacing: -0.03em;
    }
    .brand p {
      font-family: 'DM Sans', sans-serif;
      color: rgba(255,255,255,0.4);
      font-size: 0.9rem;
      margin: 0.25rem 0 0;
    }

    .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

    .field { position: relative; display: flex; flex-direction: column; gap: 0.4rem; }
    label {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    input {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 0.85rem 1rem;
      color: #fff;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    input:focus {
      border-color: rgba(99, 102, 241, 0.6);
      background: rgba(99, 102, 241, 0.05);
    }
    input::placeholder { color: rgba(255,255,255,0.2); }

    .toggle-pass {
      position: absolute; right: 0.75rem; bottom: 0.75rem;
      background: none; border: none; cursor: pointer; font-size: 1rem;
    }

    .error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 12px;
      padding: 0.9rem;
      color: #fff;
      font-family: 'Syne', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      margin-top: 0.5rem;
      display: flex; align-items: center; justify-content: center; min-height: 50px;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner {
      width: 20px; height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-link {
      text-align: center;
      margin-top: 1.5rem;
      font-family: 'DM Sans', sans-serif;
      color: rgba(255,255,255,0.35);
      font-size: 0.9rem;
    }
    .auth-link a { color: #818cf8; text-decoration: none; font-weight: 500; }
    .auth-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  loading = false;
  error = '';
  showPass = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.correo || !this.contrasena) return;
    this.loading = true;
    this.error = '';

    this.authService.login({ correo: this.correo, contrasena: this.contrasena }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.status === 401 ? 'Correo o contraseña incorrectos' : 'Error al iniciar sesión. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}
