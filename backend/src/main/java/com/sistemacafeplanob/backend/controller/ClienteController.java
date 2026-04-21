package com.sistemacafeplanob.backend.controller;

import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteService service;

    @GetMapping
    public List<Cliente> listar() {
        return service.listar();
    }

    @PostMapping
    public ResponseEntity<?> salvar(
            @RequestBody Cliente cliente,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @RequestHeader(value = "X-Usuario-Nome", required = false) String usuarioNome) {
        try {
            return ResponseEntity.status(201).body(service.salvar(cliente, usuarioId, usuarioNome));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Integer id,
            @RequestBody Cliente cliente,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @RequestHeader(value = "X-Usuario-Nome", required = false) String usuarioNome) {
        try {
            return ResponseEntity.ok(service.atualizar(id, cliente, usuarioId, usuarioNome));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Integer id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @RequestHeader(value = "X-Usuario-Nome", required = false) String usuarioNome) {
        service.excluir(id, usuarioId, usuarioNome);
    }
}
