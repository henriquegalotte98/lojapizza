// ===== DADOS DO CARDÁPIO =====
window.cardapio = [
  { id: 1, nome: 'Margherita', categoria: 'salgada', descricao: 'Molho, mussarela, manjericão', preco: 39.90 },
  { id: 2, nome: 'Pepperoni', categoria: 'salgada', descricao: 'Molho, mussarela, pepperoni', preco: 45.90 },
  { id: 3, nome: 'Portuguesa', categoria: 'salgada', descricao: 'Presunto, ovos, cebola, azeitonas', preco: 43.90 },
  { id: 4, nome: '4 Queijos', categoria: 'salgada', descricao: 'Mussarela, provolone, parmesão, gorgonzola', preco: 49.90 },
  { id: 5, nome: 'Calabresa', categoria: 'salgada', descricao: 'Calabresa, cebola, azeitonas', preco: 41.90 },
  { id: 6, nome: 'Frango com Catupiry', categoria: 'salgada', descricao: 'Frango desfiado, catupiry, milho', preco: 47.90 },
  { id: 7, nome: 'Chocolate com Morango', categoria: 'doce', descricao: 'Chocolate derretido, morangos frescos', preco: 39.90 },
  { id: 8, nome: 'Banana com Canela', categoria: 'doce', descricao: 'Banana caramelizada, canela', preco: 37.90 },
  { id: 9, nome: 'Nutella com Marshmallow', categoria: 'doce', descricao: 'Nutella, marshmallows tostados', preco: 44.90 },
  { id: 10, nome: 'Refrigerante 2L', categoria: 'bebida', descricao: 'Coca-Cola, Guaraná ou Fanta', preco: 12.90 },
  { id: 11, nome: 'Suco Natural', categoria: 'bebida', descricao: 'Laranja, limão ou abacaxi', preco: 9.90 },
  { id: 12, nome: 'Água Mineral', categoria: 'bebida', descricao: 'Com ou sem gás', preco: 5.90 },
  { id: 13, nome: 'Cerveja Artesanal', categoria: 'bebida', descricao: 'IPA ou Pilsen', preco: 14.90 }
];

// ===== FUNCIONÁRIOS =====
window.funcionarios = [
  { id: 1, nome: 'Carlos Portello', cargo: 'Proprietário / Mestre Pizzaiolo', descricao: '40 anos de tradição familiar' },
  { id: 2, nome: 'Mariana Souza', cargo: 'Gerente', descricao: 'Experiência em hospitalidade' },
  { id: 3, nome: 'Roberto Alves', cargo: 'Pizzaiolo Sênior', descricao: 'Especialista em massas' },
  { id: 4, nome: 'Ana Paula Lima', cargo: 'Atendente', descricao: 'Simpatia e agilidade' },
  { id: 5, nome: 'João Mendes', cargo: 'Entregador', descricao: 'Entrega com rapidez e segurança' },
  { id: 6, nome: 'Fernanda Rocha', cargo: 'Auxiliar de Cozinha', descricao: 'Organização e higiene' }
];

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

// ===== RENDERIZAR CARDÁPIO =====
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
    <div class="cardapio-item" data-id="${item.id}">
      <h3>${item.nome}</h3>
      <span class="categoria-badge">${item.categoria}</span>
      <p>${item.descricao || ''}</p>
      <p class="preco">R$ ${item.preco.toFixed(2)}</p>
      <button class="btn btn-comprar" data-id="${item.id}">
        <i class="fas fa-cart-plus"></i> Comprar
      </button>
    </div>
  `).join('');
}

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
    <div class="funcionario-card" data-id="${f.id}">
      <i class="fas fa-user-circle"></i>
      <h4>${f.nome}</h4>
      <p class="cargo">${f.cargo}</p>
      <p style="font-size:0.85rem; color:#7a5f4a;">${f.descricao || ''}</p>
    </div>
  `).join('');
}

// ===== NAVEGAÇÃO ENTRE PÁGINAS =====
function setupNavigation() {
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

  // Navegação para "Meus Pedidos" já é um link normal
}

// ===== FILTROS DO CARDÁPIO =====
function setupFilters() {
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCardapio(btn.dataset.categoria);
    });
  });
}

// ===== FORMULÁRIO DE CONTATO =====
function setupContato() {
  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Mensagem enviada! Em breve retornamos o contato.');
      form.reset();
    });
  }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  renderDestaques();
  renderCardapio('todas');
  renderFuncionarios();
  setupNavigation();
  setupFilters();
  setupContato();
});