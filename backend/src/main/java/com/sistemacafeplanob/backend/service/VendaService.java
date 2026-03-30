package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.dto.VendaRequestDTO;
import com.sistemacafeplanob.backend.dto.VendaProdutoRequestDTO;
import com.sistemacafeplanob.backend.entity.Produto;
import com.sistemacafeplanob.backend.entity.Venda;
import com.sistemacafeplanob.backend.entity.VendaProduto;
import com.sistemacafeplanob.backend.repository.ProdutoRepository;
import com.sistemacafeplanob.backend.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

@Service
public class VendaService {
    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public Venda realizarVenda(VendaRequestDTO dto) {
        Venda venda = new Venda();
        venda.setCliente_id(dto.getClienteId());
        venda.setUsuario_cpf(dto.getUsuarioCpf());

        venda = vendaRepository.save(venda);

        for (VendaProdutoRequestDTO item : dto.getProdutos()) {
            Produto produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.getProdutoId()));

            VendaProduto vp = new VendaProduto();
            vp.setVenda_id(venda.getId());
            vp.setProduto_id(item.getProdutoId());
            vp.setQuantidade(item.getQuantidade());
            vp.setPreco_unitario(produto.getPreco());

            entityManager.persist(vp);

            produto.setEstoque(produto.getEstoque() - item.getQuantidade());
            produtoRepository.save(produto);
        }

        return venda;
    }
}
