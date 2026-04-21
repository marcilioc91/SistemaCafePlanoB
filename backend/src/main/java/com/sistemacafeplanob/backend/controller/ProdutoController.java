package com.sistemacafeplanob.backend.controller;

import com.sistemacafeplanob.backend.entity.Produto;
import com.sistemacafeplanob.backend.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService service;

    @GetMapping
    public List<Produto> listar() {
        return service.listar();
    }

    @PostMapping
    public Produto salvar(
            @RequestBody Produto produto,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @RequestHeader(value = "X-Usuario-Nome", required = false) String usuarioNome) {
        return service.salvar(produto, usuarioId, usuarioNome);
    }

    @PutMapping("/{id}")
    public Produto atualizar(
            @PathVariable Long id,
            @RequestBody Produto produto,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @RequestHeader(value = "X-Usuario-Nome", required = false) String usuarioNome) {
        produto.setId(id);
        return service.salvar(produto, usuarioId, usuarioNome);
    }

    @DeleteMapping("/{id}")
    public void excluir(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long usuarioId,
            @RequestHeader(value = "X-Usuario-Nome", required = false) String usuarioNome) {
        service.excluir(id, usuarioId, usuarioNome);
    }
}
