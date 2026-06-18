package com.pizzaria.loja.service;

import com.pizzaria.loja.dto.PedidoRequestDTO;
import com.pizzaria.loja.model.*;
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
    // MÉTODO: buscarPorTelefone (Requisito da Sprint 3)
    // Permite que o cliente consulte os pedidos dele apenas digitando o telefone.
    // ============================================================
    public List<Pedido> buscarPorTelefone(String telefone) {
        return pedidoRepository.findByClienteTelefone(telefone);
    }

    // ============================================================
    // MÉTODO: criarPedido (Atualizado para Sprint 3)
    // Agora usa o PedidoRequestDTO e busca o cliente pelo telefone.
    // ============================================================
    public Pedido criarPedido(PedidoRequestDTO dto) {
        
        // 1. Regra de Negócio: Busca o cliente pelo Telefone.
        // Se o cliente NÃO existir no banco, o Spring cria um novo automaticamente 
        // usando o nome e o telefone que vieram no JSON.
        Cliente cliente = clienteRepository.findByTelefone(dto.getTelefone()).orElseGet(() -> {
            if (dto.getNome() == null || dto.getNome().trim().isEmpty()) {
                throw new IllegalArgumentException("Erro: Um cliente novo precisa informar o nome.");
            }
            Cliente novoCliente = new Cliente();
            novoCliente.setTelefone(dto.getTelefone());
            novoCliente.setNome(dto.getNome());
            return clienteRepository.save(novoCliente); // Salva o cliente novo antes de criar o pedido
        });

        // Valida se o carrinho não está vazio
        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new IllegalArgumentException("Erro: O pedido precisa de pelo menos um item.");
        }

        // 2. Inicia o pedido com os novos campos da Sprint 3
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setFormaPagamento(dto.getFormaPagamento());
        pedido.setHorarioRetirada(dto.getHorarioRetirada());
        pedido.setObservacao(dto.getObservacao());

        BigDecimal totalDoPedido = BigDecimal.ZERO;

        // 3. Processa cada item (pizza) do JSON
        for (PedidoRequestDTO.ItemPedidoRequestDTO itemDto : dto.getItens()) {
            
            if (itemDto.getQuantidade() <= 0) {
                throw new IllegalArgumentException("Erro: A quantidade de pizzas deve ser maior que zero.");
            }

            // Busca o produto real no banco para garantir o preço correto
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new IllegalArgumentException("Erro: Produto não encontrado."));

            // 4. Descobre qual preço cobrar usando o novo Enum TamanhoPizza
            BigDecimal precoUnitario = switch (itemDto.getTamanho()) {
                case P -> produto.getPrecoPequena();
                case M -> produto.getPrecoMedia();
                case G -> produto.getPrecoGrande();
            };

            // Calcula subtotal
            BigDecimal subtotal = precoUnitario.multiply(BigDecimal.valueOf(itemDto.getQuantidade()));
            
            // 5. Monta o item do pedido
            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDto.getQuantidade());
            item.setTamanho(itemDto.getTamanho()); // Agora recebe o Enum direto (TamanhoPizza.G)
            item.setPrecoUnitario(precoUnitario);
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
    // MÉTODO: atualizarStatus (Atualizado para Sprint 3)
    // Agora usa o Enum StatusPedido e tem validação para não voltar o status.
    // ============================================================
    public Pedido atualizarStatus(Long id, StatusPedido novoStatus) {
        
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Erro: Pedido não encontrado."));

        // Regra de Negócio: Não permite voltar o status para trás.
        // O '.ordinal()' pega o número do Enum (PENDENTE = 0, PRONTO = 1, ENTREGUE = 2).
        // Se o número do status atual for maior ou igual ao novo (ex: tentar ir de 1 para 0), ele bloqueia.
        // A única exceção é o NAO_VEIO, que pode ser acionado a qualquer momento.
        if (pedido.getStatus().ordinal() >= novoStatus.ordinal() && novoStatus != StatusPedido.NAO_VEIO) {
            throw new IllegalArgumentException("Erro: Não é permitido retroceder o status do pedido.");
        }

        // Atualiza e salva
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }
}