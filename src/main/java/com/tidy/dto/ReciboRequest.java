    package com.tidy.dto;

    import lombok.Data;
    import java.math.BigDecimal;
    import java.time.LocalDate;

    @Data
    public class ReciboRequest {
        private String tipoServicio;
        private BigDecimal valor;
        private LocalDate fechaVencimiento;
        private String descripcion;
    }
