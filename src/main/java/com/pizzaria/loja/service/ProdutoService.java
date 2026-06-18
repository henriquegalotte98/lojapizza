package com.pizzaria.loja.service;

// ============================================================
// IMPORTS
// Trazem as classes e bibliotecas necessárias para o código funcionar.
// ============================================================
import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

// ============================================================
// @Service
// Diz ao Spring Boot que esta classe é um "Serviço" (Service).
// A camada de Service é onde ficam as "regras de negócio" (validações, 
// lógicas, cálculos). O Spring cria e gerencia essa classe automaticamente.
// ============================================================
@Service
public class ProdutoService {

    // ============================================================
    // INJEÇÃO DE DEPENDÊNCIA
    // Declaramos o repositório aqui para que o Service consiga 
    // conversar com o banco de dados (salvar, buscar, deletar).
    // O modificador 'final' garante que esse repositório não será 
    // alterado ou substituído depois que a classe for criada.
    // ============================================================
    private final ProdutoRepository produtoRepository;

    // ============================================================
    // CONSTRUTOR
    // É através deste construtor que o Spring injeta a dependência.
    // Quando o Spring criar o ProdutoService, ele automaticamente 
    // entrega o ProdutoRepository pronto para uso aqui dentro.
    // ============================================================
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // ============================================================
    // MÉTODO: listarProdutosAtivos
    // Objetivo: Retornar para o usuário apenas as pizzas que estão disponíveis.
    // Ele vai até o repositório e chama aquele método customizado 
    // "findByAtivoTrue()" que você criou na interface ProdutoRepository.
    // ============================================================
    public List<Produto> listarProdutosAtivos() {
        return produtoRepository.findByAtivoTrue();
    }

    // ============================================================
    // MÉTODO: cadastrarProduto
    // Objetivo: Receber um produto novo (geralmente vindo da internet),
    // validar os dados e salvar no banco de dados MySQL.
    // ============================================================
    public Produto cadastrarProduto(Produto produto) {
        
        // 1. Chama o método privado de validação (logo abaixo).
        // Se houver erro de nome em branco ou preço negativo, o código 
        // para aqui mesmo e lança um erro.
        validarProduto(produto);

        // 2. Regra de Negócio Automática:
        // Se quem enviou o produto não especificou se ele está ativo ou não,
        // nós assumimos que ele está ativo por padrão (true).
        // Afinal, se estamos cadastrando uma pizza, queremos vendê-la!
        if (produto.getAtivo() == null) {
            produto.setAtivo(true);
        }

        // 3. Salva o produto no banco de dados. 
        // O '.save()' executa um INSERT no MySQL e devolve o produto
        // agora preenchido com o 'id' que o banco gerou.
        return produtoRepository.save(produto);
    }

    // ============================================================
    // MÉTODO: validarProduto (Privado)
    // O modificador 'private' significa que este método só pode ser 
    // usado dentro desta mesma classe ProdutoService.
    // Serve para organizar o código, evitando que o método de 
    // cadastro fique gigante e confuso.
    // ============================================================
    private void validarProduto(Produto produto) {
        
        // Validação de Nome:
        // produto.getNome() == null -> Verifica se esqueceram de mandar o nome.
        // produto.getNome().trim().isEmpty() -> O '.trim()' remove espaços em branco 
        // nas pontas. Se depois de remover os espaços a palavra ficar vazia, é inválido.
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            
            // O 'throw new IllegalArgumentException' corta a execução do código
            // na hora e devolve essa mensagem de erro para o sistema.
            throw new IllegalArgumentException("Nome do produto e obrigatorio.");
        }

        // Reaproveita o método auxiliar de preços (abaixo) para validar 
        // os três tamanhos de pizza individualmente.
        validarPreco(produto.getPrecoPequena(), "precoPequena");
        validarPreco(produto.getPrecoMedia(), "precoMedia");
        validarPreco(produto.getPrecoGrande(), "precoGrande");
    }

    // ============================================================
    // MÉTODO: validarPreco (Privado)
    // Criado para não repetir o mesmo bloco de código "if" três vezes.
    // Ele recebe o valor do preço e o nome do campo para montar 
    // a mensagem de erro de forma dinâmica.
    // ============================================================
    private void validarPreco(BigDecimal preco, String campo) {
        
        // Validação de Preço:
        // preco == null -> Verifica se enviaram o preço.
        // preco.compareTo(BigDecimal.ZERO) <= 0 -> Como estamos usando BigDecimal 
        // (ideal para dinheiro), não podemos usar "<= 0" diretamente. Usamos o '.compareTo'.
        // Isso verifica se o preço é zero ou negativo.
        if (preco == null || preco.compareTo(BigDecimal.ZERO) <= 0) {
            
            // Se cair aqui, gera um erro dinâmico. 
            // Exemplo: "precoGrande deve ser maior que zero."
            throw new IllegalArgumentException(campo + " deve ser maior que zero.");
        }
    }
}