package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.dto.CadastroRequestDTO;
import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.entity.Pessoa;
import com.sistemacafeplanob.backend.entity.Usuario;
import com.sistemacafeplanob.backend.repository.ClienteRepository;
import com.sistemacafeplanob.backend.repository.PessoaRepository;
import com.sistemacafeplanob.backend.repository.UsuarioRepository;
import com.sistemacafeplanob.backend.util.ValidacaoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Usuario autenticar(String login, String senha) {
        return repository.findByUsuarioLogin(login)
                .filter(u -> passwordEncoder.matches(senha, u.getSenha()))
                .orElse(null);
    }

    @Transactional
    public Usuario cadastrar(CadastroRequestDTO dto) {
        String cpfLimpo = dto.getCpf() == null ? "" : dto.getCpf().replaceAll("[^0-9]", "");

        if (!ValidacaoUtil.cpfValido(cpfLimpo)) {
            throw new IllegalArgumentException("CPF inválido.");
        }
        if (!ValidacaoUtil.emailValido(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail inválido.");
        }
        if (pessoaRepository.existsByCpf(cpfLimpo)) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        Pessoa pessoa = new Pessoa();
        pessoa.setNome(dto.getNome());
        pessoa.setCpf(cpfLimpo);
        pessoa.setTelefone(dto.getTelefone());
        pessoa = pessoaRepository.save(pessoa);

        Usuario usuario = new Usuario();
        usuario.setPessoa(pessoa);
        usuario.setUsuarioLogin(dto.getUsuario());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario = repository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setPessoa(pessoa);
        cliente.setObs(dto.getObs());
        clienteRepository.save(cliente);

        return usuario;
    }
}
