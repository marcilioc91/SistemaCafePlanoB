package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.entity.Pessoa;
import com.sistemacafeplanob.backend.repository.ClienteRepository;
import com.sistemacafeplanob.backend.repository.PessoaRepository;
import com.sistemacafeplanob.backend.repository.UsuarioRepository;
import com.sistemacafeplanob.backend.repository.VendaRepository;
import com.sistemacafeplanob.backend.util.ValidacaoUtil;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VendaRepository vendaRepository;

    public List<Cliente> listar() {
        return repository.findAll();
    }

    @Transactional
    public Cliente salvar(Cliente cliente) {
        String cpf = cliente.getPessoa().getCpf();
        if (cpf != null && !cpf.isBlank()) {
            String cpfLimpo = limparCpf(cpf);
            validarCpf(cpfLimpo);
            if (pessoaRepository.existsByCpf(cpfLimpo)) {
                throw new IllegalArgumentException("CPF já cadastrado.");
            }
            cliente.getPessoa().setCpf(cpfLimpo);
        } else {
            cliente.getPessoa().setCpf(null);
        }
        Pessoa pessoa = pessoaRepository.save(cliente.getPessoa());
        cliente.setPessoa(pessoa);
        return repository.save(cliente);
    }

    @Transactional
    public Cliente atualizar(Integer id, Cliente clienteAtualizado) {
        Cliente existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Pessoa pessoa = existente.getPessoa();

        String cpf = clienteAtualizado.getPessoa().getCpf();
        if (cpf != null && !cpf.isBlank()) {
            String cpfLimpo = limparCpf(cpf);
            validarCpf(cpfLimpo);
            if (pessoaRepository.existsByCpfAndIdNot(cpfLimpo, pessoa.getId())) {
                throw new IllegalArgumentException("CPF já cadastrado para outro cliente.");
            }
            pessoa.setCpf(cpfLimpo);
        } else {
            pessoa.setCpf(null);
        }

        pessoa.setNome(clienteAtualizado.getPessoa().getNome());
        pessoa.setTelefone(clienteAtualizado.getPessoa().getTelefone());
        pessoaRepository.save(pessoa);
        existente.setObs(clienteAtualizado.getObs());
        return repository.save(existente);
    }

    @Transactional
    public void excluir(Integer id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        Pessoa pessoa = cliente.getPessoa();

        vendaRepository.deleteAll(vendaRepository.findByClienteId(cliente.getId()));

        usuarioRepository.findByPessoa(pessoa).ifPresent(u -> {
            vendaRepository.deleteAll(vendaRepository.findByUsuarioId(u.getId()));
            usuarioRepository.delete(u);
        });

        repository.delete(cliente);
        pessoaRepository.delete(pessoa);
    }

    private String limparCpf(String cpf) {
        return cpf == null ? "" : cpf.replaceAll("[^0-9]", "");
    }

    private void validarCpf(String cpfLimpo) {
        if (!ValidacaoUtil.cpfValido(cpfLimpo)) {
            throw new IllegalArgumentException("CPF inválido.");
        }
    }
}
