package com.pizzaria.loja.service;

import com.pizzaria.loja.model.Cliente;
import com.pizzaria.loja.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // ============================================================
    // MÉTODO: listarTodos
    // Retorna todos os clientes cadastrados no banco.
    // ============================================================
    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    // ============================================================
    // MÉTODO: cadastrarCliente
    // Valida se o CPF ou Telefone já existem antes de salvar.
    // ============================================================
    public Cliente cadastrarCliente(Cliente cliente) {
        
        // Verifica se já existe alguém com este CPF
        if (clienteRepository.findByCpf(cliente.getCpf()).isPresent()) {
            throw new IllegalArgumentException("Erro: Já existe um cliente cadastrado com este CPF.");
        }

        // Verifica se já existe alguém com este Telefone (caso tenha sido preenchido)
        if (cliente.getTelefone() != null && clienteRepository.findByTelefone(cliente.getTelefone()).isPresent()) {
            throw new IllegalArgumentException("Erro: Já existe um cliente cadastrado com este telefone.");
        }

        // Se passou pelas validações, salva no banco!
        return clienteRepository.save(cliente);
    }
}