package com.pizzaria.loja.service;

import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarProdutosAtivos() {
        return produtoRepository.findByAtivoTrue();
    }

    public Produto cadastrarProduto(Produto produto) {
        validarProduto(produto);

        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }

        return produtoRepository.save(produto);
    }

    private void validarProduto(Produto produto) {
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do produto e obrigatorio.");
        }

        validarPreco(produto.getPrecoPequena(), "precoPequena");
        validarPreco(produto.getPrecoMedia(), "precoMedia");
        validarPreco(produto.getPrecoGrande(), "precoGrande");
    }

    private void validarPreco(BigDecimal preco, String campo) {
        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(campo + " deve ser maior que zero.");
        }
    }
}
