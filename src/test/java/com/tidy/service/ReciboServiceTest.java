package com.tidy.service;

import com.tidy.dto.ReciboRequest;
import com.tidy.dto.ReciboResponse;
import com.tidy.model.EstadoRecibo;
import com.tidy.model.Recibo;
import com.tidy.model.Usuario;
import com.tidy.repository.ReciboRepository;
import com.tidy.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReciboServiceTest {

    @Mock private ReciboRepository reciboRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @InjectMocks private ReciboService reciboService;

    private Usuario usuario;
    private Recibo recibo;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setCorreo("juan@tidy.com");

        recibo = new Recibo();
        recibo.setId(1L);
        recibo.setTipoServicio("Luz");
        recibo.setValor(new BigDecimal("85000"));
        recibo.setFechaVencimiento(LocalDate.of(2026, 4, 25));
        recibo.setEstado(EstadoRecibo.PENDIENTE);
        recibo.setMes(4);
        recibo.setAnio(2026);
        recibo.setUsuario(usuario);
    }

    @Test
    void crear_recibo_exitoso() {
        ReciboRequest request = new ReciboRequest();
        request.setTipoServicio("Luz");
        request.setValor(new BigDecimal("85000"));
        request.setFechaVencimiento(LocalDate.of(2026, 4, 25));

        when(usuarioRepository.findByCorreo("juan@tidy.com")).thenReturn(Optional.of(usuario));
        when(reciboRepository.save(any(Recibo.class))).thenReturn(recibo);

        ReciboResponse response = reciboService.crear(request, "juan@tidy.com");

        assertNotNull(response);
        assertEquals("Luz", response.getTipoServicio());
        assertEquals(EstadoRecibo.PENDIENTE, response.getEstado());
        verify(reciboRepository, times(1)).save(any(Recibo.class));
    }

    @Test
    void listar_por_mes_exitoso() {
        when(usuarioRepository.findByCorreo("juan@tidy.com")).thenReturn(Optional.of(usuario));
        when(reciboRepository.findByUsuarioIdAndMesAndAnio(1L, 4, 2026)).thenReturn(List.of(recibo));

        List<ReciboResponse> recibos = reciboService.listarPorMes(4, 2026, "juan@tidy.com");

        assertNotNull(recibos);
        assertEquals(1, recibos.size());
        assertEquals("Luz", recibos.get(0).getTipoServicio());
    }

    @Test
    void cambiar_estado_de_pendiente_a_pagado() {
        when(usuarioRepository.findByCorreo("juan@tidy.com")).thenReturn(Optional.of(usuario));
        when(reciboRepository.findByIdAndUsuarioId(1L, 1L)).thenReturn(Optional.of(recibo));
        when(reciboRepository.save(any(Recibo.class))).thenReturn(recibo);

        ReciboResponse response = reciboService.cambiarEstado(1L, "juan@tidy.com");

        assertNotNull(response);
        assertEquals(EstadoRecibo.PAGADO, response.getEstado());
    }

    @Test
    void eliminar_recibo_exitoso() {
        when(usuarioRepository.findByCorreo("juan@tidy.com")).thenReturn(Optional.of(usuario));
        when(reciboRepository.findByIdAndUsuarioId(1L, 1L)).thenReturn(Optional.of(recibo));

        assertDoesNotThrow(() -> reciboService.eliminar(1L, "juan@tidy.com"));
        verify(reciboRepository, times(1)).delete(recibo);
    }
}
