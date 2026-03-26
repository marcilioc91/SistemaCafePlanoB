package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="VENDA")
@Data
public class Venda {
    @Id
    private Integer id;
    private Integer cliente_id;
    private String usuario_cpf;
    @CreationTimestamp
    private LocalDateTime data_venda;
}
