package com.pizzaria.loja.controller;

import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
// @RestController: Diz ao Spring que esta classe responde requisições web
// @RequestMapping: Define o endereço base. Ex: http://localhost:8080/produtos
// ============================================================
@RestController
@RequestMapping("/produtos")
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

    // ============================================================
    // @PostMapping: Responde a requisições do tipo POST (criar dados)
    // @RequestBody: Pega o JSON enviado na requisição e transforma no objeto Produto
    // ============================================================
    @PostMapping
    public ResponseEntity<Produto> cadastrar(@RequestBody Produto produto) {
        Produto produtoSalvo = produtoService.cadastrarProduto(produto);
        return ResponseEntity.status(201).body(produtoSalvo); // Retorna Status 201 Created
    }
}