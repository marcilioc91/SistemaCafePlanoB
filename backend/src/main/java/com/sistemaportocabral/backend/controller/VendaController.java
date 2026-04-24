package com.sistemaportocabral.backend.controller;

import com.sistemaportocabral.backend.dto.PagamentoRequestDTO;
import com.sistemaportocabral.backend.dto.VendaRequestDTO;
import com.sistemaportocabral.backend.entity.Venda;
import com.sistemaportocabral.backend.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> relatorioInventario(
            @RequestHeader(value = "X-Usuario-Perfil", required = false) String perfil) {
        if (!"ADMIN".equals(perfil)) {
            return ResponseEntity.status(403).body("Acesso negado.");
        }
        return ResponseEntity.ok(service.gerarRelatorioInventario());
    }
}
