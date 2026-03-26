package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="USUARIO")
@Data
public class Usuario {
    @Id
    private String cpf;
    private String nome;
    private String email;
    private String senha;
    @CreationTimestamp
    private LocalDateTime data_criacao;
}
