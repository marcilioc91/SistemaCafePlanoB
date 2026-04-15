package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository repository;

    public List<Cliente> listar() {
        return repository.findAll();
    }

    public Cliente salvar(Cliente cliente) {
        return repository.save(cliente);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
