package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.entity.Produto;
import com.sistemacafeplanob.backend.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    @Autowired
    private AuditoriaService auditoriaService;

    public List<Produto> listar() {
        return repository.findAll();
    }

    public Produto salvar(Produto produto, Long usuarioId, String usuarioNome) {
        boolean isNovo = produto.getId() == null;
        Produto salvo = repository.save(produto);

        String tipo = isNovo ? "INCLUSAO_PRODUTO" : "ALTERACAO_PRODUTO";
        String acao = isNovo ? "incluído" : "alterado";
        auditoriaService.registrar(usuarioId, usuarioNome, tipo,
                "Produto '" + salvo.getNome() + "' (ID " + salvo.getId() + ") " + acao + ".");

        return salvo;
    }

    public void excluir(Long id, Long usuarioId, String usuarioNome) {
        repository.findById(id).ifPresent(p ->
                auditoriaService.registrar(usuarioId, usuarioNome, "EXCLUSAO_PRODUTO",
                        "Produto '" + p.getNome() + "' (ID " + id + ") excluído.")
        );
        repository.deleteById(id);
    }
}
