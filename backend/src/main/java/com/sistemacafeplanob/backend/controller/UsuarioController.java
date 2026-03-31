package com.sistemacafeplanob.backend.controller;

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
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Usuario encontrado = service.autenticar(usuario.getCpf(), usuario.getSenha());
        if (encontrado != null) {
            return ResponseEntity.ok(encontrado);
        }
        return ResponseEntity.status(401).body("CPF ou senha inválidos");
    }
}
