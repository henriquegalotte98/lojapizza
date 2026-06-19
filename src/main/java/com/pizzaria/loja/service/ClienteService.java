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

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorTelefone(String telefone) {
        return clienteRepository.findByTelefone(telefone)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
    }

    public Cliente cadastrarCliente(Cliente cliente) {
        validar(cliente);
        if (cliente.getCpf() != null && !cliente.getCpf().isBlank()
                && clienteRepository.findByCpf(cliente.getCpf()).isPresent()) {
            throw new IllegalArgumentException("Já existe um cliente com este CPF.");
        }
        if (clienteRepository.findByTelefone(cliente.getTelefone()).isPresent()) {
            throw new IllegalArgumentException("Já existe um cliente com este telefone.");
        }
        return clienteRepository.save(cliente);
    }

    public Cliente buscarOuCadastrar(String telefone, String nome, String cpf) {
        return clienteRepository.findByTelefone(telefone).orElseGet(() -> {
            Cliente cliente = new Cliente();
            cliente.setTelefone(telefone);
            cliente.setNome(nome);
            cliente.setCpf(cpf == null || cpf.isBlank() ? null : cpf);
            return cadastrarCliente(cliente);
        });
    }

    private void validar(Cliente cliente) {
        if (cliente.getNome() == null || cliente.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome do cliente é obrigatório.");
        }
        if (cliente.getTelefone() == null || cliente.getTelefone().isBlank()) {
            throw new IllegalArgumentException("Telefone do cliente é obrigatório.");
        }
    }
}
