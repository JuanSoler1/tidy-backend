package com.tidy.controller;

import com.tidy.dto.ReciboRequest;
import com.tidy.dto.ReciboResponse;
import com.tidy.service.ReciboService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recibos")
public class ReciboController {

    private final ReciboService reciboService;

    public ReciboController(ReciboService reciboService) {
        this.reciboService = reciboService;
    }

    @PostMapping
    public ResponseEntity<ReciboResponse> crear(
            @RequestBody ReciboRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reciboService.crear(request, userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<ReciboResponse>> listarPorMes(
            @RequestParam Integer mes,
            @RequestParam Integer anio,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reciboService.listarPorMes(mes, anio, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReciboResponse> actualizar(
            @PathVariable Long id,
            @RequestBody ReciboRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reciboService.actualizar(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        reciboService.eliminar(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ReciboResponse> cambiarEstado(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reciboService.cambiarEstado(id, userDetails.getUsername()));
    }
}
