package com.sistemacafeplanob.backend.service;

import com.sistemacafeplanob.backend.dto.PagamentoRequestDTO;
import com.sistemacafeplanob.backend.dto.VendaRequestDTO;
import com.sistemacafeplanob.backend.dto.VendaProdutoRequestDTO;
import com.sistemacafeplanob.backend.entity.Cliente;
import com.sistemacafeplanob.backend.entity.Produto;
import com.sistemacafeplanob.backend.entity.Usuario;
import com.sistemacafeplanob.backend.entity.Venda;
import com.sistemacafeplanob.backend.entity.VendaItem;
import com.sistemacafeplanob.backend.repository.ProdutoRepository;
import com.sistemacafeplanob.backend.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        venda.setCliente(entityManager.getReference(Cliente.class, dto.getClienteId()));
        venda.setUsuario(entityManager.getReference(Usuario.class, dto.getUsuarioId()));
        venda.setFormaPagamento(dto.getFormaPagamento());
        venda.setValorPago(dto.getValorPago());

        venda = vendaRepository.save(venda);

        for (VendaProdutoRequestDTO item : dto.getProdutos()) {
            Produto produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + item.getProdutoId()));

            VendaItem vp = new VendaItem();
            vp.setVenda(venda);
            vp.setProduto(produto);
            vp.setQuantidade(item.getQuantidade());
            vp.setPrecoUnitario(produto.getPreco());

            entityManager.persist(vp);

            produto.setEstoque(produto.getEstoque() - item.getQuantidade());
            produtoRepository.save(produto);
        }

        return venda;
    }

    public List<Venda> listarTodas() {
        return vendaRepository.findAllComItens();
    }

    public List<Venda> listarPorCliente(Long clienteId) {
        return vendaRepository.findByClienteIdComItens(clienteId);
    }

    @Transactional
    public Venda atualizarPagamento(Long id, PagamentoRequestDTO dto) {
        Venda venda = vendaRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("Venda não encontrada: " + id));
        venda.setFormaPagamento(dto.getFormaPagamento());
        venda.setValorPago(dto.getValorPago());
        return vendaRepository.save(venda);
    }
}
