package com.pizzaria.loja.repository;

import com.pizzaria.loja.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByClienteTelefoneOrderByDataHoraPedidoDesc(String telefone);
}
