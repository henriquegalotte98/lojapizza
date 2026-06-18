package com.pizzaria.loja.dto;

import com.pizzaria.loja.model.FormaPagamento;
import com.pizzaria.loja.model.TamanhoPizza;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class PedidoRequestDTO {
    private String telefone;
    private String nome; 
    private FormaPagamento formaPagamento;
    private LocalTime horarioRetirada;
    private String observacao;
    private List<ItemPedidoRequestDTO> itens;

    @Getter
    @Setter
    public static class ItemPedidoRequestDTO {
        private Long produtoId;
        private TamanhoPizza tamanho;
        private Integer quantidade;
    }
}