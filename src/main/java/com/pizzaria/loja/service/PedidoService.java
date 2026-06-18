package com.pizzaria.loja.service;

import com.pizzaria.loja.dto.ItemPedidoDTO;
import com.pizzaria.loja.dto.PedidoDTO;
import com.pizzaria.loja.model.Cliente;
import com.pizzaria.loja.model.ItemPedido;
import com.pizzaria.loja.model.Pedido;
import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.repository.ClienteRepository;
import com.pizzaria.loja.repository.PedidoRepository;
import com.pizzaria.loja.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, 
                         ClienteRepository clienteRepository, 
                         ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    // ============================================================
    // MÉTODO: cadastrarPedido
    // Transforma o DTO (que veio da internet) em um Pedido real.
    // ============================================================
    public Pedido cadastrarPedido(PedidoDTO dto) {
        
        // 1. Busca o cliente no banco pelo ID
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new IllegalArgumentException("Erro: Cliente não encontrado."));

        // 2. Inicia um pedido vazio e atrela o cliente a ele
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        
        BigDecimal totalDoPedido = BigDecimal.ZERO;

        // 3. Processa cada item (pizza) do JSON
        for (ItemPedidoDTO itemDto : dto.getItens()) {
            
            // Busca o produto real no banco (não confiamos no preço do front-end)
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new IllegalArgumentException("Erro: Produto não encontrado."));

            // 4. Descobre qual preço cobrar
            BigDecimal precoUnitario;
            switch (itemDto.getTamanho().toUpperCase()) {
                case "P": precoUnitario = produto.getPrecoPequena(); break;
                case "M": precoUnitario = produto.getPrecoMedia(); break;
                case "G": precoUnitario = produto.getPrecoGrande(); break;
                default: throw new IllegalArgumentException("Erro: Tamanho inválido. Use P, M ou G.");
            }

            // Calcula subtotal
            BigDecimal subtotal = precoUnitario.multiply(BigDecimal.valueOf(itemDto.getQuantidade()));
            
            // 5. Monta o item do pedido
            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setTamanho(itemDto.getTamanho().toUpperCase());
            item.setSubtotal(subtotal);

            // Adiciona o item na lista do pedido
            pedido.getItens().add(item);
            totalDoPedido = totalDoPedido.add(subtotal);
        }

        // 6. Finaliza o pedido e salva no banco
        pedido.setValorTotal(totalDoPedido);
        return pedidoRepository.save(pedido);
    }

    // ============================================================
    // MÉTODO: atualizarStatus
    // Permite que o restaurante mude o status do pedido em andamento.
    // ============================================================
    public Pedido atualizarStatus(Long id, String novoStatus) {
        // 1. Busca o pedido pelo ID. Se não achar, lança erro.
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Erro: Pedido não encontrado."));

        // 2. Atualiza o campo de status e salva no banco
        pedido.setStatus(novoStatus.toUpperCase());
        return pedidoRepository.save(pedido);
    }
}