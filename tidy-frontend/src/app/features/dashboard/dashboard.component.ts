import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ReciboService } from '../../core/services/recibo.service';
import { ReciboResponse } from '../../core/models/recibo.model';
import { ReciboFormComponent } from '../recibos/recibo-form/recibo-form.component';
import { ReciboCardComponent } from '../recibos/recibo-card/recibo-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReciboFormComponent, ReciboCardComponent],
  template: `
    <div class="app">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">◈ <span>Tidy</span></div>
        <nav class="nav">
          <a class="nav-item active">
            <span class="nav-icon">⊞</span> Recibos
          </a>
          <a class="nav-item" (click)="showStats = !showStats" style="cursor:pointer">
            <span class="nav-icon">◎</span> Estadísticas
          </a>
        </nav>
        <div class="sidebar-bottom">
          <div class="user-info">
            <div class="avatar">{{ userInitial }}</div>
            <div class="user-name">{{ userName }}</div>
          </div>
          <button class="logout-btn" (click)="logout()">Salir →</button>
        </div>
      </aside>

      <!-- Main -->
      <main class="main">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <h2>{{ mesNombre }} {{ anioActual }}</h2>
            <div class="month-nav">
              <button (click)="cambiarMes(-1)">‹</button>
              <button (click)="hoy()">Hoy</button>
              <button (click)="cambiarMes(1)">›</button>
            </div>
          </div>
          <button class="btn-add" (click)="abrirModal()">+ Nuevo recibo</button>
        </header>

        <!-- Stats bar -->
        <div class="stats-bar" *ngIf="!loading">
          <div class="stat">
            <span class="stat-label">Total del mes</span>
            <span class="stat-value">${{ totalMes | number:'1.0-0' }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Pagados</span>
            <span class="stat-value green">{{ pagados.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Pendientes</span>
            <span class="stat-value orange">{{ pendientes.length }}</span>
          </div>
          <div class="stat progress-stat">
            <span class="stat-label">Progreso</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="progreso"></div>
            </div>
            <span class="stat-value small">{{ progreso | number:'1.0-0' }}%</span>
          </div>
        </div>

        <!-- Stats panel -->
        <div class="stats-panel" *ngIf="showStats && !loading">
          <h3>Distribución por servicio</h3>
          <div class="service-bars">
            <div *ngFor="let s of servicioStats" class="service-row">
              <span class="service-icon">{{ getIcon(s.tipo) }}</span>
              <span class="service-name">{{ s.tipo }}</span>
              <div class="service-bar">
                <div class="service-fill" [style.width.%]="s.porcentaje" [style.background]="s.color"></div>
              </div>
              <span class="service-amount">${{ s.total | number:'1.0-0' }}</span>
            </div>
          </div>
        </div>

        <!-- Recibos grid -->
        <div class="recibos-grid" *ngIf="!loading">
          <div *ngIf="recibos.length === 0" class="empty-state">
            <span class="empty-icon">◻</span>
            <p>No hay recibos para este mes</p>
            <button class="btn-add-inline" (click)="abrirModal()">Agregar el primero</button>
          </div>

          <div class="section" *ngIf="pendientes.length > 0">
            <h3 class="section-title"><span class="dot orange"></span>Pendientes ({{ pendientes.length }})</h3>
            <div class="cards">
              <app-recibo-card
                *ngFor="let r of pendientes"
                [recibo]="r"
                (onEstado)="cambiarEstado($event)"
                (onEditar)="editarRecibo($event)"
                (onEliminar)="eliminarRecibo($event)">
              </app-recibo-card>
            </div>
          </div>

          <div class="section" *ngIf="pagados.length > 0">
            <h3 class="section-title"><span class="dot green"></span>Pagados ({{ pagados.length }})</h3>
            <div class="cards">
              <app-recibo-card
                *ngFor="let r of pagados"
                [recibo]="r"
                (onEstado)="cambiarEstado($event)"
                (onEditar)="editarRecibo($event)"
                (onEliminar)="eliminarRecibo($event)">
              </app-recibo-card>
            </div>
          </div>
        </div>

        <div class="loading" *ngIf="loading">
          <div class="spinner-big"></div>
        </div>
      </main>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="modalOpen" (click)="cerrarModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <app-recibo-form
            [recibo]="reciboEditando"
            (onGuardar)="guardarRecibo($event)"
            (onCancelar)="cerrarModal()">
          </app-recibo-form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .app {
      display: flex; min-height: 100vh;
      background: #0a0a0f; color: #fff;
      font-family: 'DM Sans', sans-serif;
    }

    /* Sidebar */
    .sidebar {
      width: 220px; min-width: 220px;
      background: rgba(255,255,255,0.02);
      border-right: 1px solid rgba(255,255,255,0.06);
      display: flex; flex-direction: column;
      padding: 1.75rem 1.25rem;
    }
    .logo {
      font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800;
      color: #fff; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.5rem;
    }
    .logo span { letter-spacing: -0.03em; }
    .nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
    .nav-item {
      display: flex; align-items: center; gap: 0.6rem;
      padding: 0.65rem 0.85rem; border-radius: 10px;
      color: rgba(255,255,255,0.4); font-size: 0.9rem; font-weight: 500;
      transition: all 0.2s; text-decoration: none;
    }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
    .nav-item.active { background: rgba(99,102,241,0.15); color: #a5b4fc; }
    .nav-icon { font-size: 1rem; }
    .sidebar-bottom { margin-top: auto; }
    .user-info { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem; }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 600;
    }
    .user-name { font-size: 0.85rem; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .logout-btn {
      width: 100%; background: none; border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 0.5rem; color: rgba(255,255,255,0.4);
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer;
      transition: all 0.2s;
    }
    .logout-btn:hover { border-color: rgba(239,68,68,0.4); color: #fca5a5; }

    /* Main */
    .main { flex: 1; padding: 2rem; overflow-y: auto; }

    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .header-left h2 { font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 700; letter-spacing: -0.02em; }
    .month-nav { display: flex; gap: 0.4rem; }
    .month-nav button {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 0.35rem 0.65rem; color: rgba(255,255,255,0.6);
      font-family: 'DM Sans', sans-serif; font-size: 0.85rem; cursor: pointer;
      transition: all 0.2s;
    }
    .month-nav button:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .btn-add {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 12px; padding: 0.65rem 1.25rem;
      color: #fff; font-family: 'Syne', sans-serif; font-size: 0.9rem;
      font-weight: 600; cursor: pointer; transition: opacity 0.2s, transform 0.2s;
    }
    .btn-add:hover { opacity: 0.9; transform: translateY(-1px); }

    /* Stats bar */
    .stats-bar {
      display: flex; gap: 1rem; margin-bottom: 1.5rem;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px; padding: 1.25rem 1.5rem;
    }
    .stat { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
    .stat-value { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; }
    .stat-value.green { color: #34d399; }
    .stat-value.orange { color: #fb923c; }
    .stat-value.small { font-size: 0.9rem; }
    .progress-stat { gap: 0.4rem; }
    .progress-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #34d399); border-radius: 4px; transition: width 0.6s ease; }

    /* Stats panel */
    .stats-panel {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .stats-panel h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: rgba(255,255,255,0.7); }
    .service-bars { display: flex; flex-direction: column; gap: 0.75rem; }
    .service-row { display: flex; align-items: center; gap: 0.75rem; }
    .service-icon { font-size: 1.1rem; width: 24px; text-align: center; }
    .service-name { font-size: 0.85rem; color: rgba(255,255,255,0.6); width: 80px; }
    .service-bar { flex: 1; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
    .service-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
    .service-amount { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.7); width: 70px; text-align: right; }

    /* Sections */
    .section { margin-bottom: 1.5rem; }
    .section-title { display: flex; align-items: center; gap: 0.5rem; font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .dot.orange { background: #fb923c; }
    .dot.green { background: #34d399; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }

    /* Empty state */
    .empty-state { text-align: center; padding: 4rem 2rem; color: rgba(255,255,255,0.3); }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .empty-state p { font-size: 1rem; margin-bottom: 1.5rem; }
    .btn-add-inline {
      background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
      border-radius: 10px; padding: 0.65rem 1.25rem; color: #a5b4fc;
      font-family: 'DM Sans', sans-serif; font-size: 0.9rem; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-add-inline:hover { background: rgba(99,102,241,0.25); }

    /* Loading */
    .loading { display: flex; justify-content: center; align-items: center; height: 300px; }
    .spinner-big { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-content {
      animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class DashboardComponent implements OnInit {
  recibos: ReciboResponse[] = [];
  loading = false;
  modalOpen = false;
  showStats = false;
  reciboEditando: ReciboResponse | null = null;

  mesActual = new Date().getMonth() + 1;
  anioActual = new Date().getFullYear();

  meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  colores = ['#6366f1','#ec4899','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ef4444','#14b8a6'];

  constructor(private authService: AuthService, private reciboService: ReciboService) {}

  ngOnInit(): void { this.cargarRecibos(); }

  get mesNombre() { return this.meses[this.mesActual - 1]; }
  get userName() { return this.authService.getUser()?.nombreCompleto || ''; }
  get userInitial() { return this.userName.charAt(0).toUpperCase(); }
  get pendientes() { return this.recibos.filter(r => r.estado === 'PENDIENTE'); }
  get pagados() { return this.recibos.filter(r => r.estado === 'PAGADO'); }
  get totalMes() { return this.recibos.reduce((s, r) => s + r.valor, 0); }
  get progreso() {
    if (this.recibos.length === 0) return 0;
    return (this.pagados.length / this.recibos.length) * 100;
  }

  get servicioStats() {
    const map = new Map<string, number>();
    this.recibos.forEach(r => map.set(r.tipoServicio, (map.get(r.tipoServicio) || 0) + r.valor));
    const total = this.totalMes || 1;
    return Array.from(map.entries()).map(([tipo, t], i) => ({
      tipo, total: t, porcentaje: (t / total) * 100, color: this.colores[i % this.colores.length]
    }));
  }

  getIcon(tipo: string): string {
    const icons: Record<string, string> = { 'Agua': '💧', 'Luz': '⚡', 'Internet': '📡', 'Gas': '🔥', 'Arriendo': '🏠', 'Teléfono': '📱' };
    return icons[tipo] || '🧾';
  }

  cargarRecibos(): void {
    this.loading = true;
    this.reciboService.listarPorMes(this.mesActual, this.anioActual).subscribe({
      next: (data) => { this.recibos = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cambiarMes(delta: number): void {
    const d = new Date(this.anioActual, this.mesActual - 1 + delta, 1);
    this.mesActual = d.getMonth() + 1;
    this.anioActual = d.getFullYear();
    this.cargarRecibos();
  }

  hoy(): void {
    this.mesActual = new Date().getMonth() + 1;
    this.anioActual = new Date().getFullYear();
    this.cargarRecibos();
  }

  abrirModal(): void { this.reciboEditando = null; this.modalOpen = true; }
  cerrarModal(): void { this.modalOpen = false; this.reciboEditando = null; }

  editarRecibo(recibo: ReciboResponse): void { this.reciboEditando = recibo; this.modalOpen = true; }

  guardarRecibo(data: any): void {
    const req = this.reciboEditando
      ? this.reciboService.actualizar(this.reciboEditando.id, data)
      : this.reciboService.crear(data);

    req.subscribe({ next: () => { this.cerrarModal(); this.cargarRecibos(); } });
  }

  cambiarEstado(id: number): void {
    this.reciboService.cambiarEstado(id).subscribe({ next: () => this.cargarRecibos() });
  }

  eliminarRecibo(id: number): void {
    if (confirm('¿Eliminar este recibo?')) {
      this.reciboService.eliminar(id).subscribe({ next: () => this.cargarRecibos() });
    }
  }

  logout(): void { this.authService.logout(); }
}
