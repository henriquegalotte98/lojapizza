package com.pizzaria.loja.repository;

// ============================================================
// IMPORTS: Trazem a classe Produto e os recursos do Spring Data JPA.
// ============================================================
import com.pizzaria.loja.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// ============================================================
// INTERFACE ProdutoRepository
// O JpaRepository é uma ferramenta do Spring que já traz dezenas de 
// comandos de banco de dados prontos (salvar, buscar, deletar, etc).
//
// <Produto, Long>:
//  - Produto -> Qual tabela (entidade) este repositório gerencia.
//  - Long    -> Qual é o tipo de dado da Chave Primária (@Id) do Produto.
// ============================================================
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // ============================================================
    // MÉTODO CUSTOMIZADO (Query Method)
    // O Spring lê as palavras do nome do método e escreve o SQL sozinho!
    // 
    // Tradução automática para o banco:
    // SELECT * FROM produtos WHERE ativo = true;
    //
    // Retorna uma lista contendo apenas as pizzas disponíveis.
    // ============================================================
    List<Produto> findByAtivoTrue();
}