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

    @Transactional
    public Cliente atualizar(Integer id, Cliente clienteAtualizado) {
        Cliente existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Pessoa pessoa = existente.getPessoa();
        pessoa.setNome(clienteAtualizado.getPessoa().getNome());
        pessoa.setCpf(clienteAtualizado.getPessoa().getCpf());
        pessoa.setTelefone(clienteAtualizado.getPessoa().getTelefone());
        pessoaRepository.save(pessoa);
        existente.setObs(clienteAtualizado.getObs());
        return repository.save(existente);
    }

    public void excluir(Integer id) {
        repository.deleteById(id);
    }
}
