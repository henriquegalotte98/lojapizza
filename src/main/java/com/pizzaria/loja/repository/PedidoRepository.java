package com.pizzaria.loja.repository;

import com.pizzaria.loja.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

// ============================================================
// INTERFACE PedidoRepository
// Fornece comandos prontos de banco de dados para os Pedidos.
// ============================================================
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}