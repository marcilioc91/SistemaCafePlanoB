package com.sistemacafeplanob.backend.dto;

import lombok.Data;

@Data
public class VendaProdutoRequestDTO {
    private Integer produtoId;
    private Integer quantidade;
}
