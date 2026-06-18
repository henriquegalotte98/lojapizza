// ===== js/api.js - Comunicação com o Backend =====

const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');

// ===== CONFIGURAÇÕES =====
function getHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// ===== AUTENTICAÇÃO =====
async function apiLogin(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            token = data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
}

function apiLogout() {
    token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// ===== CARDÁPIO =====
async function apiGetCardapio() {
    try {
        const response = await fetch(`${API_URL}/cardapio`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar cardápio:', error);
        throw error;
    }
}

// ===== PEDIDOS =====
async function apiGetPedidos(filtros = {}) {
    try {
        const params = new URLSearchParams(filtros);
        const response = await fetch(`${API_URL}/pedidos?${params}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
}

async function apiGetPedidosByTelefone(telefone) {
    try {
        const response = await fetch(`${API_URL}/pedidos/telefone/${encodeURIComponent(telefone)}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar pedidos por telefone:', error);
        throw error;
    }
}

async function apiCriarPedido(pedido) {
    try {
        const response = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        throw error;
    }
}

async function apiAtualizarStatusPedido(id, status) {
    try {
        const response = await fetch(`${API_URL}/pedidos/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status })
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
    }
}

async function apiGetStats() {
    try {
        const response = await fetch(`${API_URL}/pedidos/stats/dashboard`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
    }
}

// ===== FUNCIONÁRIOS =====
async function apiGetFuncionarios() {
    try {
        const response = await fetch(`${API_URL}/funcionarios`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
    }
}

async function apiAddFuncionario(funcionario) {
    try {
        const response = await fetch(`${API_URL}/funcionarios`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(funcionario)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
        throw error;
    }
}

async function apiDeleteFuncionario(id) {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao remover funcionário:', error);
        throw error;
    }
}

async function apiUpdateFuncionario(id, funcionario) {
    try {
        const response = await fetch(`${API_URL}/funcionarios/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(funcionario)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        throw error;
    }
}