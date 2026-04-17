package com.sistemacafeplanob.backend.dto;

import lombok.Data;

@Data
public class CadastroRequestDTO {
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private String usuario;
    private String senha;
    private String obs;
}
