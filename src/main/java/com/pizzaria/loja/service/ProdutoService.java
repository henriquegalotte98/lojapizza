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
    // MÉTODO: atualizarProduto (PUT)
    //
    // Objetivo: Receber um ID e os novos dados de um produto,
    // e salvar as alterações no banco. Usado para editar nome,
    // descrição ou preços de uma pizza já cadastrada.
    //
    // Parâmetros:
    //   id              → o número do produto que queremos editar
    //                     (vem na URL: PUT /produtos/3)
    //   dadosAtualizados → objeto com os novos valores enviados
    //                     pelo Front-End no corpo (body) da requisição
    //
    // Por que não usar o .save() direto com o objeto recebido?
    //   → Porque o objeto que vem do Front-End não tem todos os campos
    //     (ex: não tem 'ativo', 'imagem', etc.). Se salvássemos ele direto,
    //     esses campos virariam null e perderíamos dados do banco!
    //   → A solução correta é: BUSCAR o produto original do banco,
    //     ATUALIZAR só os campos desejados, e aí sim SALVAR.
    // ============================================================
    public Produto atualizarProduto(Long id, Produto dadosAtualizados) {

        // Passo 1: Buscar o produto existente no banco pelo ID.
        //
        // produtoRepository.findById(id) → retorna um Optional<Produto>
        //   (pode ter um produto dentro, ou pode estar vazio)
        //
        // .orElseThrow(...) → se o Optional estiver vazio (produto não existe),
        //   lança automaticamente um erro com a mensagem informada.
        //   Isso evita tentar editar um produto que não existe no banco.
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        // Passo 2: Atualizar apenas os campos editáveis no objeto buscado do banco.
        // Fazemos isso campo a campo para não sobrescrever dados que não devem mudar
        // (como 'ativo', 'imagem', ou o próprio 'id').

        // Atualiza o nome da pizza (ex: "Calabresa" → "Calabresa Especial")
        produtoExistente.setNome(dadosAtualizados.getNome());

        // Atualiza a descrição dos ingredientes
        produtoExistente.setDescricao(dadosAtualizados.getDescricao());

        // Atualiza os três preços conforme o tamanho
        produtoExistente.setPrecoPequena(dadosAtualizados.getPrecoPequena());
        produtoExistente.setPrecoMedia(dadosAtualizados.getPrecoMedia());
        produtoExistente.setPrecoGrande(dadosAtualizados.getPrecoGrande());

        // Passo 3: Reaproveitar a validação que já existe nesta classe!
        // Não precisamos reescrever as regras (nome obrigatório, preço > 0).
        // É só chamar o mesmo método privado que o cadastrarProduto usa.
        // Se algo for inválido, o erro é lançado aqui e o save não acontece.
        validarProduto(produtoExistente); // Reaproveita sua validação da Sprint 2!

        // Passo 4: Salvar no banco de dados.
        // Como o produtoExistente já tem um ID (foi buscado do banco),
        // o .save() agora executa um UPDATE (não um INSERT).
        // O JPA é inteligente: se o objeto tem ID → UPDATE, se não tem → INSERT.
        return produtoRepository.save(produtoExistente);
    }

    // ============================================================
    // MÉTODO: deletarProduto (DELETE LÓGICO)
    //
    // Objetivo: "Desativar" um produto sem apagá-lo fisicamente do banco.
    //
    // Por que DELETE LÓGICO e não DELETE físico?
    //   → Se apagássemos o produto do banco com um DELETE real, todos os
    //     pedidos antigos que referenciam esse produto quebrariam!
    //     (o banco daria erro de "chave estrangeira não encontrada")
    //   → Com o delete lógico, o produto permanece no banco com ativo = false.
    //     Os pedidos antigos continuam intactos e completos no histórico.
    //   → Na listagem do cardápio, o findByAtivoTrue() já filtra automaticamente
    //     e não mostra produtos com ativo = false para o cliente.
    //
    // Parâmetros:
    //   id → número do produto que queremos desativar
    //        (vem na URL: DELETE /produtos/3)
    //
    // Retorno: void (não retorna nada — apenas executa a ação)
    // ============================================================
    public void deletarProduto(Long id) {

        // Passo 1: Buscar o produto no banco para confirmar que ele existe.
        // Se o ID informado não existir, o orElseThrow lança o erro aqui
        // e evitamos tentar desativar algo que não existe.
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

        // Passo 2: Em vez de deletar, apenas muda o campo 'ativo' para false.
        // É como "arquivar" o produto: ele some do cardápio, mas fica no banco.
        produto.setAtivo(false);

        // Passo 3: Salvar a alteração no banco.
        // O JPA executa: UPDATE produtos SET ativo = false WHERE id = ?
        produtoRepository.save(produto);
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
