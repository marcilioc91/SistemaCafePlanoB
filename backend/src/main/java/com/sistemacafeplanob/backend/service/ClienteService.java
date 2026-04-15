package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.entity.Pessoa;
import com.sistemacafeplanob.backend.repository.ClienteRepository;
import com.sistemacafeplanob.backend.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository repository;

    @Autowired
    private PessoaRepository pessoaRepository;

    public List<Cliente> listar() {
        return repository.findAll();
    }

    @Transactional
    public Cliente salvar(Cliente cliente) {
        Pessoa pessoa = pessoaRepository.save(cliente.getPessoa());
        cliente.setPessoa(pessoa);
        return repository.save(cliente);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
