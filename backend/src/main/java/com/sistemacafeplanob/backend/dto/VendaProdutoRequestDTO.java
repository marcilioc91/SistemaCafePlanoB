package com.sistemacafeplanob.backend.dto;

import lombok.Data;

@Data
public class VendaProdutoRequestDTO {
    private Long produtoId;
    private Integer quantidade;
}
