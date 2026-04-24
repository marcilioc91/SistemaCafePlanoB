package com.sistemaportocabral.backend.repository;

import com.sistemaportocabral.backend.entity.AuditoriaLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaLogRepository extends JpaRepository<AuditoriaLog, Long> {

    List<AuditoriaLog> findAllByOrderByDataHoraDesc();

    List<AuditoriaLog> findByUsuarioIdOrderByDataHoraDesc(Long usuarioId);
}
