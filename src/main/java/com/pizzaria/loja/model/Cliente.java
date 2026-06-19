// ============================================================
// PACOTE: localização do arquivo dentro do projeto
// Caminho físico: src/main/java/com/pizzaria/loja/model/
// Deve ser IDÊNTICO ao pacote do Produto.java que já existe
// ============================================================
package com.pizzaria.loja.model;

// ============================================================
// IMPORTS JPA — usados para mapear a classe ao banco de dados   s
// O asterisco (*) importa tudo do pacote jakarta.persistence
// Inclui: @Entity, @Table, @Id, @GeneratedValue, @Column, @PrePersist
// ============================================================
import jakarta.persistence.*;

// ============================================================
// IMPORTS LOMBOK — geram código automaticamente em tempo de compilação
// O projeto já usa Lombok no Produto.java, então seguimos o mesmo padrão
// ============================================================
import lombok.Getter;             // Gera todos os métodos getNome(), getId(), etc.
import lombok.Setter;             // Gera todos os métodos setNome(), setId(), etc.
import lombok.NoArgsConstructor;  // Gera o construtor vazio: public Cliente() {}
import lombok.AllArgsConstructor; // Gera construtor com todos os campos como parâmetros

// ============================================================
// IMPORT para trabalhar com data e hora
// LocalDateTime armazena data + hora juntos: ex: 2025-06-17T14:30:00
// ============================================================
import java.time.LocalDateTime;

// ============================================================
// @Entity
// Instrução obrigatória para o JPA/Hibernate reconhecer esta classe
// como uma tabela do banco de dados MySQL.
// Sem isso, o Spring ignora completamente a classe.
// ============================================================
@Entity

// ============================================================
// @Table(name = "clientes")
// Define o nome EXATO da tabela que será criada no banco MySQL.
// Sem essa anotação, o Hibernate usaria "Cliente" (nome da classe).
// Com ela, a tabela se chamará "clientes" (minúsculo, plural).
// ============================================================
@Table(name = "clientes")

// ============================================================
// ANOTAÇÕES LOMBOK — seguindo o mesmo padrão do Produto.java
//
// @Getter         → gera automaticamente: getId(), getNome(),
//                   getTelefone(), getCpf(), getDataCadastro()
//
// @Setter         → gera automaticamente: setId(), setNome(),
//                   setTelefone(), setCpf(), setDataCadastro()
//
// @NoArgsConstructor  → gera: public Cliente() {}
//                       OBRIGATÓRIO para o Hibernate funcionar.
//                       O JPA precisa criar objetos vazios ao buscar dados.
//
// @AllArgsConstructor → gera um construtor com todos os campos:
//                       public Cliente(Long id, String nome, ...)
//                       Útil para criar objetos em testes ou manualmente.
// ============================================================
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    // ============================================================
    // CAMPO: id — Chave Primária da tabela
    //
    // Tipo Long: número inteiro grande (vai de -9 quintilhões a +9 quintilhões)
    //            ideal para IDs que crescem com o tempo
    //
    // @Id
    //   → marca este campo como PRIMARY KEY no banco de dados
    //
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    //   → delega a geração do ID para o banco de dados MySQL
    //   → o banco usa AUTO_INCREMENT: 1, 2, 3, 4...
    //   → nunca precisamos setar o id manualmente ao salvar um cliente
    // ============================================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================================
    // CAMPO: nome — Nome completo do cliente
    //
    // Tipo String: texto
    //
    // @Column:
    //   name = "nome"     → nome da coluna no banco (poderia omitir,
    //                        pois o Hibernate usa o nome do campo por padrão)
    //   nullable = false  → campo OBRIGATÓRIO — gera NOT NULL no banco
    //                        não é possível cadastrar um cliente sem nome
    //   length = 100      → gera VARCHAR(100) no MySQL
    //                        suporta nomes de até 100 caracteres
    // ============================================================
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    // ============================================================
    // CAMPO: telefone — Número de telefone do cliente
    //
    // Tipo String: usamos String (não int/long) porque:
    //   - Telefones têm zeros à esquerda: 048...
    //   - Podem ter formatação: (48) 99999-0000
    //   - Operações matemáticas não fazem sentido em telefones
    //
    // @Column:
    //   name = "telefone" → nome da coluna no banco
    //   length = 20       → VARCHAR(20) — espaço suficiente para
    //                        qualquer formato de telefone brasileiro
    //   (sem nullable=false pois telefone pode ser opcional)
    // ============================================================
    @Column(name = "telefone", length = 20, unique = true, nullable = false)
    private String telefone;

    // ============================================================
    // CAMPO: cpf — CPF do cliente
    //
    // Tipo String: usamos String porque CPF tem formatação: 000.000.000-00
    //   - Tem pontos e traço que seriam perdidos num número
    //   - Zeros à esquerda seriam ignorados em tipo numérico
    //
    // @Column:
    //   name = "cpf"      → nome da coluna no banco
    //   length = 12       → VARCHAR(12) conforme solicitado no enunciado
    //                        ⚠️ ATENÇÃO: se for salvar formatado (000.000.000-00),
    //                        aumente para 14. Se salvar só números (00000000000),
    //                        11 já é suficiente.
    //   unique = true     → UNIQUE no banco — nenhum CPF pode se repetir
    //                        garante que dois clientes não tenham o mesmo CPF
    //   nullable = false  → campo OBRIGATÓRIO — NOT NULL no banco
    // ============================================================
    @Column(name = "cpf", length = 14, unique = true)
    private String cpf;

    // ============================================================
    // CAMPO: dataCadastro — Data e hora em que o cliente foi cadastrado
    //
    // Tipo LocalDateTime: armazena data E hora juntos
    //   Exemplo de valor: 2025-06-17T14:30:00
    //   É o tipo moderno do Java para trabalhar com datas (desde Java 8)
    //
    // @Column:
    //   name = "dataCadastro"         → nome da coluna no banco
    //   columnDefinition = "DATETIME" → força o tipo DATETIME no MySQL
    //                                    (data + hora, sem fuso horário)
    //   updatable = false             → IMPORTANTE: após o primeiro INSERT,
    //                                   este campo nunca será alterado em UPDATEs
    //                                   preserva a data original de cadastro
    // ============================================================
    @Column(name = "dataCadastro", columnDefinition = "DATETIME", updatable = false)
    private LocalDateTime dataCadastro;

    // ============================================================
    // @PrePersist — Preenchimento automático da data de cadastro
    //
    // Este método é chamado pelo JPA/Hibernate automaticamente
    // ANTES de executar o INSERT no banco de dados (antes de salvar).
    //
    // Funciona assim:
    //   1. Você cria um objeto Cliente e chama clienteRepository.save(cliente)
    //   2. O JPA, antes de fazer o INSERT, executa este método
    //   3. O dataCadastro é preenchido com a data/hora atual
    //   4. Aí sim o INSERT é executado com a data já preenchida
    //
    // Resultado: nunca precisamos setar a data manualmente no código!
    // ============================================================
    @PrePersist
    public void preencherDataCadastro() {
        // LocalDateTime.now() captura a data e hora exata do momento do cadastro
        // Exemplo: se salvar às 14h30 do dia 17/06/2025 → "2025-06-17T14:30:00"
        this.dataCadastro = LocalDateTime.now();
    }

    // ============================================================
    // NOTA SOBRE GETTERS E SETTERS:
    //
    // Diferente de código sem Lombok, NÃO precisamos escrever:
    //   public Long getId() { return id; }
    //   public void setId(Long id) { this.id = id; }
    //   ... e assim para cada campo ...
    //
    // As anotações @Getter e @Setter do Lombok fazem isso automaticamente
    // durante a compilação. O resultado final é o mesmo, mas o código
    // fica muito mais limpo e fácil de manter.
    //
    // Isso é o mesmo padrão que o Produto.java já usa neste projeto!
    // ============================================================
}
