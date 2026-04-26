import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReciboResponse } from '../../../core/models/recibo.model';

@Component({
  selector: 'app-recibo-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.pagado]="recibo.estado === 'PAGADO'">
      <div class="card-header">
        <div class="service-badge">
          <span class="icon">{{ getIcon() }}</span>
          <span class="tipo">{{ recibo.tipoServicio }}</span>
        </div>
        <div class="estado-badge" [class.pagado]="recibo.estado === 'PAGADO'">
          {{ recibo.estado === 'PAGADO' ? '✓ Pagado' : '○ Pendiente' }}
        </div>
      </div>

      <div class="valor">${{ recibo.valor | number:'1.0-0' }}</div>

      <div class="meta">
        <span>Vence: {{ recibo.fechaVencimiento | date:'dd MMM':'':'es' }}</span>
        <span *ngIf="recibo.fechaPago">Pagado: {{ recibo.fechaPago | date:'dd MMM':'':'es' }}</span>
      </div>

      <p class="descripcion" *ngIf="recibo.descripcion">{{ recibo.descripcion }}</p>

      <div class="actions">
        <button class="btn-estado" [class.pagado]="recibo.estado === 'PAGADO'" (click)="onEstado.emit(recibo.id)">
          {{ recibo.estado === 'PAGADO' ? 'Marcar pendiente' : 'Marcar pagado' }}
        </button>
        <div class="btn-group">
          <button class="btn-icon" title="Editar" (click)="onEditar.emit(recibo)">✎</button>
          <button class="btn-icon danger" title="Eliminar" (click)="onEliminar.emit(recibo.id)">✕</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px; padding: 1.25rem;
      display: flex; flex-direction: column; gap: 0.85rem;
      transition: border-color 0.2s, transform 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    .card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
    .card.pagado { border-color: rgba(52,211,153,0.2); background: rgba(52,211,153,0.03); }

    .card-header { display: flex; align-items: center; justify-content: space-between; }
    .service-badge { display: flex; align-items: center; gap: 0.5rem; }
    .icon { font-size: 1.3rem; }
    .tipo { font-weight: 600; color: rgba(255,255,255,0.85); font-size: 0.95rem; }

    .estado-badge {
      font-size: 0.75rem; font-weight: 500; padding: 0.25rem 0.65rem;
      border-radius: 20px; background: rgba(251,146,60,0.15); color: #fb923c;
      border: 1px solid rgba(251,146,60,0.3);
    }
    .estado-badge.pagado { background: rgba(52,211,153,0.15); color: #34d399; border-color: rgba(52,211,153,0.3); }

    .valor { font-family: 'Syne', sans-serif; font-size: 1.75rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }

    .meta { display: flex; gap: 1rem; font-size: 0.8rem; color: rgba(255,255,255,0.35); }

    .descripcion { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.4; }

    .actions { display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem; }
    .btn-estado {
      font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500;
      padding: 0.4rem 0.85rem; border-radius: 8px; cursor: pointer;
      background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #a5b4fc;
      transition: all 0.2s;
    }
    .btn-estado:hover { background: rgba(99,102,241,0.25); }
    .btn-estado.pagado { background: rgba(251,146,60,0.15); border-color: rgba(251,146,60,0.3); color: #fb923c; }
    .btn-estado.pagado:hover { background: rgba(251,146,60,0.25); }

    .btn-group { display: flex; gap: 0.4rem; }
    .btn-icon {
      width: 30px; height: 30px; border-radius: 8px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); cursor: pointer; font-size: 0.85rem;
      transition: all 0.2s; display: flex; align-items: center; justify-content: center;
    }
    .btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .btn-icon.danger:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #fca5a5; }
  `]
})
export class ReciboCardComponent {
  @Input() recibo!: ReciboResponse;
  @Output() onEstado = new EventEmitter<number>();
  @Output() onEditar = new EventEmitter<ReciboResponse>();
  @Output() onEliminar = new EventEmitter<number>();

  getIcon(): string {
    const icons: Record<string, string> = {
      'Agua': '💧', 'Luz': '⚡', 'Internet': '📡',
      'Gas': '🔥', 'Arriendo': '🏠', 'Teléfono': '📱',
      'Netflix': '🎬', 'Spotify': '🎵'
    };
    return icons[this.recibo.tipoServicio] || '🧾';
  }
}
