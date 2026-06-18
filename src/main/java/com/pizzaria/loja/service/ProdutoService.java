package com.pizzaria.loja.service;

import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // ============================================================
    // MÉTODOS DE BUSCA
    // ============================================================
    public List<Produto> listarProdutosAtivos() {
        return produtoRepository.findByAtivoTrue();
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    // ============================================================
    // MÉTODO: cadastrarProduto (Criação)
    // ============================================================
    public Produto cadastrarProduto(Produto produto) {
        validarProduto(produto);
        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }
        return produtoRepository.save(produto);
    }

    // ============================================================
    // MÉTODO: atualizarProduto (Edição - Requisito Sprint 3)
    // ============================================================
    public Produto atualizarProduto(Long id, Produto dadosAtualizados) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        // Valida os novos dados antes de atualizar
        validarProduto(dadosAtualizados);

        // Atualiza os campos permitidos
        produtoExistente.setNome(dadosAtualizados.getNome());
        produtoExistente.setDescricao(dadosAtualizados.getDescricao());
        produtoExistente.setPrecoPequena(dadosAtualizados.getPrecoPequena());
        produtoExistente.setPrecoMedia(dadosAtualizados.getPrecoMedia());
        produtoExistente.setPrecoGrande(dadosAtualizados.getPrecoGrande());
        produtoExistente.setAtivo(dadosAtualizados.getAtivo());

        return produtoRepository.save(produtoExistente);
    }

    // ============================================================
    // MÉTODO: deletarProduto (Exclusão Lógica - Requisito Sprint 3)
    // ============================================================
    public void deletarProduto(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));
        
        // Em vez de apagar do banco (o que quebraria pedidos antigos), 
        // nós apenas desativamos a pizza para ela sumir do cardápio.
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    // ============================================================
    // MÉTODO: salvarImagem (Upload - Requisito Sprint 3)
    // Salva a foto física na pasta "uploads" e devolve o nome gerado.
    // O erro vermelho do Controller vai sumir por causa deste método!
    // ============================================================
    public String salvarImagem(MultipartFile arquivo) {
        try {
            // Cria a pasta "uploads" na raiz do projeto, se não existir
            Path pastaUploads = Paths.get("uploads");
            if (!Files.exists(pastaUploads)) {
                Files.createDirectories(pastaUploads);
            }

            // Gera um nome único para não sobrescrever imagens com o mesmo nome
            String nomeArquivo = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
            Path caminhoDestino = pastaUploads.resolve(nomeArquivo);
            
            // Copia o arquivo recebido para a pasta de destino
            Files.copy(arquivo.getInputStream(), caminhoDestino, StandardCopyOption.REPLACE_EXISTING);
            
            return nomeArquivo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar a imagem: " + e.getMessage());
        }
    }

    // ============================================================
    // MÉTODOS PRIVADOS DE VALIDAÇÃO (Reaproveitados da Sprint 2)
    // ============================================================
    private void validarProduto(Produto produto) {
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório.");
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