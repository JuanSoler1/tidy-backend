import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReciboRequest, ReciboResponse } from '../../../core/models/recibo.model';

@Component({
  selector: 'app-recibo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-card">
      <div class="form-header">
        <h2>{{ recibo ? 'Editar recibo' : 'Nuevo recibo' }}</h2>
        <button class="close-btn" (click)="onCancelar.emit()">✕</button>
      </div>

      <form (ngSubmit)="onSubmit()" class="form">
        <div class="field">
          <label>Tipo de servicio</label>
          <select [(ngModel)]="data.tipoServicio" name="tipo" required>
            <option value="" disabled>Selecciona un servicio</option>
            <option *ngFor="let s of servicios" [value]="s">{{ s }}</option>
          </select>
        </div>

        <div class="field">
          <label>Valor (COP $)</label>
          <input type="number" [(ngModel)]="data.valor" name="valor"
                 placeholder="0" min="0" required />
        </div>

        <div class="field">
          <label>Fecha de vencimiento</label>
          <input type="date" [(ngModel)]="data.fechaVencimiento" name="fecha" required />
        </div>

        <div class="field">
          <label>Descripción <span class="optional">(opcional)</span></label>
          <textarea [(ngModel)]="data.descripcion" name="descripcion"
                    placeholder="Ej: Mes de enero, pago anticipado..." rows="3"></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" (click)="onCancelar.emit()">Cancelar</button>
          <button type="submit" class="btn-save" [disabled]="!data.tipoServicio || !data.valor || !data.fechaVencimiento">
            {{ recibo ? 'Guardar cambios' : 'Crear recibo' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    .form-card {
      background: #13131a; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px; padding: 2rem; width: 420px; max-width: 95vw;
      font-family: 'DM Sans', sans-serif;
    }

    .form-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; }
    .form-header h2 { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 700; color: #fff; }
    .close-btn {
      width: 32px; height: 32px; border-radius: 8px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); cursor: pointer; font-size: 0.85rem;
      transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .form { display: flex; flex-direction: column; gap: 1.1rem; }

    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    label {
      font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.45);
      text-transform: uppercase; letter-spacing: 0.07em;
    }
    .optional { font-weight: 400; opacity: 0.6; text-transform: none; letter-spacing: 0; }

    input, select, textarea {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; padding: 0.8rem 1rem; color: #fff;
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none;
      transition: border-color 0.2s, background 0.2s;
    }
    input:focus, select:focus, textarea:focus {
      border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.05);
    }
    input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
    select option { background: #13131a; }
    textarea { resize: vertical; min-height: 80px; }

    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }

    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .btn-cancel {
      flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px; padding: 0.8rem; color: rgba(255,255,255,0.5);
      font-family: 'DM Sans', sans-serif; font-size: 0.95rem; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); }
    .btn-save {
      flex: 2; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 12px; padding: 0.8rem; color: #fff;
      font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 600;
      cursor: pointer; transition: opacity 0.2s, transform 0.2s;
    }
    .btn-save:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class ReciboFormComponent implements OnInit {
  @Input() recibo: ReciboResponse | null = null;
  @Output() onGuardar = new EventEmitter<ReciboRequest>();
  @Output() onCancelar = new EventEmitter<void>();

  servicios = ['Agua', 'Luz', 'Internet', 'Gas', 'Arriendo', 'Teléfono', 'Netflix', 'Spotify', 'Otro'];

  data: Partial<ReciboRequest> = {
    tipoServicio: '',
    valor: undefined,
    fechaVencimiento: '',
    descripcion: ''
  };

  ngOnInit(): void {
    if (this.recibo) {
      this.data = {
        tipoServicio: this.recibo.tipoServicio,
        valor: this.recibo.valor,
        fechaVencimiento: this.recibo.fechaVencimiento,
        descripcion: this.recibo.descripcion
      };
    }
  }

  onSubmit(): void {
    if (!this.data.tipoServicio || !this.data.valor || !this.data.fechaVencimiento) return;
    this.onGuardar.emit(this.data as ReciboRequest);
  }
}
