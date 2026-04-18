package com.tidy.dto;

import com.tidy.model.EstadoRecibo;
import com.tidy.model.Recibo;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReciboResponse {
    private Long id;
    private String tipoServicio;
    private BigDecimal valor;
    private LocalDate fechaVencimiento;
    private LocalDate fechaPago;
    private EstadoRecibo estado;
    private String descripcion;
    private Integer mes;
    private Integer anio;
    private LocalDateTime fechaCreacion;

    public static ReciboResponse from(Recibo recibo) {
        ReciboResponse dto = new ReciboResponse();
        dto.setId(recibo.getId());
        dto.setTipoServicio(recibo.getTipoServicio());
        dto.setValor(recibo.getValor());
        dto.setFechaVencimiento(recibo.getFechaVencimiento());
        dto.setFechaPago(recibo.getFechaPago());
        dto.setEstado(recibo.getEstado());
        dto.setDescripcion(recibo.getDescripcion());
        dto.setMes(recibo.getMes());
        dto.setAnio(recibo.getAnio());
        dto.setFechaCreacion(recibo.getFechaCreacion());
        return dto;
    }
}
