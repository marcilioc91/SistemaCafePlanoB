package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name="PRODUTO")
@Data

public class Produto {
    @Id
    private Integer id;
    private String nome;
    private BigDecimal preco;
    private Integer estoque;
}