// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
const navLinks = document.querySelectorAll('.nav-menu a[data-page]');
const pages = {
  home: document.getElementById('page-home'),
  cardapio: document.getElementById('page-cardapio'),
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

document.querySelectorAll('[data-page="cardapio"]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('cardapio');
  });
});

// ===== BOTÃO FUNCIONÁRIOS - ABRE LOGIN =====
document.getElementById('btnFuncionarios').addEventListener('click', (e) => {
  e.preventDefault();
  navigateTo('funcionarios');
  // Mostra login, esconde dashboard
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('dashboardContainer').style.display = 'none';
});

// ===== CARRINHO =====
let cartCount = 0;
const cartSpan = document.getElementById('cartCount');

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-comprar');
  if (btn) {
    e.preventDefault();
    cartCount++;
    cartSpan.textContent = cartCount;
    btn.textContent = '✓ Adicionado';
    setTimeout(() => { btn.textContent = 'Comprar'; }, 800);
  }
});

// ===== LOGIN =====
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPassword').value;
  
  // Credenciais: admin / 123456
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

// ===== DASHBOARD - RENDER FUNCIONÁRIOS =====
function renderDashboard() {
  const list = document.getElementById('dashboardFuncionariosList');
  if (!list) return;
  const funcionarios = window.funcionarios || [];
  
  // Atualiza estatísticas
  document.getElementById('totalFuncionarios').textContent = funcionarios.length;
  document.getElementById('totalPizzas').textContent = (window.cardapio || []).length;
  document.getElementById('totalPedidos').textContent = Math.floor(Math.random() * 30) + 5; // Simulação
  
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
  
  // Eventos de deletar
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      if (confirm(`Tem certeza que deseja excluir ${window.funcionarios[index].nome}?`)) {
        window.funcionarios.splice(index, 1);
        renderDashboard();
        renderFuncionarios(); // Atualiza a visualização pública
      }
    });
  });
  
  // Eventos de editar (simples)
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
        renderFuncionarios();
      }
    });
  });
}

// ===== RENDER FUNCIONÁRIOS (página pública) =====
function renderFuncionarios() {
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
  renderFuncionarios();
  alert('Funcionário adicionado com sucesso!');
});

// ===== CONTATO =====
const form = document.getElementById('contatoForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensagem enviada! Em breve retornamos o contato.');
    form.reset();
  });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.cardapio !== 'undefined') renderCardapio('todas');
  if (typeof window.funcionarios !== 'undefined') {
    renderFuncionarios();
    // Se estiver logado, renderiza dashboard também
    if (document.getElementById('dashboardContainer').style.display !== 'none') {
      renderDashboard();
    }
  }
});

// ===== FALLBACK =====
setTimeout(() => {
  if (document.getElementById('cardapioGrid')?.children.length === 0) {
    renderCardapio('todas');
  }
  if (document.getElementById('funcionariosGrid')?.children.length === 0) {
    renderFuncionarios();
  }
}, 200);