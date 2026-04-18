package com.tidy.service;

import com.tidy.dto.ReciboRequest;
import com.tidy.dto.ReciboResponse;
import com.tidy.model.EstadoRecibo;
import com.tidy.model.Recibo;
import com.tidy.model.Usuario;
import com.tidy.repository.ReciboRepository;
import com.tidy.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReciboService {

    private final ReciboRepository reciboRepository;
    private final UsuarioRepository usuarioRepository;

    public ReciboService(ReciboRepository reciboRepository, UsuarioRepository usuarioRepository) {
        this.reciboRepository = reciboRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public ReciboResponse crear(ReciboRequest request, String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Recibo recibo = new Recibo();
        recibo.setTipoServicio(request.getTipoServicio());
        recibo.setValor(request.getValor());
        recibo.setFechaVencimiento(request.getFechaVencimiento());
        recibo.setDescripcion(request.getDescripcion());
        recibo.setEstado(EstadoRecibo.PENDIENTE);
        recibo.setUsuario(usuario);

        return ReciboResponse.from(reciboRepository.save(recibo));
    }

    public List<ReciboResponse> listarPorMes(Integer mes, Integer anio, String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return reciboRepository.findByUsuarioIdAndMesAndAnio(usuario.getId(), mes, anio)
                .stream()
                .map(ReciboResponse::from)
                .collect(Collectors.toList());
    }

    public ReciboResponse actualizar(Long id, ReciboRequest request, String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Recibo recibo = reciboRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new RuntimeException("Recibo no encontrado"));

        recibo.setTipoServicio(request.getTipoServicio());
        recibo.setValor(request.getValor());
        recibo.setFechaVencimiento(request.getFechaVencimiento());
        recibo.setDescripcion(request.getDescripcion());

        return ReciboResponse.from(reciboRepository.save(recibo));
    }

    public void eliminar(Long id, String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Recibo recibo = reciboRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new RuntimeException("Recibo no encontrado"));

        reciboRepository.delete(recibo);
    }

    public ReciboResponse cambiarEstado(Long id, String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Recibo recibo = reciboRepository.findByIdAndUsuarioId(id, usuario.getId())
                .orElseThrow(() -> new RuntimeException("Recibo no encontrado"));

        if (recibo.getEstado() == EstadoRecibo.PENDIENTE) {
            recibo.setEstado(EstadoRecibo.PAGADO);
            recibo.setFechaPago(LocalDate.now());
        } else {
            recibo.setEstado(EstadoRecibo.PENDIENTE);
            recibo.setFechaPago(null);
        }

        return ReciboResponse.from(reciboRepository.save(recibo));
    }
}
