package com.pizzaria.loja.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

// ============================================================
// ENTIDADE: Pedido
// É a "capa" da compra. Contém quem comprou, a data e a lista de itens.
// ============================================================
@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================================
    // RELACIONAMENTO: N para 1 (Vários pedidos podem ser de UM cliente)
    // ============================================================
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime dataHoraPedido;

    @Column(nullable = false)
    private LocalTime horarioRetirada;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false, length = 20)
    private String formaPagamento;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    // ============================================================
    // CAMPO: Status (Foco da Sprint 3)
    // Armazena o andamento (Ex: AGUARDANDO, PREPARANDO, ENTREGUE).
    // ============================================================
    @Column(nullable = false, length = 20)
    private String status;

    // ============================================================
    // RELACIONAMENTO: 1 para N (UM Pedido tem MUITOS itens).
    // cascade = CascadeType.ALL -> Se eu mandar salvar o Pedido,
    // o Spring salva todos os itens automaticamente no banco!
    // ============================================================
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    // ============================================================
    // @PrePersist: Antes de salvar o pedido novo no banco pela
    // primeira vez, preenche a data atual e define o status inicial.
    // ============================================================
    @PrePersist
    public void preencherDadosIniciais() {
        this.dataHoraPedido = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDENTE";
        }
    }
}
