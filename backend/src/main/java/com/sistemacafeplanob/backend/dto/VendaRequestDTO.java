package com.sistemacafeplanob.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class VendaRequestDTO {
    private Long clienteId;
    private Long usuarioId;
    private List<VendaProdutoRequestDTO> produtos;
}
