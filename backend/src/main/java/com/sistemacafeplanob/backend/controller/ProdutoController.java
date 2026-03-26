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
    public List<Produto> listar(){
        return service.listar();
    }

    @PostMapping
    public Produto salvar(@RequestBody Produto produto){
        return service.salvar(produto);
    }
}
