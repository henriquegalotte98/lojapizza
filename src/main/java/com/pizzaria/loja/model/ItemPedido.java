package com.pizzaria.loja.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

// ============================================================
// ENTIDADE: ItemPedido
// Representa CADA PIZZA escolhida dentro de um pedido.
// ============================================================
@Entity
@Table(name = "itens_pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnore
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    // ============================================================
    // ATUALIZAÇÃO SPRINT 3: Agora usa o Enum TamanhoPizza 
    // em vez de String. O @Enumerated avisa ao banco de dados 
    // para salvar o texto "P", "M" ou "G".
    // ============================================================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private TamanhoPizza tamanho;

    // ============================================================
    // ATUALIZAÇÃO SPRINT 3: Novo campo Preço Unitário.
    // Exigência da apostila para copiar o preço no momento do pedido.
    // ============================================================
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoUnitario;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}