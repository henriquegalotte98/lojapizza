java 
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

    // ============================================================
    // RELACIONAMENTO: N para 1 (Muitos itens pertencem a UM pedido)
    // @JsonIgnore: Extremamente importante! Evita que o Java entre 
    // em um loop infinito ao tentar transformar Pedido em JSON.
    // ============================================================
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    @JsonIgnore
    private Pedido pedido;

    // ============================================================
    // RELACIONAMENTO: N para 1 (Este item aponta para UM Produto do cardápio)
    // ============================================================
    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade;

    // ============================================================
    // CAMPO: tamanho
    // Guarda se o cliente pediu P, M ou G para sabermos qual preço cobrar.
    // ============================================================
    @Column(nullable = false, length = 1)
    private String tamanho;

    // ============================================================
    // CAMPO: subtotal
    // Guarda o valor de (Preço do Tamanho * Quantidade)
    // ============================================================
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
