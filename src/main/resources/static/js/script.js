// ===== SCRIPT.JS COM PAINEL ESTATÍSTICO, RELATÓRIOS, GRÁFICOS E EXPORTAÇÃO =====

// ===== DADOS INICIAIS =====
// Cardápio
if (typeof cardapio === 'undefined') {
    window.cardapio = [
        { id: 1, nome: 'Margherita', preco: 35.90, categoria: 'salgada', descricao: 'Molho, mussarela, tomate e manjericão' },
        { id: 2, nome: 'Calabresa', preco: 38.90, categoria: 'salgada', descricao: 'Molho, mussarela, calabresa e cebola' },
        { id: 3, nome: 'Frango com Catupiry', preco: 42.90, categoria: 'salgada', descricao: 'Molho, mussarela, frango desfiado e catupiry' },
        { id: 4, nome: 'Portuguesa', preco: 40.90, categoria: 'salgada', descricao: 'Molho, mussarela, presunto, ovos, cebola e azeitona' },
        { id: 5, nome: 'Napolitana', preco: 37.90, categoria: 'salgada', descricao: 'Molho, mussarela, anchovas, alcaparras e orégano' },
        { id: 6, nome: 'Chocolate com Morango', preco: 45.90, categoria: 'doce', descricao: 'Chocolate e morangos frescos' },
        { id: 7, nome: 'Romeu e Julieta', preco: 43.90, categoria: 'doce', descricao: 'Goiabada e queijo mussarela' },
        { id: 8, nome: 'Banana com Canela', preco: 39.90, categoria: 'doce', descricao: 'Banana caramelizada e canela' },
        { id: 9, nome: 'Refrigerante 2L', preco: 12.00, categoria: 'bebida', descricao: 'Coca-Cola, Guaraná ou Fanta' },
        { id: 10, nome: 'Suco Natural', preco: 8.00, categoria: 'bebida', descricao: 'Laranja, limão ou maracujá' },
        { id: 11, nome: 'Água Mineral', preco: 5.00, categoria: 'bebida', descricao: 'Com ou sem gás' }
    ];
}

// Funcionários
if (typeof funcionarios === 'undefined') {
    window.funcionarios = [
        { id: 1, nome: 'João Silva', cargo: 'Gerente', descricao: 'Responsável pela equipe' },
        { id: 2, nome: 'Maria Santos', cargo: 'Pizzaiolo', descricao: 'Especialista em pizzas' },
        { id: 3, nome: 'Pedro Lima', cargo: 'Atendente', descricao: 'Atendimento ao cliente' }
    ];
}

// Pedidos - Inicializar com dados de exemplo
if (typeof pedidos === 'undefined') {
    window.pedidos = [];
    
    // Gerar pedidos de exemplo para os últimos 7 dias
    const hoje = new Date();
    for (let d = 0; d < 7; d++) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - d);
        const dataStr = data.toLocaleDateString('pt-BR');
        
        const numPedidos = Math.floor(Math.random() * 5) + 1;
        for (let p = 0; p < numPedidos; p++) {
            const statusOptions = ['pendente', 'preparando', 'pronto', 'entregue', 'entregue', 'entregue'];
            const itens = [
                { nome: 'Margherita', quantidade: 1, preco: 35.90 },
                { nome: 'Calabresa', quantidade: 1, preco: 38.90 },
                { nome: 'Frango com Catupiry', quantidade: 1, preco: 42.90 },
                { nome: 'Refrigerante 2L', quantidade: 1, preco: 12.00 }
            ];
            const numItens = Math.floor(Math.random() * 3) + 1;
            const selectedItens = itens.slice(0, numItens);
            const total = selectedItens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
            
            window.pedidos.push({
                id: Date.now() + d * 100 + p,
                cliente: ['Carlos Silva', 'Ana Oliveira', 'João Santos', 'Maria Costa', 'Pedro Souza'][Math.floor(Math.random() * 5)],
                telefone: `(11) 9${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                endereco: `Rua ${['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]}, ${Math.floor(Math.random() * 100) + 1}`,
                formaPagamento: ['dinheiro', 'cartao-credito', 'pix'][Math.floor(Math.random() * 3)],
                observacoes: '',
                itens: selectedItens,
                total: total,
                status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
                data: `${dataStr} ${String(Math.floor(Math.random() * 12) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
            });
        }
    }
}

// Carrinho
let carrinho = [];
let nextItemId = 1;
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
    contato: document.getElementById('page-contato'),
    swagger: document.getElementById('page-swagger')
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
function renderCardapio(categoria = 'todas', searchTerm = '', orderBy = '') {
    const grid = document.getElementById('cardapioGrid');
    if (!grid) return;
    
    categoriaAtual = categoria;
    let itens = window.cardapio || [];
    
    if (categoria !== 'todas') {
        itens = itens.filter(item => item.categoria === categoria);
    }
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        itens = itens.filter(item => 
            item.nome.toLowerCase().includes(term) || 
            item.descricao.toLowerCase().includes(term)
        );
    }
    
    if (orderBy === 'preco-asc') {
        itens.sort((a, b) => a.preco - b.preco);
    } else if (orderBy === 'preco-desc') {
        itens.sort((a, b) => b.preco - a.preco);
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
            <p class="preco">R$ ${item.preco.toFixed(2)}</p>
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
    const item = window.cardapio.find(p => p.id === id);
    if (!item) return;
    
    const existing = carrinho.find(c => c.id === id);
    if (existing) {
        existing.quantidade++;
    } else {
        carrinho.push({
            id: item.id,
            nome: item.nome,
            preco: item.preco,
            categoria: item.categoria,
            quantidade: 1
        });
    }
    
    updateCartCount();
    renderCarrinho();
    mostrarNotificacao(`${item.nome} adicionado ao carrinho!`, 'success');
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
                <p>R$ ${item.preco.toFixed(2)}</p>
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

document.getElementById('formFinalizar')?.addEventListener('submit', (e) => {
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
    
    const pedido = {
        id: Date.now(),
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
        total: carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0),
        status: 'pendente',
        data: new Date().toLocaleString('pt-BR')
    };
    
    window.pedidos.unshift(pedido);
    carrinho = [];
    updateCartCount();
    renderCarrinho();
    mostrarNotificacao('✅ Pedido realizado com sucesso!', 'success');
    navigateTo('meus-pedidos');
    document.getElementById('consultaTelefone').value = telefone;
    consultarPedidos(telefone);
    document.getElementById('formFinalizar').reset();
});

// ===== MEUS PEDIDOS =====
document.getElementById('formConsultaTelefone')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const telefone = document.getElementById('consultaTelefone').value.trim();
    if (!telefone) {
        mostrarNotificacao('Digite um telefone para consultar!', 'warning');
        return;
    }
    consultarPedidos(telefone);
});

function consultarPedidos(telefone) {
    const lista = document.getElementById('pedidosLista');
    if (!lista) return;
    
    const pedidosCliente = window.pedidos.filter(p => 
        p.telefone.replace(/\D/g, '') === telefone.replace(/\D/g, '')
    );
    
    if (pedidosCliente.length === 0) {
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
                ${pedido.itens.map(item => `${item.nome} x${item.quantidade}`).join(', ')}
            </div>
            <div class="pedido-total">Total: R$ ${pedido.total.toFixed(2)}</div>
            <div style="font-size:0.85rem; color:#7a5f4a; margin-top:0.3rem;">
                ${pedido.data} • ${pedido.formaPagamento}
            </div>
            <div class="pedido-actions">
                <button onclick="verDetalhesPedido(${pedido.id})">
                    <i class="fas fa-eye"></i> Ver Detalhes
                </button>
            </div>
        </div>
    `).join('');
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
function verDetalhesPedido(id) {
    const pedido = window.pedidos.find(p => p.id === id);
    if (!pedido) return;
    
    const content = document.getElementById('detalhesPedidoContent');
    if (!content) return;
    
    content.innerHTML = `
        <div style="margin-bottom:1rem;">
            <p><strong>Cliente:</strong> ${pedido.cliente}</p>
            <p><strong>Telefone:</strong> ${pedido.telefone}</p>
            <p><strong>Endereço:</strong> ${pedido.endereco}</p>
            <p><strong>Status:</strong> ${getStatusLabel(pedido.status)}</p>
            <p><strong>Data:</strong> ${pedido.data}</p>
            <p><strong>Pagamento:</strong> ${pedido.formaPagamento}</p>
            ${pedido.observacoes ? `<p><strong>Observações:</strong> ${pedido.observacoes}</p>` : ''}
        </div>
        <h4 style="color:#5f1414; margin-bottom:0.5rem;">Itens:</h4>
        ${pedido.itens.map(item => `
            <div class="detalhe-item">
                <span>${item.nome} x${item.quantidade}</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
        `).join('')}
        <div class="detalhe-total">
            <span>Total:</span>
            <span>R$ ${pedido.total.toFixed(2)}</span>
        </div>
    `;
    
    document.getElementById('modalDetalhesPedido').classList.add('show');
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
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPassword').value;
    
    if (user === 'admin' && pass === '123456') {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        document.getElementById('userName').textContent = user;
        renderDashboard();
        mostrarNotificacao('Login realizado com sucesso!', 'success');
    } else {
        mostrarNotificacao('Usuário ou senha incorretos!', 'error');
        document.querySelectorAll('#loginForm input').forEach(input => {
            input.style.animation = 'shake 0.5s ease';
            setTimeout(() => input.style.animation = '', 500);
        });
    }
});

document.getElementById('btnLogout')?.addEventListener('click', () => {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPassword').value = '';
    mostrarNotificacao('Logout realizado!', 'info');
});

// ===== DASHBOARD =====
function renderDashboard() {
    const funcionarios = window.funcionarios || [];
    const pedidos = window.pedidos || [];
    
    document.getElementById('totalFuncionarios').textContent = funcionarios.length;
    document.getElementById('totalPizzas').textContent = (window.cardapio || []).length;
    
    const hoje = new Date().toDateString();
    const pedidosHoje = pedidos.filter(p => {
        const dataPedido = new Date(p.data.split(' ')[0]);
        return dataPedido.toDateString() === hoje;
    });
    document.getElementById('totalPedidos').textContent = pedidosHoje.length;
    
    renderDashboardFuncionarios();
    renderDashboardPedidos();
    renderGraficoPedidos();
}

// ===== GRÁFICO DE PEDIDOS POR DIA =====
function renderGraficoPedidos() {
    const container = document.getElementById('graficoPedidos');
    if (!container) return;
    
    const pedidos = window.pedidos || [];
    const dias = {};
    
    pedidos.forEach(p => {
        const data = p.data.split(' ')[0];
        dias[data] = (dias[data] || 0) + 1;
    });
    
    const datas = Object.keys(dias).sort((a, b) => {
        const [da, ma, aa] = a.split('/');
        const [db, mb, ab] = b.split('/');
        return new Date(aa, ma - 1, da) - new Date(ab, mb - 1, db);
    });
    
    const maxValor = Math.max(...Object.values(dias), 1);
    
    if (datas.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:2rem; color:#7a5f4a;">
                <i class="fas fa-chart-bar" style="font-size:2rem; margin-bottom:0.5rem;"></i>
                <p>Nenhum pedido registrado para exibir no gráfico.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = datas.map(data => {
        const valor = dias[data];
        const altura = (valor / maxValor) * 200;
        return `
            <div class="barra-item">
                <div class="barra-valor">${valor}</div>
                <div class="barra" style="height: ${Math.max(altura, 10)}px;"></div>
                <div class="barra-label">${data}</div>
            </div>
        `;
    }).join('');
}

// ===== DASHBOARD FUNCIONÁRIOS =====
function renderDashboardFuncionarios() {
    const list = document.getElementById('dashboardFuncionariosList');
    if (!list) return;
    const funcionarios = window.funcionarios || [];
    
    if (funcionarios.length === 0) {
        list.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:2rem;">Nenhum funcionário cadastrado.</td></tr>';
        return;
    }
    
    list.innerHTML = funcionarios.map((f, index) => `
        <tr>
            <td>${f.nome}</td>
            <td>${f.cargo}</td>
            <td>${f.descricao || '-'}</td>
            <td>
                <div class="btn-acoes">
                    <button class="btn-edit" onclick="editarFuncionario(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="excluirFuncionario(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function excluirFuncionario(index) {
    if (confirm(`Tem certeza que deseja excluir ${window.funcionarios[index].nome}?`)) {
        window.funcionarios.splice(index, 1);
        renderDashboard();
        mostrarNotificacao('Funcionário removido!', 'warning');
    }
}

function editarFuncionario(index) {
    const func = window.funcionarios[index];
    const novoNome = prompt('Novo nome:', func.nome);
    if (novoNome && novoNome.trim()) {
        func.nome = novoNome.trim();
        const novoCargo = prompt('Novo cargo:', func.cargo);
        if (novoCargo && novoCargo.trim()) func.cargo = novoCargo.trim();
        const novaDesc = prompt('Nova descrição:', func.descricao || '');
        if (novaDesc !== null) func.descricao = novaDesc;
        renderDashboard();
        mostrarNotificacao('Funcionário atualizado!', 'success');
    }
}

// ===== DASHBOARD PEDIDOS COM FILTROS =====
function renderDashboardPedidos(filtroStatus = '', filtroData = '') {
    const list = document.getElementById('dashboardPedidosList');
    if (!list) return;
    let pedidos = window.pedidos || [];
    
    if (filtroStatus) {
        pedidos = pedidos.filter(p => p.status === filtroStatus);
    }
    if (filtroData) {
        pedidos = pedidos.filter(p => p.data.includes(filtroData));
    }
    
    if (pedidos.length === 0) {
        list.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">Nenhum pedido encontrado com os filtros aplicados.</td></tr>';
        return;
    }
    
    list.innerHTML = pedidos.map((p, index) => `
        <tr>
            <td>#${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.telefone}</td>
            <td>${p.itens.length} itens</td>
            <td>R$ ${p.total.toFixed(2)}</td>
            <td><span class="pedido-status status-${p.status}">${getStatusLabel(p.status)}</span></td>
            <td>
                <div class="btn-acoes">
                    <button class="btn-status" onclick="alterarStatusPedido(${index})">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="btn-edit" onclick="verDetalhesPedido(${p.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
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

function alterarStatusPedido(index) {
    const pedidos = window.pedidos;
    const statusOptions = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
    const currentIndex = statusOptions.indexOf(pedidos[index].status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    pedidos[index].status = statusOptions[nextIndex];
    renderDashboard();
    mostrarNotificacao(`Status alterado para ${getStatusLabel(pedidos[index].status)}`, 'info');
}

// ===== EXPORTAR PEDIDOS PARA PDF =====
function exportarPedidosPDF() {
    const pedidos = window.pedidos || [];
    if (pedidos.length === 0) {
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
        const itens = p.itens.map(i => `${i.nome} x${i.quantidade}`).join(', ');
        conteudo += `
            <tr>
                <td>${p.id}</td>
                <td>${p.cliente}</td>
                <td>${p.telefone}</td>
                <td>${itens}</td>
                <td>R$ ${p.total.toFixed(2)}</td>
                <td>${getStatusLabel(p.status)}</td>
                <td>${p.data}</td>
            </tr>
        `;
    });
    
    conteudo += `
            </tbody>
        </table>
        <p style="margin-top:20px; color:#666; font-size:0.9rem;">
            Relatório gerado automaticamente pelo sistema Pizzaria Portello.
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
                        // Auto-imprimir após carregar
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
}

// Botão Exportar PDF
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

document.getElementById('formAddFuncionario')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('addNome').value.trim();
    const cargo = document.getElementById('addCargo').value.trim();
    const descricao = document.getElementById('addDescricao').value.trim();
    
    if (!nome || !cargo) {
        mostrarNotificacao('Preencha nome e cargo!', 'error');
        return;
    }
    
    window.funcionarios.push({
        id: Date.now(),
        nome: nome,
        cargo: cargo,
        descricao: descricao || ''
    });
    
    document.getElementById('formAddFuncionario').reset();
    modal.classList.remove('show');
    renderDashboard();
    mostrarNotificacao('Funcionário adicionado com sucesso!', 'success');
});

// ===== CONTATO =====
document.getElementById('contatoForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    mostrarNotificacao('Mensagem enviada! Em breve retornamos o contato.', 'success');
    e.target.reset();
});

// ===== SWAGGER =====
function renderSwagger() {
    const container = document.getElementById('swaggerContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="swagger-container">
            <h3>📚 API Pizzaria Portello</h3>
            <p>Documentação da API REST para integração com o sistema.</p>
            
            <h4 style="margin-top:2rem;">📦 Pedidos</h4>
            
            <pre>
<span class="method method-get">GET</span> /api/pedidos
<strong>Descrição:</strong> Lista todos os pedidos
<strong>Resposta:</strong> Array de objetos Pedido
            </pre>
            
            <pre>
<span class="method method-get">GET</span> /api/pedidos/:id
<strong>Descrição:</strong> Busca um pedido específico
<strong>Parâmetro:</strong> id (number) - ID do pedido
<strong>Resposta:</strong> Objeto Pedido
            </pre>
            
            <pre>
<span class="method method-post">POST</span> /api/pedidos
<strong>Descrição:</strong> Cria um novo pedido
<strong>Corpo:</strong> {
  cliente: string,
  telefone: string,
  endereco: string,
  formaPagamento: string,
  itens: [{ nome: string, quantidade: number, preco: number }],
  observacoes: string
}
<strong>Resposta:</strong> Objeto Pedido criado
            </pre>
            
            <pre>
<span class="method method-put">PUT</span> /api/pedidos/:id/status
<strong>Descrição:</strong> Atualiza o status de um pedido
<strong>Parâmetro:</strong> id (number) - ID do pedido
<strong>Corpo:</strong> { status: string }
<strong>Resposta:</strong> Objeto Pedido atualizado
            </pre>
            
            <pre>
<span class="method method-delete">DELETE</span> /api/pedidos/:id
<strong>Descrição:</strong> Remove um pedido
<strong>Parâmetro:</strong> id (number) - ID do pedido
<strong>Resposta:</strong> { success: boolean }
            </pre>
            
            <h4 style="margin-top:2rem;">🍕 Cardápio</h4>
            
            <pre>
<span class="method method-get">GET</span> /api/cardapio
<strong>Descrição:</strong> Lista todos os itens do cardápio
<strong>Resposta:</strong> Array de objetos Item
            </pre>
            
            <pre>
<span class="method method-get">GET</span> /api/cardapio/:id
<strong>Descrição:</strong> Busca um item específico do cardápio
<strong>Parâmetro:</strong> id (number) - ID do item
<strong>Resposta:</strong> Objeto Item
            </pre>
            
            <h4 style="margin-top:2rem;">👨‍💼 Funcionários</h4>
            
            <pre>
<span class="method method-get">GET</span> /api/funcionarios
<strong>Descrição:</strong> Lista todos os funcionários
<strong>Resposta:</strong> Array de objetos Funcionario
            </pre>
            
            <pre>
<span class="method method-post">POST</span> /api/funcionarios
<strong>Descrição:</strong> Adiciona um novo funcionário
<strong>Corpo:</strong> { nome: string, cargo: string, descricao: string }
<strong>Resposta:</strong> Objeto Funcionario criado
            </pre>
            
            <pre>
<span class="method method-delete">DELETE</span> /api/funcionarios/:id
<strong>Descrição:</strong> Remove um funcionário
<strong>Parâmetro:</strong> id (number) - ID do funcionário
<strong>Resposta:</strong> { success: boolean }
            </pre>
            
            <div style="margin-top:2rem; padding:1rem; background:#f3e3d0; border-radius:1rem;">
                <p><strong>🔑 Autenticação:</strong> As rotas de funcionários e atualização de status requerem autenticação.</p>
                <p><strong>📝 Formato:</strong> Todas as respostas estão em JSON.</p>
                <p><strong>🌐 Base URL:</strong> <code>https://api.pizzariaportello.com/v1</code></p>
            </div>
        </div>
    `;
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    renderCardapio('todas');
    renderDestaques();
    updateCartCount();
    renderSwagger();
    
    const lista = document.getElementById('pedidosLista');
    if (lista && window.pedidos.length === 0) {
        lista.innerHTML = `
            <div class="sem-pedidos" style="text-align:center; padding:3rem; background:white; border-radius:1.5rem; border:1px solid #ede3d6;">
                <i class="fas fa-phone-alt" style="font-size:3rem; color:#c4b5a5; margin-bottom:1rem;"></i>
                <p style="font-size:1.2rem; color:#7a5f4a;">Digite seu telefone acima para consultar seus pedidos.</p>
            </div>
        `;
    }
    
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
    
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
console.log('📊 Dashboard com estatísticas, gráficos e relatórios disponível!');
console.log('📄 Exportação de PDF pronta!');
console.log('📚 Swagger UI disponível em /swagger');