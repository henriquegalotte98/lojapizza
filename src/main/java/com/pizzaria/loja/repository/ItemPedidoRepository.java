package com.pizzaria.loja.repository;

import com.pizzaria.loja.model.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;

// ============================================================
// INTERFACE ItemPedidoRepository
// Fornece comandos prontos de banco de dados para os Itens do Pedido.
// ============================================================
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
}