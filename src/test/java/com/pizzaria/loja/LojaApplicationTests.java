package com.pizzaria.loja;

import com.pizzaria.loja.dto.ItemPedidoDTO;
import com.pizzaria.loja.dto.PedidoDTO;
import com.pizzaria.loja.model.Pedido;
import com.pizzaria.loja.model.Produto;
import com.pizzaria.loja.repository.ProdutoRepository;
import com.pizzaria.loja.service.PedidoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class LojaApplicationTests {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private PedidoService pedidoService;

    @Test
    void contextLoads() {
    }

    @Test
    @Transactional
    void deveCriarPedidoComPrevisaoDefinidaPelaPizzaria() {
        Produto produto = new Produto();
        produto.setNome("Pizza de teste");
        produto.setDescricao("Criada apenas durante o teste");
        produto.setPrecoPequena(new BigDecimal("20.00"));
        produto.setPrecoMedia(new BigDecimal("30.00"));
        produto.setPrecoGrande(new BigDecimal("40.00"));
        produto.setAtivo(true);
        produto = produtoRepository.save(produto);

        ItemPedidoDTO item = new ItemPedidoDTO();
        item.setProdutoId(produto.getId());
        item.setTamanho("M");
        item.setQuantidade(2);

        PedidoDTO pedidoDTO = new PedidoDTO();
        pedidoDTO.setNome("Cliente de teste");
        pedidoDTO.setTelefone("48999999998");
        pedidoDTO.setFormaPagamento("PIX");
        pedidoDTO.setItens(List.of(item));

        Pedido pedido = pedidoService.criar(pedidoDTO);

        assertNotNull(pedido.getId());
        assertNotNull(pedido.getHorarioRetirada());
        assertEquals(40, pedido.getTempoPreparoMinutos());
        assertEquals(new BigDecimal("60.00"), pedido.getValorTotal());
        assertEquals("PENDENTE", pedido.getStatus());
    }
}
