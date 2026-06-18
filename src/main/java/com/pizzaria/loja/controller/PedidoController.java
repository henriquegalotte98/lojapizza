package com.pizzaria.loja.controller;

import com.pizzaria.loja.dto.PedidoRequestDTO;
import com.pizzaria.loja.model.Pedido;
import com.pizzaria.loja.model.StatusPedido;
import com.pizzaria.loja.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) { this.pedidoService = pedidoService; }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() { return ResponseEntity.ok(pedidoService.listarTodos()); }

    @GetMapping("/cliente/{telefone}")
    public ResponseEntity<List<Pedido>> listarPorTelefone(@PathVariable String telefone) {
        return ResponseEntity.ok(pedidoService.buscarPorTelefone(telefone));
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@RequestBody PedidoRequestDTO dto) {
        return ResponseEntity.status(201).body(pedidoService.criarPedido(dto));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(@PathVariable Long id, @RequestParam StatusPedido status) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, status));
    }
}