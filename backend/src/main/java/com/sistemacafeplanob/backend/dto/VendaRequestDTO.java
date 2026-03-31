package com.sistemacafeplanob.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class VendaRequestDTO {
    private Integer clienteId;
    private String usuarioCpf;
    private List<VendaProdutoRequestDTO> produtos;
}
