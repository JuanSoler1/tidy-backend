package com.tidy.repository;

import com.tidy.model.EstadoRecibo;
import com.tidy.model.Recibo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReciboRepository extends JpaRepository<Recibo, Long> {

    List<Recibo> findByUsuarioId(Long usuarioId);

    List<Recibo> findByUsuarioIdAndMesAndAnio(Long usuarioId, Integer mes, Integer anio);

    List<Recibo> findByUsuarioIdAndEstado(Long usuarioId, EstadoRecibo estado);

    Optional<Recibo> findByIdAndUsuarioId(Long id, Long usuarioId);
}
