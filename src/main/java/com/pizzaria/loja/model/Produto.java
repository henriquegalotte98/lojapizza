package com.pizzaria.loja.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity // 1. Transforma a classe em uma tabela do banco de dados
@Table(name = "produtos") // 2. Define o nome da tabela no MySQL como "produtos"
@Getter // Lombok: Cria todos os Getters automaticamente
@Setter // Lombok: Cria todos os Setters automaticamente
@NoArgsConstructor // Lombok: Cria o construtor vazio obrigatório do Hibernate
@AllArgsConstructor // Lombok: Cria um construtor com todos os campos
public class Produto {

    @Id // 3. Define o ID como Chave Primária (PK)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 4. Define como Auto-Incremento no MySQL
    private Long id;

    @Column(nullable = false, length = 100) // 5. Nome obrigatório e com limite de 100 caracteres
    private String nome;

    @Column(columnDefinition = "TEXT") // 6. Permite textos longos para a descrição dos ingredientes
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2) // 7. Configura o preço para o formato 00.00
    private BigDecimal precoPequena;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoMedia;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoGrande;

    @Column(length = 255) // 8. Guarda o link ou caminho da imagem da pizza (limite de 255 caracteres)
    private String imagem;

    @Column(nullable = false) // 9. Define se a pizza está disponível no cardápio (true) ou não (false)
    private Boolean ativo;
}