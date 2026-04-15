package com.sistemacafeplanob.backend.repository;

import com.sistemacafeplanob.backend.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
