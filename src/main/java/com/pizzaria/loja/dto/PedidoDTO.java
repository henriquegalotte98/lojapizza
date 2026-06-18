// ============================================================
// PACOTE: onde este arquivo mora dentro do projeto
// Caminho físico: src/main/java/com/pizzaria/loja/dto/
// Mesmo pacote do ItemPedidoDTO — ficam juntos na pasta dto/
// ============================================================
package com.pizzaria.loja.dto;

// ============================================================
// IMPORTS LOMBOK — mesmo padrão do restante do projeto
// ============================================================
import lombok.Getter; // Gera: getClienteId(), getItens()
import lombok.Setter; // Gera: setClienteId(), setItens()

// ============================================================
// IMPORT List — necessário para guardar múltiplos ItemPedidoDTO
// List é uma interface do Java que representa uma lista ordenada
// de elementos. Importamos do pacote java.util (utilitários Java)
// ============================================================
import java.util.List;

// ============================================================
// O QUE É ESTE DTO?
//
// PedidoDTO é o "envelope" principal que chega do Front-End
// quando um cliente finaliza um pedido.
//
// Ele contém:
//   1. O ID do cliente que está fazendo o pedido
//   2. A lista de itens pedidos (cada um é um ItemPedidoDTO)
//
// Exemplo COMPLETO do JSON que este DTO representa:
// {
//   "clienteId": 1,
//   "itens": [
//     { "produtoId": 2, "quantidade": 1, "tamanho": "G" },
//     { "produtoId": 5, "quantidade": 2, "tamanho": "M" }
//   ]
// }
//
// Tradução: "O cliente de ID 1 quer:
//            - 1 pizza Grande (produto ID 2)
//            - 2 pizzas Médias (produto ID 5)"
//
// RELAÇÃO entre os dois DTOs:
//   PedidoDTO          →  contém uma lista de  →  ItemPedidoDTO
//   (o pedido todo)                               (cada pizza escolhida)
// ============================================================
@Getter
@Setter
public class PedidoDTO {

    // ============================================================
    // CAMPO: clienteId
    //
    // Tipo Long: mesmo tipo do @Id da entidade Cliente
    //
    // Por que não enviamos o Cliente inteiro?
    //   → Pelo mesmo motivo do produtoId no ItemPedidoDTO:
    //     o Front-End só precisa informar QUEM está pedindo.
    //   → O Back-End busca o Cliente completo no banco pelo ID.
    //   → Isso evita que dados sensíveis do cliente (CPF, etc.)
    //     fiquem trafegando desnecessariamente na requisição.
    //
    // Exemplo no JSON: "clienteId": 1
    //   → o pedido pertence ao cliente de ID 1 no banco
    // ============================================================
    private Long clienteId;

    // ============================================================
    // CAMPO: itens
    //
    // Tipo List<ItemPedidoDTO>: uma lista de objetos ItemPedidoDTO
    //
    // Por que List?
    //   → Um pedido pode ter VÁRIOS itens (várias pizzas diferentes).
    //     Não faria sentido ter um campo separado para cada pizza.
    //   → List permite zero, um ou muitos itens na mesma requisição.
    //
    // Como o Spring processa isso?
    //   → O @RequestBody no Controller converte automaticamente:
    //     O array JSON  [ {...}, {...} ]
    //     vira uma      List<ItemPedidoDTO> no Java
    //
    // Como usar no Service (exemplo futuro):
    //   for (ItemPedidoDTO item : pedidoDTO.getItens()) {
    //       Long produtoId = item.getProdutoId();    // qual pizza
    //       Integer qtd   = item.getQuantidade();    // quantas unidades
    //       String tamanho = item.getTamanho();      // qual tamanho
    //       // calcular preço, criar ItemPedido, etc.
    //   }
    //
    // Exemplo no JSON: "itens": [ {...}, {...} ]
    //   → array com cada pizza que o cliente pediu
    // ============================================================
    private List<ItemPedidoDTO> itens;
}
