package com.pizzaria.loja.controller;

import com.pizzaria.loja.dto.PedidoDTO;
import com.pizzaria.loja.model.Pedido;
import com.pizzaria.loja.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listar() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/cliente/{telefone}")
    public ResponseEntity<List<Pedido>> listarPorTelefone(@PathVariable String telefone) {
        return ResponseEntity.ok(pedidoService.listarPorTelefone(telefone));
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@RequestBody PedidoDTO pedido) {
        return ResponseEntity.status(201).body(pedidoService.criar(pedido));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(@PathVariable Long id,
                                                  @RequestBody Map<String, String> corpo) {
        return ResponseEntity.ok(pedidoService.atualizarStatus(id, corpo.get("status")));
    }
}
