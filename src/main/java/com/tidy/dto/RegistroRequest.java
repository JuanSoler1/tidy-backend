package com.tidy.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private String nombreCompleto;
    private String correo;
    private String contrasena;
}
