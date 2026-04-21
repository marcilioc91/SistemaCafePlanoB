package com.sistemacafeplanob.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RelatorioInventarioItemDTO {
    private String nomeProduto;
    private Integer quantidadeVendida;
    private BigDecimal totalReceita;
    private BigDecimal totalCusto;
    private BigDecimal lucro;

    public RelatorioInventarioItemDTO(String nomeProduto) {
        this.nomeProduto = nomeProduto;
        this.quantidadeVendida = 0;
        this.totalReceita = BigDecimal.ZERO;
        this.totalCusto = BigDecimal.ZERO;
        this.lucro = BigDecimal.ZERO;
    }
}
