package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.entity.Produto;
import com.sistemacafeplanob.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository repository;

    public List<Produto> listar(){
        return repository.findAll();
    }

    public Produto salvar(Produto produto){
        return repository.save(produto);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}
