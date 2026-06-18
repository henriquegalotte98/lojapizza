// ===== SCRIPT.JS - VERSÃO CONECTADA AO MYSQL =====

// ===== VARIÁVEIS GLOBAIS =====
let carrinho = [];
let categoriaAtual = 'todas';

// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
const navLinks = document.querySelectorAll('.nav-menu a[data-page]');
const pages = {
    home: document.getElementById('page-home'),
    cardapio: document.getElementById('page-cardapio'),
    carrinho: document.getElementById('page-carrinho'),
    finalizar: document.getElementById('page-finalizar'),
    'meus-pedidos': document.getElementById('page-meus-pedidos'),
    funcionarios: document.getElementById('page-funcionarios'),
    contato: document.getElementById('page-contato')
};

function navigateTo(pageId) {
    Object.values(pages).forEach(p => {
        if (p) p.classList.remove('active');
    });
    
    if (pages[pageId]) {
        pages[pageId].classList.add('active');
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
            navigateTo(page);
        }
    });
});

document.getElementById('btnFuncionarios').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('funcionarios');
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
});

document.getElementById('cartIcon').addEventListener('click', () => {
    navigateTo('carrinho');
    renderCarrinho();
});

// ===== RENDER CARDÁPIO =====
async function renderCardapio(categoria = 'todas', searchTerm = '', orderBy = '') {
    const grid = document.getElementById('cardapioGrid');
    if (!grid) return;
    
    try {
        // Buscar dados do backend
        let itens = await apiGetCardapio();
        
        // Filtrar por categoria
        if (categoria !== 'todas') {
            itens = itens.filter(item => item.categoria === categoria);
        }
        
        // Filtrar por pesquisa
        if (searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            itens = itens.filter(item => 
                item.nome.toLowerCase().includes(term) || 
                (item.descricao && item.descricao.toLowerCase().includes(term))
            );
        }
        
        // Ordenar
        if (orderBy === 'preco-asc') {
            itens.sort((a, b) => parseFloat(a.preco) - parseFloat(b.preco));
        } else if (orderBy === 'preco-desc') {
            itens.sort((a, b) => parseFloat(b.preco) - parseFloat(a.preco));
        } else if (orderBy === 'nome') {
            itens.sort((a, b) => a.nome.localeCompare(b.nome));
        }
        
        if (itens.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1; text-align:center; padding:3rem;">
                    <i class="fas fa-search" style="font-size:3rem; color:#c4b5a5; margin-bottom:1rem;"></i>
                    <p style="font-size:1.2rem; color:#7a5f4a;">Nenhum item encontrado.</p>
                    <p style="color:#c4b5a5;">Tente ajustar seus filtros ou termos de busca.</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = itens.map((item, index) => `
            <div class="cardapio-item" data-id="${item.id}" style="animation-delay: ${index * 0.05}s">
                <h3>${item.nome}</h3>
                <span class="categoria-badge">${item.categoria}</span>
                <p>${item.descricao || ''}</p>
                <p class="preco">R$ ${Number(item.preco).toFixed(2)}</p>
                <button class="btn-comprar" data-id="${item.id}">
                    <i class="fas fa-plus"></i> Adicionar
                </button>
            </div>
        `).join('');
        
        grid.querySelectorAll('.btn-comprar').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                adicionarAoCarrinho(id);
                this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
                this.style.background = '#2ecc71';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-plus"></i> Adicionar';
                    this.style.background = '';
                }, 1500);
            });
        });
    } catch (error) {
        console.error('Erro ao renderizar cardápio:', error);
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:#e74c3c; margin-bottom:1rem;"></i>
                <p style="font-size:1.2rem; color:#7a5f4a;">Erro ao carregar cardápio!</p>
                <p style="color:#c4b5a5;">Verifique se o backend está rodando.</p>
                <button onclick="renderCardapio()" class="btn" style="margin-top:1rem;">
                    <i class="fas fa-sync"></i> Tentar novamente
                </button>
            </div>
        `;
    }
}

// ===== CONTROLES DO CARDÁPIO =====
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const searchInput = document.getElementById('searchCardapio');
        const orderSelect = document.getElementById('orderCardapio');
        renderCardapio(
            this.dataset.categoria, 
            searchInput ? searchInput.value : '',
            orderSelect ? orderSelect.value : ''
        );
    });
});

document.getElementById('searchCardapio')?.addEventListener('input', function() {
    const activeFilter = document.querySelector('.filtro-btn.active');
    const categoria = activeFilter ? activeFilter.dataset.categoria : 'todas';
    const orderSelect = document.getElementById('orderCardapio');
    renderCardapio(categoria, this.value, orderSelect ? orderSelect.value : '');
});

document.getElementById('orderCardapio')?.addEventListener('change', function() {
    const activeFilter = document.querySelector('.filtro-btn.active');
    const categoria = activeFilter ? activeFilter.dataset.categoria : 'todas';
    const searchInput = document.getElementById('searchCardapio');
    renderCardapio(categoria, searchInput ? searchInput.value : '', this.value);
});

// ===== CARRINHO =====
function adicionarAoCarrinho(id) {
    // Buscar o item do cardápio (usando dados já carregados)
    const itens = document.querySelectorAll('.cardapio-item');
    let itemEncontrado = null;
    let precoItem = 0;
    let nomeItem = '';
    let categoriaItem = '';
    
    itens.forEach(el => {
        if (parseInt(el.dataset.id) === id) {
            const nome = el.querySelector('h3')?.textContent || '';
            const precoText = el.querySelector('.preco')?.textContent || 'R$ 0,00';
            const preco = parseFloat(precoText.replace('R$ ', '').replace(',', '.'));
            const categoria = el.querySelector('.categoria-badge')?.textContent || '';
            itemEncontrado = { id, nome, preco, categoria };
        }
    });
    
    if (!itemEncontrado) {
        // Fallback: buscar do array de dados se disponível
        const item = window.cardapio?.find(p => p.id === id);
        if (item) {
            itemEncontrado = { id: item.id, nome: item.nome, preco: item.preco, categoria: item.categoria };
        } else {
            mostrarNotificacao('Item não encontrado!', 'error');
            return;
        }
    }
    
    const existing = carrinho.find(c => c.id === id);
    if (existing) {
        existing.quantidade++;
    } else {
        carrinho.push({
            id: itemEncontrado.id,
            nome: itemEncontrado.nome,
            preco: itemEncontrado.preco,
            categoria: itemEncontrado.categoria,
            quantidade: 1
        });
    }
    
    updateCartCount();
    renderCarrinho();
    mostrarNotificacao(`${itemEncontrado.nome} adicionado ao carrinho!`, 'success');
}

function updateCartCount() {
    const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = total;
        countElement.style.display = total > 0 ? 'inline' : 'none';
        if (total > 0) {
            countElement.style.animation = 'pulse 0.3s ease';
            setTimeout(() => { countElement.style.animation = ''; }, 300);
        }
    }
}

function renderCarrinho() {
    const vazio = document.getElementById('carrinhoVazio');
    const cheio = document.getElementById('carrinhoCheio');
    const container = document.getElementById('carrinhoItems');
    const totalSpan = document.getElementById('carrinhoTotal');
    
    if (!vazio || !cheio || !container || !totalSpan) return;
    
    if (carrinho.length === 0) {
        vazio.style.display = 'block';
        cheio.style.display = 'none';
        return;
    }
    
    vazio.style.display = 'none';
    cheio.style.display = 'block';
    
    container.innerHTML = carrinho.map((item, index) => `
        <div class="carrinho-item" style="animation-delay: ${index * 0.05}s">
            <div class="carrinho-item-info">
                <h4>${item.nome}</h4>
                <p>R$ ${Number(item.preco).toFixed(2)}</p>
            </div>
            <div class="carrinho-item-qtd">
                <button onclick="alterarQtd(${item.id}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQtd(${item.id}, 1)">+</button>
            </div>
            <div class="carrinho-item-preco">
                R$ ${(item.preco * item.quantidade).toFixed(2)}
            </div>
            <button class="carrinho-item-remove" onclick="removerItemCarrinho(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

function alterarQtd(id, delta) {
    const item = carrinho.find(c => c.id === id);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(c => c.id !== id);
        }
        updateCartCount();
        renderCarrinho();
    }
}

function removerItemCarrinho(id) {
    carrinho = carrinho.filter(c => c.id !== id);
    updateCartCount();
    renderCarrinho();
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notif = document.createElement('div');
    notif.className = `notificacao ${tipo}`;
    notif.textContent = mensagem;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateX(50px)';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== BOTÕES DO CARRINHO =====
document.getElementById('btnLimparCarrinho')?.addEventListener('click', () => {
    if (carrinho.length === 0) return;
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        carrinho = [];
        updateCartCount();
        renderCarrinho();
        mostrarNotificacao('Carrinho limpo!', 'warning');
    }
});

document.getElementById('btnFinalizarPedido')?.addEventListener('click', () => {
    if (carrinho.length === 0) {
        mostrarNotificacao('Seu carrinho está vazio!', 'error');
        return;
    }
    navigateTo('finalizar');
    renderFinalizar();
});

// ===== FINALIZAR PEDIDO =====
function renderFinalizar() {
    const container = document.getElementById('finalizarItems');
    const totalSpan = document.getElementById('finalizarTotal');
    if (!container || !totalSpan) return;
    
    container.innerHTML = carrinho.map(item => `
        <div class="finalizar-item">
            <span>${item.nome} x${item.quantidade}</span>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

document.querySelector('[data-page="carrinho"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('carrinho');
});

document.getElementById('formFinalizar')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('clienteNome').value.trim();
    const telefone = document.getElementById('clienteTelefone').value.trim();
    const endereco = document.getElementById('clienteEndereco').value.trim();
    const pagamento = document.getElementById('formaPagamento').value;
    const observacoes = document.getElementById('observacoes').value.trim();
    
    if (!nome || !telefone || !endereco || !pagamento) {
        mostrarNotificacao('Preencha todos os campos obrigatórios!', 'error');
        return;
    }
    
    try {
        const pedido = {
            cliente: nome,
            telefone: telefone,
            endereco: endereco,
            formaPagamento: pagamento,
            observacoes: observacoes,
            itens: carrinho.map(item => ({
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0)
        };
        
        const result = await apiCriarPedido(pedido);
        
        if (result && result.id) {
            carrinho = [];
            updateCartCount();
            renderCarrinho();
            mostrarNotificacao('✅ Pedido realizado com sucesso!', 'success');
            navigateTo('meus-pedidos');
            document.getElementById('consultaTelefone').value = telefone;
            await consultarPedidos(telefone);
            document.getElementById('formFinalizar').reset();
        } else {
            mostrarNotificacao('Erro ao criar pedido!', 'error');
        }
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        mostrarNotificacao('Erro ao processar pedido!', 'error');
    }
});

// ===== MEUS PEDIDOS =====
document.getElementById('formConsultaTelefone')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const telefone = document.getElementById('consultaTelefone').value.trim();
    if (!telefone) {
        mostrarNotificacao('Digite um telefone para consultar!', 'warning');
        return;
    }
    await consultarPedidos(telefone);
});

async function consultarPedidos(telefone) {
    const lista = document.getElementById('pedidosLista');
    if (!lista) return;
    
    try {
        const pedidosCliente = await apiGetPedidosByTelefone(telefone);
        
        if (!pedidosCliente || pedidosCliente.length === 0) {
            lista.innerHTML = `
                <div class="sem-pedidos" style="text-align:center; padding:3rem; background:white; border-radius:1.5rem; border:1px solid #ede3d6;">
                    <i class="fas fa-search" style="font-size:3rem; color:#c4b5a5; margin-bottom:1rem;"></i>
                    <p style="font-size:1.2rem; color:#7a5f4a;">Nenhum pedido encontrado para este telefone.</p>
                    <p style="font-size:0.9rem; color:#c4b5a5;">Verifique o número digitado ou faça seu primeiro pedido!</p>
                </div>
            `;
            return;
        }
        
        lista.innerHTML = pedidosCliente.map(pedido => `
            <div class="pedido-card">
                <div class="pedido-header">
                    <span class="pedido-id">#${pedido.id}</span>
                    <span class="pedido-status status-${pedido.status}">${getStatusLabel(pedido.status)}</span>
                </div>
                <div class="pedido-itens">
                    ${pedido.itens ? pedido.itens.map(item => `${item.nome} x${item.quantidade}`).join(', ') : ''}
                </div>
                <div class="pedido-total">Total: R$ ${Number(pedido.total).toFixed(2)}</div>
                <div style="font-size:0.85rem; color:#7a5f4a; margin-top:0.3rem;">
                    ${pedido.data ? new Date(pedido.data).toLocaleString('pt-BR') : ''} • ${pedido.forma_pagamento || pedido.formaPagamento}
                </div>
                <div class="pedido-actions">
                    <button onclick="verDetalhesPedido(${pedido.id})">
                        <i class="fas fa-eye"></i> Ver Detalhes
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao consultar pedidos:', error);
        lista.innerHTML = `
            <div class="sem-pedidos" style="text-align:center; padding:3rem; background:white; border-radius:1.5rem; border:1px solid #ede3d6;">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem; color:#e74c3c; margin-bottom:1rem;"></i>
                <p style="font-size:1.2rem; color:#7a5f4a;">Erro ao buscar pedidos!</p>
                <p style="color:#c4b5a5;">Verifique sua conexão com o servidor.</p>
            </div>
        `;
    }
}

function getStatusLabel(status) {
    const labels = {
        'pendente': 'Pendente',
        'preparando': 'Preparando',
        'pronto': 'Pronto',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    };
    return labels[status] || status;
}

// ===== DETALHES DO PEDIDO =====
async function verDetalhesPedido(id) {
    try {
        const pedidos = await apiGetPedidos();
        const pedido = pedidos.find(p => p.id === id);
        if (!pedido) {
            mostrarNotificacao('Pedido não encontrado!', 'error');
            return;
        }
        
        const content = document.getElementById('detalhesPedidoContent');
        if (!content) return;
        
        content.innerHTML = `
            <div style="margin-bottom:1rem;">
                <p><strong>Cliente:</strong> ${pedido.cliente}</p>
                <p><strong>Telefone:</strong> ${pedido.telefone}</p>
                <p><strong>Endereço:</strong> ${pedido.endereco}</p>
                <p><strong>Status:</strong> ${getStatusLabel(pedido.status)}</p>
                <p><strong>Data:</strong> ${pedido.data ? new Date(pedido.data).toLocaleString('pt-BR') : ''}</p>
                <p><strong>Pagamento:</strong> ${pedido.forma_pagamento || pedido.formaPagamento}</p>
                ${pedido.observacoes ? `<p><strong>Observações:</strong> ${pedido.observacoes}</p>` : ''}
            </div>
            <h4 style="color:#5f1414; margin-bottom:0.5rem;">Itens:</h4>
            ${pedido.itens ? pedido.itens.map(item => `
                <div class="detalhe-item">
                    <span>${item.nome} x${item.quantidade}</span>
                    <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
            `).join('') : ''}
            <div class="detalhe-total">
                <span>Total:</span>
                <span>R$ ${Number(pedido.total).toFixed(2)}</span>
            </div>
        `;
        
        document.getElementById('modalDetalhesPedido').classList.add('show');
    } catch (error) {
        console.error('Erro ao ver detalhes do pedido:', error);
        mostrarNotificacao('Erro ao carregar detalhes do pedido!', 'error');
    }
}

document.getElementById('closeDetalhes')?.addEventListener('click', () => {
    document.getElementById('modalDetalhesPedido').classList.remove('show');
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('modalDetalhesPedido');
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// ===== DESTAQUES DA HOME =====
function renderDestaques() {
    const container = document.getElementById('destaquesHome');
    if (!container) return;
    
    const destaques = [
        { icon: 'fa-cheese', title: 'Ingredientes Frescos', desc: 'Selecionados diariamente' },
        { icon: 'fa-fire', title: 'Forno à Lenha', desc: 'Sabor tradicional' },
        { icon: 'fa-leaf', title: 'Opções Vegetarianas', desc: 'Para todos os gostos' },
        { icon: 'fa-truck', title: 'Entrega Rápida', desc: 'Quente e na hora certa' }
    ];
    
    container.innerHTML = destaques.map((d, index) => `
        <div class="destaque-item" style="animation: slideIn 0.4s ease ${index * 0.1}s both;">
            <i class="fas ${d.icon}"></i>
            <h3>${d.title}</h3>
            <p>${d.desc}</p>
        </div>
    `).join('');
}

// ===== LOGIN =====
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPassword').value;
    
    try {
        const result = await apiLogin(user, pass);
        
        if (result.success) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('dashboardContainer').style.display = 'block';
            document.getElementById('userName').textContent = result.user.nome || user;
            await renderDashboard();
            mostrarNotificacao('Login realizado com sucesso!', 'success');
        } else {
            mostrarNotificacao(result.message || 'Usuário ou senha incorretos!', 'error');
            document.querySelectorAll('#loginForm input').forEach(input => {
                input.style.animation = 'shake 0.5s ease';
                setTimeout(() => input.style.animation = '', 500);
            });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        mostrarNotificacao('Erro ao fazer login!', 'error');
    }
});

document.getElementById('btnLogout')?.addEventListener('click', () => {
    apiLogout();
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPassword').value = '';
    mostrarNotificacao('Logout realizado!', 'info');
});

// ===== DASHBOARD =====
async function renderDashboard() {
    try {
        // Buscar estatísticas
        const stats = await apiGetStats();
        if (stats) {
            document.getElementById('totalPedidos').textContent = stats.totalHoje || 0;
            document.getElementById('totalFaturamento').textContent = 
                `R$ ${Number(stats.faturamentoHoje || 0).toFixed(2)}`;
        }
        
        // Buscar funcionários
        const funcionarios = await apiGetFuncionarios();
        document.getElementById('totalFuncionarios').textContent = funcionarios.length || 0;
        
        // Buscar cardápio
        const cardapio = await apiGetCardapio();
        document.getElementById('totalPizzas').textContent = cardapio.length || 0;
        
        // Renderizar listas
        await renderDashboardFuncionarios(funcionarios);
        await renderDashboardPedidos();
        await renderGraficoPedidos();
    } catch (error) {
        console.error('Erro ao renderizar dashboard:', error);
        mostrarNotificacao('Erro ao carregar dados do dashboard!', 'error');
    }
}

// ===== GRÁFICO DE PEDIDOS POR DIA =====
async function renderGraficoPedidos() {
    const container = document.getElementById('graficoPedidos');
    if (!container) return;
    
    try {
        const stats = await apiGetStats();
        const dados = stats.pedidosPorDia || [];
        
        if (dados.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:2rem; color:#7a5f4a;">
                    <i class="fas fa-chart-bar" style="font-size:2rem; margin-bottom:0.5rem;"></i>
                    <p>Nenhum pedido registrado para exibir no gráfico.</p>
                </div>
            `;
            return;
        }
        
        const maxValor = Math.max(...dados.map(d => Number(d.total)), 1);
        
        container.innerHTML = dados.map(item => {
            const data = new Date(item.data).toLocaleDateString('pt-BR');
            const valor = Number(item.total);
            const altura = (valor / maxValor) * 200;
            return `
                <div class="barra-item">
                    <div class="barra-valor">${valor}</div>
                    <div class="barra" style="height: ${Math.max(altura, 10)}px;"></div>
                    <div class="barra-label">${data}</div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao renderizar gráfico:', error);
        container.innerHTML = `
            <div style="text-align:center; padding:2rem; color:#e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size:2rem; margin-bottom:0.5rem;"></i>
                <p>Erro ao carregar gráfico!</p>
            </div>
        `;
    }
}

// ===== DASHBOARD FUNCIONÁRIOS =====
async function renderDashboardFuncionarios(funcionarios = null) {
    const list = document.getElementById('dashboardFuncionariosList');
    if (!list) return;
    
    if (!funcionarios) {
        try {
            funcionarios = await apiGetFuncionarios();
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            return;
        }
    }
    
    if (!funcionarios || funcionarios.length === 0) {
        list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem;">Nenhum funcionário cadastrado.</td></tr>';
        return;
    }
    
    list.innerHTML = funcionarios.map((f) => `
        <tr>
            <td>${f.nome}</td>
            <td>${f.cargo}</td>
            <td>${f.descricao || '-'}</td>
            <td>
                <div class="btn-acoes">
                    <button class="btn-edit" onclick="editarFuncionario(${f.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="excluirFuncionario(${f.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function excluirFuncionario(id) {
    try {
        const funcionarios = await apiGetFuncionarios();
        const funcionario = funcionarios.find(f => f.id === id);
        if (!funcionario) return;
        
        if (confirm(`Tem certeza que deseja excluir ${funcionario.nome}?`)) {
            const result = await apiDeleteFuncionario(id);
            if (result.success) {
                await renderDashboard();
                mostrarNotificacao('Funcionário removido!', 'warning');
            } else {
                mostrarNotificacao('Erro ao remover funcionário!', 'error');
            }
        }
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        mostrarNotificacao('Erro ao remover funcionário!', 'error');
    }
}

async function editarFuncionario(id) {
    try {
        const funcionarios = await apiGetFuncionarios();
        const func = funcionarios.find(f => f.id === id);
        if (!func) return;
        
        const novoNome = prompt('Novo nome:', func.nome);
        if (novoNome && novoNome.trim()) {
            func.nome = novoNome.trim();
            const novoCargo = prompt('Novo cargo:', func.cargo);
            if (novoCargo && novoCargo.trim()) func.cargo = novoCargo.trim();
            const novaDesc = prompt('Nova descrição:', func.descricao || '');
            if (novaDesc !== null) func.descricao = novaDesc;
            
            const result = await apiUpdateFuncionario(id, func);
            if (result && result.id) {
                await renderDashboard();
                mostrarNotificacao('Funcionário atualizado!', 'success');
            }
        }
    } catch (error) {
        console.error('Erro ao editar funcionário:', error);
        mostrarNotificacao('Erro ao atualizar funcionário!', 'error');
    }
}

// ===== DASHBOARD PEDIDOS COM FILTROS =====
async function renderDashboardPedidos(filtroStatus = '', filtroData = '') {
    const list = document.getElementById('dashboardPedidosList');
    if (!list) return;
    
    try {
        const filtros = {};
        if (filtroStatus) filtros.status = filtroStatus;
        if (filtroData) filtros.data = filtroData;
        
        const pedidos = await apiGetPedidos(filtros);
        
        if (!pedidos || pedidos.length === 0) {
            list.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem;">Nenhum pedido encontrado.</td></tr>';
            document.getElementById('totalPedidosFiltrados').textContent = 'Total: 0 pedidos';
            return;
        }
        
        document.getElementById('totalPedidosFiltrados').textContent = `Total: ${pedidos.length} pedidos`;
        
        list.innerHTML = pedidos.map((p) => `
            <tr>
                <td>#${p.id}</td>
                <td>${p.cliente}</td>
                <td>${p.telefone}</td>
                <td>${p.itens ? p.itens.length : 0} itens</td>
                <td>R$ ${Number(p.total).toFixed(2)}</td>
                <td><span class="pedido-status status-${p.status}">${getStatusLabel(p.status)}</span></td>
                <td>${p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '-'}</td>
                <td>
                    <div class="btn-acoes">
                        <button class="btn-status" onclick="alterarStatusPedido(${p.id})">
                            <i class="fas fa-sync"></i>
                        </button>
                        <button class="btn-edit" onclick="verDetalhesPedido(${p.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erro ao renderizar pedidos:', error);
        list.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem;">Erro ao carregar pedidos!</td></tr>';
    }
}

// ===== FILTROS DO DASHBOARD =====
document.getElementById('filtroStatus')?.addEventListener('change', function() {
    const dataFiltro = document.getElementById('filtroData')?.value || '';
    renderDashboardPedidos(this.value, dataFiltro);
});

document.getElementById('filtroData')?.addEventListener('change', function() {
    const statusFiltro = document.getElementById('filtroStatus')?.value || '';
    renderDashboardPedidos(statusFiltro, this.value);
});

document.getElementById('btnLimparFiltros')?.addEventListener('click', function() {
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroData').value = '';
    renderDashboardPedidos('', '');
    mostrarNotificacao('Filtros limpos!', 'info');
});

// ===== ALTERAR STATUS PEDIDO =====
async function alterarStatusPedido(id) {
    try {
        const pedidos = await apiGetPedidos();
        const pedido = pedidos.find(p => p.id === id);
        if (!pedido) return;
        
        const statusOptions = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
        const currentIndex = statusOptions.indexOf(pedido.status);
        const nextIndex = (currentIndex + 1) % statusOptions.length;
        const novoStatus = statusOptions[nextIndex];
        
        const result = await apiAtualizarStatusPedido(id, novoStatus);
        if (result && result.id) {
            await renderDashboard();
            mostrarNotificacao(`Status alterado para ${getStatusLabel(novoStatus)}`, 'info');
        }
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        mostrarNotificacao('Erro ao alterar status!', 'error');
    }
}

// ===== EXPORTAR PEDIDOS PARA PDF =====
async function exportarPedidosPDF() {
    try {
        const pedidos = await apiGetPedidos();
        
        if (!pedidos || pedidos.length === 0) {
            mostrarNotificacao('Não há pedidos para exportar!', 'warning');
            return;
        }
        
        // Criar conteúdo para o PDF
        let conteudo = `
            <h1>📋 Relatório de Pedidos</h1>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
            <p>Total de pedidos: ${pedidos.length}</p>
            <hr>
            <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Telefone</th>
                        <th>Itens</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        pedidos.forEach(p => {
            const itens = p.itens ? p.itens.map(i => `${i.nome} x${i.quantidade}`).join(', ') : '';
            conteudo += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.cliente}</td>
                    <td>${p.telefone}</td>
                    <td>${itens}</td>
                    <td>R$ ${Number(p.total).toFixed(2)}</td>
                    <td>${getStatusLabel(p.status)}</td>
                    <td>${p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '-'}</td>
                </tr>
            `;
        });
        
        conteudo += `
                </tbody>
            </table>
            <p style="margin-top:20px; color:#666; font-size:0.9rem;">
                Relatório gerado automaticamente pelo sistema Pizzaria dos Dev's.
            </p>
        `;
        
        // Criar link para impressão/salvar como PDF
        const janela = window.open('', '_blank');
        if (janela) {
            janela.document.write(`
                <html>
                    <head>
                        <title>Relatório de Pedidos</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 30px; max-width: 1000px; margin: 0 auto; }
                            h1 { color: #5f1414; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th { background: #5f1414; color: white; padding: 10px; }
                            td { padding: 8px; border: 1px solid #ddd; }
                            tr:nth-child(even) { background: #f9f9f9; }
                            hr { margin: 20px 0; }
                            @media print {
                                body { padding: 10px; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        ${conteudo}
                        <div class="no-print" style="margin-top:30px; text-align:center;">
                            <button onclick="window.print()" style="padding:10px 30px; background:#5f1414; color:white; border:none; border-radius:8px; font-size:16px; cursor:pointer;">
                                🖨️ Imprimir / Salvar PDF
                            </button>
                            <button onclick="window.close()" style="padding:10px 30px; background:#ccc; color:#333; border:none; border-radius:8px; font-size:16px; cursor:pointer; margin-left:10px;">
                                Fechar
                            </button>
                        </div>
                        <script>
                            setTimeout(() => {
                                if (confirm('Deseja imprimir/salvar o relatório em PDF?')) {
                                    window.print();
                                }
                            }, 500);
                        <\/script>
                    </body>
                </html>
            `);
            janela.document.close();
            mostrarNotificacao('📄 Relatório preparado para impressão!', 'success');
        } else {
            mostrarNotificacao('❌ Não foi possível abrir a janela de impressão.', 'error');
        }
    } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        mostrarNotificacao('Erro ao exportar PDF!', 'error');
    }
}

document.getElementById('btnExportarPDF')?.addEventListener('click', exportarPedidosPDF);

// ===== MODAL - ADICIONAR FUNCIONÁRIO =====
const modal = document.getElementById('modalFuncionario');
const btnAdd = document.getElementById('btnAddFuncionario');
const closeModal = document.querySelector('.modal-close');

if (btnAdd) {
    btnAdd.addEventListener('click', () => modal.classList.add('show'));
}
if (closeModal) {
    closeModal.addEventListener('click', () => modal.classList.remove('show'));
}
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
});

document.getElementById('formAddFuncionario')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('addNome').value.trim();
    const cargo = document.getElementById('addCargo').value.trim();
    const descricao = document.getElementById('addDescricao').value.trim();
    
    if (!nome || !cargo) {
        mostrarNotificacao('Preencha nome e cargo!', 'error');
        return;
    }
    
    try {
        const result = await apiAddFuncionario({
            nome: nome,
            cargo: cargo,
            descricao: descricao || ''
        });
        
        if (result && result.id) {
            document.getElementById('formAddFuncionario').reset();
            modal.classList.remove('show');
            await renderDashboard();
            mostrarNotificacao('Funcionário adicionado com sucesso!', 'success');
        } else {
            mostrarNotificacao('Erro ao adicionar funcionário!', 'error');
        }
    } catch (error) {
        console.error('Erro ao adicionar funcionário:', error);
        mostrarNotificacao('Erro ao adicionar funcionário!', 'error');
    }
});

// ===== CONTATO =====
document.getElementById('contatoForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    mostrarNotificacao('Mensagem enviada! Em breve retornamos o contato.', 'success');
    e.target.reset();
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async () => {
    // Renderizar cardápio
    await renderCardapio('todas');
    
    // Renderizar destaques
    renderDestaques();
    
    // Atualizar contador do carrinho
    updateCartCount();
    
    // Configurar página de pedidos
    const lista = document.getElementById('pedidosLista');
    if (lista) {
        lista.innerHTML = `
            <div class="sem-pedidos" style="text-align:center; padding:3rem; background:white; border-radius:1.5rem; border:1px solid #ede3d6;">
                <i class="fas fa-phone-alt" style="font-size:3rem; color:#c4b5a5; margin-bottom:1rem;"></i>
                <p style="font-size:1.2rem; color:#7a5f4a;">Digite seu telefone acima para consultar seus pedidos.</p>
            </div>
        `;
    }
    
    // Verificar se já está logado
    const user = getCurrentUser();
    if (user && localStorage.getItem('token')) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        document.getElementById('userName').textContent = user.nome || user.username;
        await renderDashboard();
    } else {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('dashboardContainer').style.display = 'none';
    }
    
    // Estilo para shake animation
    if (!document.getElementById('shakeStyle')) {
        const style = document.createElement('style');
        style.id = 'shakeStyle';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-10px); }
                40%, 80% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
});

// ===== EVENTOS GLOBAIS =====
document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (link && !link.closest('.nav-menu')) {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) navigateTo(page);
    }
});

document.querySelectorAll('.btn-group .btn[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = btn.dataset.page;
        if (page) navigateTo(page);
    });
});

console.log('✅ Script carregado com sucesso!');
console.log('📊 Conectado ao backend MySQL!');
console.log('📄 Exportação de PDF pronta!');