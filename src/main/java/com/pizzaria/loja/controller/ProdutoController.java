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

    // ============================================================
    // MÉTODO: atualizar (PUT)
    //
    // @PutMapping("/{id}"): Responde requisições do tipo PUT no endereço
    //   http://localhost:8080/produtos/3  (o "3" é o ID da pizza a editar)
    //
    // @PathVariable Long id:
    //   → "Path" = caminho da URL, "Variable" = variável
    //   → Captura o número que está entre as chaves {id} na URL
    //   → Ex: na URL "/produtos/5", o id valerá 5 aqui no Java
    //
    // @RequestBody Produto produto:
    //   → Pega o JSON enviado no corpo da requisição e converte para Produto
    //   → Ex de JSON: { "nome": "Margherita Premium", "precoPequena": 35.90, ... }
    //
    // ResponseEntity<Produto>:
    //   → Retorna o produto já atualizado no corpo da resposta
    //   → .ok() gera o Status 200 OK (atualização bem-sucedida)
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        // Passa o id (quem editar) e o produto com os novos dados para o Service
        // O Service busca no banco, valida e salva. Retorna o produto atualizado.
        return ResponseEntity.ok(produtoService.atualizarProduto(id, produto));
    }

    // ============================================================
    // MÉTODO: deletar (DELETE LÓGICO)
    //
    // @DeleteMapping("/{id}"): Responde requisições do tipo DELETE no endereço
    //   http://localhost:8080/produtos/3  (o "3" é o ID da pizza a desativar)
    //
    // @PathVariable Long id:
    //   → Igual ao PUT acima: captura o ID da URL
    //
    // ResponseEntity<Void>:
    //   → <Void> significa que esta resposta NÃO tem corpo (body).
    //   → Faz sentido: deletar não precisa devolver nenhum dado,
    //     só precisamos informar se deu certo ou não.
    //
    // .noContent().build():
    //   → noContent() → define o Status HTTP 204 (No Content = Sem Conteúdo)
    //   → .build()    → constrói a resposta vazia (sem body)
    //   → Status 204 é o padrão REST para deleções bem-sucedidas:
    //     "deu certo, e não tenho nada para te devolver"
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        // Chama o Service para desativar o produto (ativo = false)
        // Não precisamos do retorno pois o método é void
        produtoService.deletarProduto(id);

        // Retorna resposta HTTP vazia com status 204 (Sem conteúdo)
        return ResponseEntity.noContent().build();
    }
}
