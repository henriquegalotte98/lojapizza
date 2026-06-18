// ============================================================
// PACOTE: onde este arquivo mora dentro do projeto
// Caminho físico: src/main/java/com/pizzaria/loja/dto/
//
// "dto" é uma pasta separada de "model" porque DTOs não são
// tabelas do banco — eles são apenas moldes para receber dados
// ============================================================
package com.pizzaria.loja.dto;

// ============================================================
// IMPORTS LOMBOK
// O projeto já usa Lombok em toda parte (Cliente, Produto, etc.)
// Aqui usamos só @Getter e @Setter pois DTO não precisa de
// @Entity, @NoArgsConstructor ou @AllArgsConstructor
// ============================================================
import lombok.Getter; // Gera automaticamente: getProdutoId(), getQuantidade(), getTamanho()
import lombok.Setter; // Gera automaticamente: setProdutoId(), setQuantidade(), setTamanho()

// ============================================================
// O QUE É UM DTO? (Data Transfer Object)
//
// DTO = "Objeto de Transferência de Dados"
// É um molde simples que define o FORMATO do JSON que chega do Front-End.
//
// Sem DTO, o Front-End teria que enviar os dados exatamente iguais
// à entidade do banco (ex: Produto inteiro). Com DTO, definimos
// exatamente só o que queremos receber — nada mais, nada menos.
//
// Exemplo de JSON que este DTO representa:
// {
//   "produtoId": 2,
//   "quantidade": 1,
//   "tamanho": "G"
// }
//
// Este DTO representa UM item dentro de um pedido.
// Ex: "1 pizza Grande de Calabresa"
// ============================================================
@Getter
@Setter
public class ItemPedidoDTO {

    // ============================================================
    // CAMPO: produtoId
    //
    // Tipo Long: mesmo tipo do @Id da entidade Produto
    //
    // Por que não enviamos o Produto inteiro?
    //   → Porque o Front-End só precisa dizer QUAL pizza foi escolhida.
    //     Mandar o objeto Produto completo (com nome, preço, descrição...)
    //     seria desnecessário e arriscado.
    //   → Com o ID, o Back-End busca o Produto no banco e pega o resto.
    //
    // Exemplo no JSON: "produtoId": 2
    //   → significa que o cliente pediu a pizza de ID 2 no banco
    // ============================================================
    private Long produtoId;

    // ============================================================
    // CAMPO: quantidade
    //
    // Tipo Integer: número inteiro (sem casas decimais)
    //   Ninguém pede 1.5 pizza, então int faz sentido aqui.
    //   Integer (com I maiúsculo) é o "wrapper" do int primitivo —
    //   a diferença é que Integer pode ser null, int não pode.
    //
    // Exemplo no JSON: "quantidade": 2
    //   → o cliente quer 2 unidades desta pizza
    // ============================================================
    private Integer quantidade;

    // ============================================================
    // CAMPO: tamanho
    //
    // Tipo String: texto livre que vai receber "P", "M" ou "G"
    //   P = Pequena
    //   M = Média
    //   G = Grande
    //
    // Por que String e não um Enum?
    //   → String é mais simples para começar e o Front-End envia
    //     facilmente como texto no JSON.
    //   → No futuro poderíamos trocar por Enum para mais segurança.
    //
    // Exemplo no JSON: "tamanho": "G"
    //   → o cliente quer tamanho Grande
    //
    // O Service vai usar este valor para calcular o preço correto:
    //   "P" → produto.getPrecoPequena()
    //   "M" → produto.getPrecoMedia()
    //   "G" → produto.getPrecoGrande()
    // ============================================================
    private String tamanho; // Vai receber "P", "M" ou "G"
}
