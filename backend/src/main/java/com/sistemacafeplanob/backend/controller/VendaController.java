package com.sistemacafeplanob.backend.controller;

import com.sistemacafeplanob.backend.dto.VendaRequestDTO;
import com.sistemacafeplanob.backend.entity.Venda;
import com.sistemacafeplanob.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendas")
public class VendaController {
    @Autowired
    private VendaService service;

    @PostMapping
    public Venda realizarVenda(@RequestBody VendaRequestDTO dto) {
        return service.realizarVenda(dto);
    }
}
