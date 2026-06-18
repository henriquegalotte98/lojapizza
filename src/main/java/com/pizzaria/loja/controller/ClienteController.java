package com.pizzaria.loja.controller;

// ============================================================
// IMPORTS: Trazem as classes do seu projeto (Model e Service) e as 
// anotações da biblioteca Spring Web para lidar com requisições HTTP.
// ============================================================
import com.pizzaria.loja.model.Cliente;
import com.pizzaria.loja.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============================================================
// @RestController
// Diz ao Spring que esta classe é um Controlador REST. 
// Isso significa que ela vai receber requisições HTTP e devolver 
// dados puros (geralmente em formato JSON), e não páginas HTML.
//
// @RequestMapping("/clientes")
// Define o endereço (URL) base para todos os métodos desta classe.
// Ou seja, tudo aqui será acessado através de: http://localhost:8080/clientes
// ============================================================
@RestController
@RequestMapping("/clientes")
public class ClienteController {

    // ============================================================
    // INJEÇÃO DE DEPENDÊNCIA
    // O Controller não deve ter regras de negócio (validações).
    // O trabalho dele é só receber a requisição e passar a "bola" 
    // para o Service fazer o trabalho pesado.
    // ============================================================
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // ============================================================
    // @GetMapping
    // Mapeia requisições HTTP do tipo GET (usadas para buscar dados).
    // Acessado em: GET http://localhost:8080/clientes
    //
    // ResponseEntity: É uma classe do Spring usada para montar a 
    // resposta HTTP completa (Status Code + Corpo da resposta).
    // O ".ok()" gera automaticamente o status "200 OK" (Sucesso).
    // ============================================================
    @GetMapping
    public ResponseEntity<List<Cliente>> listar() {
        return ResponseEntity.ok(clienteService.listarTodos());
    }

    // ============================================================
    // @PostMapping
    // Mapeia requisições HTTP do tipo POST (usadas para criar/enviar dados).
    // Acessado em: POST http://localhost:8080/clientes
    //
    // @RequestBody: Pega o JSON que o usuário enviou no "corpo" da 
    // requisição e transforma magicamente em um objeto Java (Cliente).
    // ============================================================
    @PostMapping
    public ResponseEntity<Cliente> cadastrar(@RequestBody Cliente cliente) {
        
        // Manda o Service tentar salvar o cliente (com as validações dele)
        Cliente clienteSalvo = clienteService.cadastrarCliente(cliente);
        
        // ".status(201)" significa "201 Created" (Criado com sucesso).
        // ".body()" envia de volta os dados do cliente recém-salvo (agora com ID).
        return ResponseEntity.status(201).body(clienteSalvo);
    }
}