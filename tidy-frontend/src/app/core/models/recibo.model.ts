export type EstadoRecibo = 'PENDIENTE' | 'PAGADO';

export interface ReciboRequest {
  tipoServicio: string;
  valor: number;
  fechaVencimiento: string; // ISO date string
  descripcion?: string;
}

export interface ReciboResponse {
  id: number;
  tipoServicio: string;
  valor: number;
  fechaVencimiento: string;
  fechaPago: string | null;
  estado: EstadoRecibo;
  descripcion: string;
  mes: number;
  anio: number;
  fechaCreacion: string;
}
