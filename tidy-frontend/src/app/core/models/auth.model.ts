export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegistroRequest {
  nombreCompleto: string;
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  nombreCompleto: string;
  correo: string;
}
