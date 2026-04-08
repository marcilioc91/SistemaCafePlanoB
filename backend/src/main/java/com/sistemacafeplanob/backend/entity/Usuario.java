package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "USUARIO")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "PESSOA_ID", nullable = false, unique = true)
    private Pessoa pessoa;

    @Column(name = "USUARIO_LOGIN", unique = true, nullable = false)
    private String usuarioLogin;

    @Column(unique = true, nullable = false)
    private String email;

    private String senha;

    @CreationTimestamp
    private LocalDateTime data_criacao;
}
