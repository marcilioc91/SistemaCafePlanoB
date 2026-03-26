package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="CLIENTE")
@Data
public class Cliente {
    @Id
    private Integer id;
    private String nome;
    private String cpf;
    private String telefone;
    private String obs;
}
