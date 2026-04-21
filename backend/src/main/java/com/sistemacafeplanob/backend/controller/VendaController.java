package com.sistemacafeplanob.backend.controller;

import com.sistemacafeplanob.backend.dto.PagamentoRequestDTO;
import com.sistemacafeplanob.backend.dto.RelatorioInventarioItemDTO;
import com.sistemacafeplanob.backend.dto.VendaRequestDTO;
import com.sistemacafeplanob.backend.entity.Venda;
import com.sistemacafeplanob.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    @Autowired
    private VendaService service;

    @PostMapping
    public Venda realizarVenda(@RequestBody VendaRequestDTO dto) {
        return service.realizarVenda(dto);
    }

    @GetMapping
    public List<Venda> listarTodas() {
        return service.listarTodas();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Venda> listarPorCliente(@PathVariable Long clienteId) {
        return service.listarPorCliente(clienteId);
    }

    @PatchMapping("/{id}/pagamento")
    public Venda atualizarPagamento(@PathVariable Long id, @RequestBody PagamentoRequestDTO dto) {
        return service.atualizarPagamento(id, dto);
    }

    @GetMapping("/relatorio/inventario")
    public List<RelatorioInventarioItemDTO> relatorioInventario() {
        return service.gerarRelatorioInventario();
    }
}
