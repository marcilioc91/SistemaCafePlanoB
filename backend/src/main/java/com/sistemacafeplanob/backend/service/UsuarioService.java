package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.dto.CadastroRequestDTO;
import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.entity.Pessoa;
import com.sistemacafeplanob.backend.entity.Usuario;
import com.sistemacafeplanob.backend.repository.ClienteRepository;
import com.sistemacafeplanob.backend.repository.PessoaRepository;
import com.sistemacafeplanob.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public Usuario autenticar(String login, String senha) {
        return repository.findByUsuarioLogin(login)
                .filter(u -> u.getSenha().equals(senha))
                .orElse(null);
    }

    @Transactional
    public Usuario cadastrar(CadastroRequestDTO dto) {
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(dto.getNome());
        pessoa.setCpf(dto.getCpf());
        pessoa = pessoaRepository.save(pessoa);

        Usuario usuario = new Usuario();
        usuario.setPessoa(pessoa);
        usuario.setUsuarioLogin(dto.getUsuario());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario = repository.save(usuario);

        if (dto.getObs() != null && !dto.getObs().isBlank()) {
            Cliente cliente = new Cliente();
            cliente.setPessoa(pessoa);
            cliente.setObs(dto.getObs());
            clienteRepository.save(cliente);
        }

        return usuario;
    }
}
