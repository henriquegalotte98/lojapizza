// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
const navLinks = document.querySelectorAll('.nav-menu a[data-page]');
const pages = {
  home: document.getElementById('page-home'),
  cardapio: document.getElementById('page-cardapio'),
  funcionarios: document.getElementById('page-funcionarios'),
  contato: document.getElementById('page-contato')
};

function navigateTo(pageId) {
  // Esconde todas
  Object.values(pages).forEach(p => p.classList.remove('active'));
  // Mostra a página alvo
  if (pages[pageId]) pages[pageId].classList.add('active');
  // Atualiza menu
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });
  // Scroll suave para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    if (page) navigateTo(page);
  });
});

// Links dos botões "Ver Cardápio" e "Faça seu Pedido"
document.querySelectorAll('[data-page="cardapio"]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('cardapio');
  });
});

// ===== CARRINHO (simples) =====
let cartCount = 0;
const cartSpan = document.getElementById('cartCount');

// Adiciona evento de "comprar" nos itens do cardápio (delegação)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-comprar');
  if (btn) {
    e.preventDefault();
    cartCount++;
    cartSpan.textContent = cartCount;
    // Feedback visual
    btn.textContent = '✓ Adicionado';
    setTimeout(() => { btn.textContent = 'Comprar'; }, 800);
  }
});

// ===== RENDERIZAR DESTAQUES (HOME) =====
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

// ===== RENDERIZAR CARDÁPIO =====
function renderCardapio(categoria = 'todas') {
  const grid = document.getElementById('cardapioGrid');
  if (!grid) return;
  // Dados vindos do cardapio-data.js (array 'cardapio')
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

// Filtros do cardápio
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCardapio(btn.dataset.categoria);
  });
});

// ===== RENDERIZAR FUNCIONÁRIOS =====
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

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  // Se os dados estiverem carregados, renderiza
  if (typeof window.cardapio !== 'undefined') renderCardapio('todas');
  if (typeof window.funcionarios !== 'undefined') renderFuncionarios();

  // Formulário de contato (simples)
  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Mensagem enviada! Em breve retornamos o contato.');
      form.reset();
    });
  }
});

// Re-renderiza caso os dados cheguem depois (fallback)
setTimeout(() => {
  if (document.getElementById('cardapioGrid')?.children.length === 0) {
    renderCardapio('todas');
  }
  if (document.getElementById('funcionariosGrid')?.children.length === 0) {
    renderFuncionarios();
  }
}, 200);