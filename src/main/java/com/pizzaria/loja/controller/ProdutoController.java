package com.pizzaria.loja.controller;

import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

// ============================================================
// @RestController: Diz ao Spring que esta classe responde requisições web
// @RequestMapping: Define o endereço base. Ex: http://localhost:8080/produtos
// ============================================================
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // ============================================================
    // @GetMapping: Responde a requisições do tipo GET (buscar dados)
    // Retorna a lista de produtos que estão ativos.
    // ============================================================
    @GetMapping
    public ResponseEntity<List<Produto>> listar() {
        List<Produto> produtos = produtoService.listarProdutosAtivos();
        return ResponseEntity.ok(produtos); // Retorna Status 200 OK
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Produto>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    // ============================================================
    // @PostMapping: Responde a requisições do tipo POST (criar dados)
    // @RequestBody: Pega o JSON enviado na requisição e transforma no objeto Produto
    // ============================================================
    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody Produto produto) {
        Produto produtoSalvo = produtoService.cadastrarProduto(produto);
        return ResponseEntity.status(201).body(produtoSalvo); // Retorna Status 201 Created
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        return ResponseEntity.ok(produtoService.atualizarProduto(id, produto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluirProduto(id);
        return ResponseEntity.noContent().build();
    }


    // ============================================================
    // @PostMapping para Upload
    // Acesso: POST http://localhost:8080/produtos/1/imagem (Enviar via form-data)
    // ============================================================
    @PostMapping("/{id}/imagem")
    public ResponseEntity<Produto> uploadImagem(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        Produto produtoAtualizado = produtoService.salvarImagem(id, file);
        return ResponseEntity.ok(produtoAtualizado);
    }
}
