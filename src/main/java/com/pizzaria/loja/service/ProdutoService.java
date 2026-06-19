package com.pizzaria.loja.service;

import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
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

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
    }

    public Produto cadastrarProduto(Produto produto) {
        validarProduto(produto);
        if (produto.getAtivo() == null) produto.setAtivo(true);
        produto.setId(null);
        return produtoRepository.save(produto);
    }

    public Produto atualizarProduto(Long id, Produto dados) {
        Produto produto = buscarPorId(id);
        produto.setNome(dados.getNome());
        produto.setDescricao(dados.getDescricao());
        produto.setPrecoPequena(dados.getPrecoPequena());
        produto.setPrecoMedia(dados.getPrecoMedia());
        produto.setPrecoGrande(dados.getPrecoGrande());
        if (dados.getAtivo() != null) produto.setAtivo(dados.getAtivo());
        validarProduto(produto);
        return produtoRepository.save(produto);
    }

    public void excluirProduto(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    public Produto salvarImagem(Long id, MultipartFile arquivo) {
        Produto produto = buscarPorId(id);
        if (arquivo == null || arquivo.isEmpty()) {
            throw new IllegalArgumentException("Selecione uma imagem.");
        }
        try {
            Path pasta = Path.of("uploads").toAbsolutePath().normalize();
            Files.createDirectories(pasta);
            String original = Path.of(arquivo.getOriginalFilename()).getFileName().toString();
            String nome = id + "_" + System.currentTimeMillis() + "_" + original;
            arquivo.transferTo(pasta.resolve(nome));
            produto.setImagem("/uploads/" + nome);
            return produtoRepository.save(produto);
        } catch (Exception erro) {
            throw new IllegalArgumentException("Erro ao salvar a imagem.");
        }
    }

    private void validarProduto(Produto produto) {
        if (produto.getNome() == null || produto.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
        }
        validarPreco(produto.getPrecoPequena(), "Preço pequeno");
        validarPreco(produto.getPrecoMedia(), "Preço médio");
        validarPreco(produto.getPrecoGrande(), "Preço grande");
    }

    private void validarPreco(BigDecimal preco, String campo) {
        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(campo + " deve ser maior que zero.");
        }
    }
}
