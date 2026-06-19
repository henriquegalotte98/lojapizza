package com.pizzaria.loja.service;

import com.pizzaria.loja.dto.ItemPedidoDTO;
import com.pizzaria.loja.dto.PedidoDTO;
import com.pizzaria.loja.model.*;
import com.pizzaria.loja.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;

@Service
public class PedidoService {
    private static final List<String> STATUS = List.of("PENDENTE", "PRONTO", "ENTREGUE");
    private final PedidoRepository pedidoRepository;
    private final ClienteService clienteService;
    private final ProdutoService produtoService;

    public PedidoService(PedidoRepository pedidoRepository, ClienteService clienteService,
                         ProdutoService produtoService) {
        this.pedidoRepository = pedidoRepository;
        this.clienteService = clienteService;
        this.produtoService = produtoService;
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPorTelefone(String telefone) {
        return pedidoRepository.findByClienteTelefoneOrderByDataHoraPedidoDesc(telefone);
    }

    @Transactional
    public Pedido criar(PedidoDTO dto) {
        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new IllegalArgumentException("O pedido deve possuir pelo menos um item.");
        }
        Cliente cliente = clienteService.buscarOuCadastrar(dto.getTelefone(), dto.getNome(), dto.getCpf());
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        try {
            pedido.setHorarioRetirada(LocalTime.parse(dto.getHorarioRetirada()));
        } catch (Exception erro) {
            throw new IllegalArgumentException("Horário de retirada inválido.");
        }
        pedido.setFormaPagamento(validarPagamento(dto.getFormaPagamento()));
        pedido.setObservacao(dto.getObservacao());

        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedidoDTO itemDto : dto.getItens()) {
            ItemPedido item = criarItem(itemDto, pedido);
            pedido.getItens().add(item);
            total = total.add(item.getSubtotal());
        }
        pedido.setValorTotal(total);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido atualizarStatus(Long id, String novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado."));
        String status = novoStatus == null ? "" : novoStatus.toUpperCase(Locale.ROOT);
        boolean naoVeio = "PRONTO".equals(pedido.getStatus()) && "NAO_VEIO".equals(status);
        int atual = STATUS.indexOf(pedido.getStatus());
        int proximo = STATUS.indexOf(status);
        if (!naoVeio && proximo != atual + 1) {
            throw new IllegalArgumentException("Não é permitido pular ou voltar status.");
        }
        pedido.setStatus(status);
        return pedidoRepository.save(pedido);
    }

    private ItemPedido criarItem(ItemPedidoDTO dto, Pedido pedido) {
        if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser maior que zero.");
        }
        Produto produto = produtoService.buscarPorId(dto.getProdutoId());
        if (!Boolean.TRUE.equals(produto.getAtivo())) {
            throw new IllegalArgumentException("Produto inativo não pode ser pedido.");
        }
        String tamanho = dto.getTamanho() == null ? "" : dto.getTamanho().toUpperCase(Locale.ROOT);
        BigDecimal preco = switch (tamanho) {
            case "P" -> produto.getPrecoPequena();
            case "M" -> produto.getPrecoMedia();
            case "G" -> produto.getPrecoGrande();
            default -> throw new IllegalArgumentException("O tamanho deve ser P, M ou G.");
        };
        ItemPedido item = new ItemPedido();
        item.setPedido(pedido);
        item.setProduto(produto);
        item.setQuantidade(dto.getQuantidade());
        item.setTamanho(tamanho);
        item.setPrecoUnitario(preco);
        item.setSubtotal(preco.multiply(BigDecimal.valueOf(dto.getQuantidade())));
        return item;
    }

    private String validarPagamento(String forma) {
        String valor = forma == null ? "" : forma.toUpperCase(Locale.ROOT);
        if (!List.of("PIX", "DINHEIRO", "CARTAO").contains(valor)) {
            throw new IllegalArgumentException("Forma de pagamento inválida.");
        }
        return valor;
    }
}
