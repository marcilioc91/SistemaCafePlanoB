package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.entity.Usuario;
import com.sistemacafeplanob.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    public Usuario autenticar(String cpf, String senha) {
        return repository.findAll().stream()
                .filter(u -> u.getCpf().equals(cpf) && u.getSenha().equals(senha))
                .findFirst()
                .orElse(null);
    }
}
