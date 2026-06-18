package com.pizzaria.loja.repository;

// ============================================================
// IMPORTS: Trazem a classe Cliente, os recursos do Spring Data JPA 
// e o utilitário Optional do próprio Java.
// ============================================================
import com.pizzaria.loja.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// ============================================================
// INTERFACE ClienteRepository
// O JpaRepository traz comandos prontos de banco de dados.
//
// <Cliente, Long>:
//  - Cliente -> Qual tabela (entidade) este repositório gerencia.
//  - Long    -> Qual é o tipo de dado da Chave Primária (@Id) do Cliente.
// ============================================================
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // ============================================================
    // MÉTODOS CUSTOMIZADOS (Query Methods)
    // O Spring lê o nome do método ("findBy" + NomeDaColuna) e gera o SQL.
    //
    // Por que Optional<Cliente>?
    // Como estamos buscando por um CPF ou Telefone específico, pode ser que 
    // o cliente não exista no banco. O Optional funciona como uma "caixinha":
    // ela pode vir com o cliente dentro, ou pode vir vazia. Isso evita os 
    // temidos erros de "NullPointerException" no Java.
    // ============================================================

    // Tradução automática para o banco: SELECT * FROM clientes WHERE cpf = ?
    Optional<Cliente> findByCpf(String cpf);

    // Tradução automática para o banco: SELECT * FROM clientes WHERE telefone = ?
    Optional<Cliente> findByTelefone(String telefone);
}

