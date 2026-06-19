package com.pizzaria.loja.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

// ============================================================
// DTO: PedidoDTO
// Formato principal do JSON que o Front-End vai enviar.
// Ex: { "clienteId": 1, "itens": [ { "produtoId": 2, "quantidade": 1, "tamanho": "G" } ] }
// ============================================================
@Getter
@Setter
public class PedidoDTO {
    private String telefone;
    private String nome;
    private String cpf;
    private String formaPagamento;
    private String observacao;
    private List<ItemPedidoDTO> itens;
}
