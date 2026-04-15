package com.sistemacafeplanob.backend.controller;

import com.sistemacafeplanob.backend.dto.CadastroRequestDTO;
import com.sistemacafeplanob.backend.dto.LoginRequestDTO;
import com.sistemacafeplanob.backend.entity.Usuario;
import com.sistemacafeplanob.backend.service.UsuarioService;
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
}
