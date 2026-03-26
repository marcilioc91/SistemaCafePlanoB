package com.sistemacafeplanob.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
@Entity
@Table(name="VENDA_PRODUTO")
@Data

public class VendaProduto {
    @Id
    private int id;
    private int venda_id;
    private int produto_id;
    private int quantidade;
    private BigDecimal preco_unitario;
}
