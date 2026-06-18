package com.pizzaria.loja.repository;

import com.pizzaria.loja.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// ============================================================
// INTERFACE PedidoRepository
// Fornece comandos prontos de banco de dados para os Pedidos.
// ============================================================
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // ============================================================
    // MÉTODO CUSTOMIZADO (Sprint 3)
    // O Spring gera automaticamente o SQL para buscar todos os 
    // pedidos de um cliente baseando-se no telefone dele.
    // ============================================================
    List<Pedido> findByClienteTelefone(String telefone);
}