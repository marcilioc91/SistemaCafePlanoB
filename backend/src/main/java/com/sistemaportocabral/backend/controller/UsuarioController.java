package com.sistemaportocabral.backend.controller;

import com.sistemaportocabral.backend.dto.AtualizarPerfilDTO;
import com.sistemaportocabral.backend.dto.CadastroRequestDTO;
import com.sistemaportocabral.backend.dto.LoginRequestDTO;
import com.sistemaportocabral.backend.dto.ResetSenhaDTO;
import com.sistemaportocabral.backend.entity.Usuario;
import com.sistemaportocabral.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UsuarioController {
    @Autowired
    private UsuarioService service;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        Usuario encontrado = service.autenticar(loginRequest.getLogin(), loginRequest.getSenha());
        if (encontrado != null) {
            return ResponseEntity.ok(encontrado);
        }
        return ResponseEntity.status(401).body("Login ou senha inválidos");
    }

    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody CadastroRequestDTO dto) {
        try {
            Usuario criado = service.cadastrar(dto);
            return ResponseEntity.status(201).body(criado);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Erro ao cadastrar: " + e.getMessage());
        }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios(
            @RequestHeader(value = "X-Usuario-Perfil", required = false) String perfil) {
        if (!"ADMIN".equals(perfil)) {
            return ResponseEntity.status(403).body("Acesso negado.");
        }
        return ResponseEntity.ok(service.listarTodos());
    }

    @PatchMapping("/usuarios/{id}/reset-senha")
    public ResponseEntity<?> resetSenha(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Perfil", required = false) String perfil,
            @RequestBody ResetSenhaDTO dto) {
        if (!"ADMIN".equals(perfil)) {
            return ResponseEntity.status(403).body("Acesso negado.");
        }
        try {
            service.resetSenha(id, dto.getNovaSenha());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PatchMapping("/usuarios/{id}/perfil")
    public ResponseEntity<?> atualizarPerfil(
            @PathVariable Long id,
            @RequestHeader(value = "X-Usuario-Perfil", required = false) String perfil,
            @RequestHeader(value = "X-Usuario-Id", required = false) Long adminId,
            @RequestBody AtualizarPerfilDTO dto) {
        if (!"ADMIN".equals(perfil)) {
            return ResponseEntity.status(403).body("Acesso negado.");
        }
        if (id.equals(adminId)) {
            return ResponseEntity.status(400).body("Você não pode alterar o próprio perfil.");
        }
        try {
            return ResponseEntity.ok(service.atualizarPerfil(id, dto.getPerfil()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
