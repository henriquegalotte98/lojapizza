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
  Object.values(pages).forEach(p => p.classList.remove('active'));
  if (pages[pageId]) pages[pageId].classList.add('active');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) navigateTo(page);
  });
});

// ===== CARRINHO =====
let carrinho = [];
let nextItemId = 1;

// Função para abrir carrinho
document.getElementById('cartIcon').addEventListener('click', () => {
  navigateTo('carrinho');
  renderCarrinho();
});

// Adicionar ao carrinho
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-comprar');
  if (btn) {
    e.preventDefault();
    const item = btn.closest('.cardapio-item');
    const nome = item.querySelector('h3').textContent;
    const precoText = item.querySelector('.preco').textContent;
    const preco = parseFloat(precoText.replace('R$ ', '').replace(',', '.'));
    const categoria = item.querySelector('.categoria-badge').textContent;
    
    // Verifica se já existe no carrinho
    const existing = carrinho.find(c => c.nome === nome);
    if (existing) {
      existing.quantidade++;
    } else {
      carrinho.push({
        id: nextItemId++,
        nome: nome,
        preco: preco,
        categoria: categoria,
        quantidade: 1
      });
    }
    
    updateCartCount();
    renderCarrinho();
    
    btn.textContent = '✓ Adicionado';
    setTimeout(() => { btn.textContent = 'Comprar'; }, 800);
  }
});

function updateCartCount() {
  const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
  document.getElementById('cartCount').textContent = total;
}

function renderCarrinho() {
  const vazio = document.getElementById('carrinhoVazio');
  const cheio = document.getElementById('carrinhoCheio');
  const container = document.getElementById('carrinhoItems');
  const totalSpan = document.getElementById('carrinhoTotal');
  
  if (carrinho.length === 0) {
    vazio.style.display = 'block';
    cheio.style.display = 'none';
    return;
  }
  
  vazio.style.display = 'none';
  cheio.style.display = 'block';
  
  container.innerHTML = carrinho.map(item => `
    <div class="carrinho-item">
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

// Limpar carrinho
document.getElementById('btnLimparCarrinho').addEventListener('click', () => {
  if (carrinho.length === 0) return;
  if (confirm('Tem certeza que deseja limpar o carrinho?')) {
    carrinho = [];
    updateCartCount();
    renderCarrinho();
  }
});

// Finalizar pedido
document.getElementById('btnFinalizarPedido').addEventListener('click', () => {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  navigateTo('finalizar');
  renderFinalizar();
});

// ===== FINALIZAR =====
function renderFinalizar() {
  const container = document.getElementById('finalizarItems');
  const totalSpan = document.getElementById('finalizarTotal');
  
  container.innerHTML = carrinho.map(item => `
    <div class="finalizar-item">
      <span>${item.nome} x${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
    </div>
  `).join('');
  
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  totalSpan.textContent = `R$ ${total.toFixed(2)}`;
}

// Submit finalizar pedido
document.getElementById('formFinalizar').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nome = document.getElementById('clienteNome').value.trim();
  const telefone = document.getElementById('clienteTelefone').value.trim();
  const endereco = document.getElementById('clienteEndereco').value.trim();
  const pagamento = document.getElementById('formaPagamento').value;
  const observacoes = document.getElementById('observacoes').value.trim();
  
  if (!nome || !telefone || !endereco || !pagamento) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }
  
  // Cria o pedido
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
  
  // Adiciona ao histórico
  window.pedidos.unshift(pedido);
  
  // Limpa carrinho
  carrinho = [];
  updateCartCount();
  renderCarrinho();
  
  alert('Pedido realizado com sucesso!');
  
  // Redireciona para Meus Pedidos
  navigateTo('meus-pedidos');
  document.getElementById('consultaTelefone').value = telefone;
  consultarPedidos(telefone);
});

// ===== MEUS PEDIDOS - CONSULTA POR TELEFONE =====
document.getElementById('formConsultaTelefone').addEventListener('submit', (e) => {
  e.preventDefault();
  const telefone = document.getElementById('consultaTelefone').value.trim();
  if (!telefone) {
    alert('Digite um telefone para consultar!');
    return;
  }
  consultarPedidos(telefone);
});

function consultarPedidos(telefone) {
  const lista = document.getElementById('pedidosLista');
  const pedidos = window.pedidos || [];
  
  // Filtra pedidos pelo telefone
  const pedidosCliente = pedidos.filter(p => 
    p.telefone.replace(/\D/g, '') === telefone.replace(/\D/g, '')
  );
  
  if (pedidosCliente.length === 0) {
    lista.innerHTML = `
      <div class="carrinho-vazio" style="padding:2rem;">
        <i class="fas fa-search"></i>
        <p>Nenhum pedido encontrado para este telefone.</p>
        <p style="font-size:0.9rem; color:#7a5f4a;">Verifique o número digitado ou faça seu primeiro pedido!</p>
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

// ===== DETALHES DO PEDIDO (MODAL) =====
function verDetalhesPedido(id) {
  const pedido = window.pedidos.find(p => p.id === id);
  if (!pedido) return;
  
  const content = document.getElementById('detalhesPedidoContent');
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

document.getElementById('closeDetalhes').addEventListener('click', () => {
  document.getElementById('modalDetalhesPedido').classList.remove('show');
});

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
  const modal = document.getElementById('modalDetalhesPedido');
  if (e.target === modal) modal.classList.remove('show');
});

// ===== RENDER DESTAQUES =====
function renderDestaques() {
  const container = document.getElementById('destaquesHome');
  if (!container) return;
  const destaques = [
    { icon: 'fa-cheese', title: 'Ingredientes Frescos' },
    { icon: 'fa-fire', title: 'Forno à Lenha' },
    { icon: 'fa-leaf', title: 'Opções Vegetarianas' },
    { icon: 'fa-truck', title: 'Entrega Rápida' }
  ];
  container.innerHTML = destaques.map(d => `
    <div class="destaque-item">
      <i class="fas ${d.icon}"></i>
      <h3>${d.title}</h3>
    </div>
  `).join('');
}
renderDestaques();

// ===== RENDER CARDÁPIO =====
function renderCardapio(categoria = 'todas') {
  const grid = document.getElementById('cardapioGrid');
  if (!grid) return;
  let itens = window.cardapio || [];
  if (categoria !== 'todas') {
    itens = itens.filter(item => item.categoria === categoria);
  }
  if (itens.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:2rem;">Nenhum item encontrado.</p>';
    return;
  }
  grid.innerHTML = itens.map(item => `
    <div class="cardapio-item">
      <h3>${item.nome}</h3>
      <span class="categoria-badge">${item.categoria}</span>
      <p>${item.descricao || ''}</p>
      <p class="preco">R$ ${item.preco.toFixed(2)}</p>
      <button class="btn btn-comprar" style="padding:0.4rem 1.8rem; font-size:0.9rem;">Comprar</button>
    </div>
  `).join('');
}

document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCardapio(btn.dataset.categoria);
  });
});

// ===== BOTÃO FUNCIONÁRIOS - ABRE LOGIN =====
document.getElementById('btnFuncionarios').addEventListener('click', (e) => {
  e.preventDefault();
  navigateTo('funcionarios');
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('dashboardContainer').style.display = 'none';
});

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPassword').value;
  
  if (user === 'admin' && pass === '123456') {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'block';
    document.getElementById('userName').textContent = user;
    renderDashboard();
  } else {
    alert('Usuário ou senha incorretos!');
  }
});

// ===== LOGOUT =====
document.getElementById('btnLogout').addEventListener('click', () => {
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('dashboardContainer').style.display = 'none';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPassword').value = '';
});

// ===== DASHBOARD =====
function renderDashboard() {
  const funcionarios = window.funcionarios || [];
  const pedidos = window.pedidos || [];
  
  document.getElementById('totalFuncionarios').textContent = funcionarios.length;
  document.getElementById('totalPizzas').textContent = (window.cardapio || []).length;
  
  // Pedidos de hoje
  const hoje = new Date().toDateString();
  const pedidosHoje = pedidos.filter(p => {
    const dataPedido = new Date(p.data.split(' ')[0]);
    return dataPedido.toDateString() === hoje;
  });
  document.getElementById('totalPedidos').textContent = pedidosHoje.length;
  
  // Lista de funcionários
  renderDashboardFuncionarios();
  
  // Lista de pedidos
  renderDashboardPedidos();
}

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
          <button class="btn-edit" data-index="${index}">Editar</button>
          <button class="btn-delete" data-index="${index}">Excluir</button>
        </div>
      </td>
    </tr>
  `).join('');
  
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      if (confirm(`Tem certeza que deseja excluir ${window.funcionarios[index].nome}?`)) {
        window.funcionarios.splice(index, 1);
        renderDashboard();
        renderFuncionariosPublic();
      }
    });
  });
  
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      const func = window.funcionarios[index];
      const novoNome = prompt('Novo nome:', func.nome);
      if (novoNome && novoNome.trim()) {
        func.nome = novoNome.trim();
        const novoCargo = prompt('Novo cargo:', func.cargo);
        if (novoCargo && novoCargo.trim()) func.cargo = novoCargo.trim();
        const novaDesc = prompt('Nova descrição:', func.descricao || '');
        if (novaDesc !== null) func.descricao = novaDesc;
        renderDashboard();
        renderFuncionariosPublic();
      }
    });
  });
}

function renderDashboardPedidos() {
  const list = document.getElementById('dashboardPedidosList');
  if (!list) return;
  const pedidos = window.pedidos || [];
  
  if (pedidos.length === 0) {
    list.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem;">Nenhum pedido realizado.</td></tr>';
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
          <button class="btn-status" onclick="alterarStatusPedido(${index})">Alterar Status</button>
          <button class="btn-edit" onclick="verDetalhesPedido(${p.id})">Detalhes</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function alterarStatusPedido(index) {
  const pedidos = window.pedidos;
  const statusOptions = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
  const currentIndex = statusOptions.indexOf(pedidos[index].status);
  const nextIndex = (currentIndex + 1) % statusOptions.length;
  pedidos[index].status = statusOptions[nextIndex];
  renderDashboard();
  // Atualiza também a visualização pública se estiver na página
  if (document.getElementById('page-meus-pedidos').classList.contains('active')) {
    const telefone = document.getElementById('consultaTelefone').value;
    if (telefone) consultarPedidos(telefone);
  }
}

// ===== RENDER FUNCIONÁRIOS (PÁGINA PÚBLICA) =====
function renderFuncionariosPublic() {
  const grid = document.getElementById('funcionariosGrid');
  if (!grid) return;
  const lista = window.funcionarios || [];
  if (lista.length === 0) {
    grid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">Nenhum funcionário cadastrado.</p>';
    return;
  }
  grid.innerHTML = lista.map(f => `
    <div class="funcionario-card">
      <i class="fas fa-user-circle"></i>
      <h4>${f.nome}</h4>
      <p class="cargo">${f.cargo}</p>
      <p style="font-size:0.85rem; color:#7a5f4a;">${f.descricao || ''}</p>
    </div>
  `).join('');
}

// ===== MODAL - ADICIONAR FUNCIONÁRIO =====
const modal = document.getElementById('modalFuncionario');
const btnAdd = document.getElementById('btnAddFuncionario');
const closeModal = document.querySelector('.modal-close');

btnAdd.addEventListener('click', () => {
  modal.classList.add('show');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});

document.getElementById('formAddFuncionario').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('addNome').value.trim();
  const cargo = document.getElementById('addCargo').value.trim();
  const descricao = document.getElementById('addDescricao').value.trim();
  
  if (!nome || !cargo) {
    alert('Preencha nome e cargo!');
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
  renderFuncionariosPublic();
  alert('Funcionário adicionado com sucesso!');
});

// ===== CONTATO =====
const formContato = document.getElementById('contatoForm');
if (formContato) {
  formContato.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada! Em breve retornamos o contato.');
    formContato.reset();
  });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.cardapio !== 'undefined') renderCardapio('todas');
  if (typeof window.funcionarios !== 'undefined') {
    renderFuncionariosPublic();
  }
  if (typeof window.pedidos !== 'undefined') {
    // Mostra alguns pedidos na página inicial
    const lista = document.getElementById('pedidosLista');
    if (lista) {
      lista.innerHTML = `
        <div style="text-align:center; padding:2rem; color:#7a5f4a;">
          <i class="fas fa-phone-alt" style="font-size:3rem; color:#8b1e1e; margin-bottom:1rem; display:block;"></i>
          <p>Digite seu telefone acima para consultar seus pedidos.</p>
        </div>
      `;
    }
  }
});

// ===== FALLBACK =====
setTimeout(() => {
  if (document.getElementById('cardapioGrid')?.children.length === 0) {
    renderCardapio('todas');
  }
  if (document.getElementById('funcionariosGrid')?.children.length === 0) {
    renderFuncionariosPublic();
  }
}, 200);