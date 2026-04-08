package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "PESSOA")
@Data
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nome;
    @Column(unique = true, nullable = false)
    private String cpf;
    private String telefone;
}
