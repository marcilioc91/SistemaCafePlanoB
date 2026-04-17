package com.sistemacafeplanob.backend.repository;

import com.sistemacafeplanob.backend.entity.Pessoa;
import com.sistemacafeplanob.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuarioLogin(String usuarioLogin);
    Optional<Usuario> findByPessoa(Pessoa pessoa);
}
