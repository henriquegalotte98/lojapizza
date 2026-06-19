let produtos = [];
let carrinho = [];
let produtoEmEdicao = null;
let produtosAdmin = [];

const dinheiro = valor => Number(valor).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
const escapar = valor => String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function avisar(texto, tipo = 'info') {
  const elemento = document.createElement('div');
  elemento.className = `notificacao ${tipo}`;
  elemento.textContent = texto;
  document.body.appendChild(elemento);
  setTimeout(() => elemento.remove(), 3000);
}

function navegar(pagina) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pagina}`)?.classList.add('active');
  document.querySelectorAll('.nav-menu [data-page]').forEach(link =>
    link.classList.toggle('active', link.dataset.page === pagina));
  if (pagina === 'carrinho') renderCarrinho();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

document.addEventListener('click', evento => {
  const link = evento.target.closest('[data-page]');
  if (link) {
    evento.preventDefault();
    navegar(link.dataset.page);
  }
});

async function carregarCardapio() {
  const grid = document.getElementById('cardapioGrid');
  grid.innerHTML = '<p>Carregando cardápio...</p>';
  try {
    produtos = await api.produtos();
    renderCardapio();
  } catch (erro) {
    grid.innerHTML = `<p class="erro">${escapar(erro.message)}</p>`;
  }
}

function renderCardapio() {
  const grid = document.getElementById('cardapioGrid');
  if (!produtos.length) {
    grid.innerHTML = '<p>Nenhuma pizza ativa cadastrada.</p>';
    return;
  }
  grid.innerHTML = produtos.map(produto => `
    <article class="cardapio-item">
      ${produto.imagem
        ? `<img class="produto-imagem" src="${escapar(produto.imagem)}" alt="${escapar(produto.nome)}">`
        : '<div class="produto-sem-imagem"><i class="fas fa-pizza-slice"></i></div>'}
      <h3>${escapar(produto.nome)}</h3>
      <p>${escapar(produto.descricao)}</p>
      <div class="precos-tamanhos">
        <span>P ${dinheiro(produto.precoPequena)}</span>
        <span>M ${dinheiro(produto.precoMedia)}</span>
        <span>G ${dinheiro(produto.precoGrande)}</span>
      </div>
      <div class="compra-controles">
        <select id="tamanho-${produto.id}" aria-label="Tamanho da pizza">
          <option value="P">Pequena</option><option value="M" selected>Média</option><option value="G">Grande</option>
        </select>
        <button class="btn btn-comprar" onclick="adicionar(${produto.id})">Adicionar</button>
      </div>
    </article>`).join('');
}

function adicionar(id) {
  const produto = produtos.find(p => p.id === id);
  const tamanho = document.getElementById(`tamanho-${id}`).value;
  const chave = `${id}-${tamanho}`;
  const item = carrinho.find(i => i.chave === chave);
  const preco = Number(produto[{P:'precoPequena', M:'precoMedia', G:'precoGrande'}[tamanho]]);
  if (item) item.quantidade++;
  else carrinho.push({chave, produtoId:id, nome:produto.nome, tamanho, preco, quantidade:1});
  atualizarContador();
  avisar(`${produto.nome} adicionada.`, 'success');
}

function atualizarContador() {
  document.getElementById('cartCount').textContent = carrinho.reduce((s, i) => s + i.quantidade, 0);
}

function renderCarrinho() {
  const vazio = document.getElementById('carrinhoVazio');
  const cheio = document.getElementById('carrinhoCheio');
  vazio.style.display = carrinho.length ? 'none' : 'block';
  cheio.style.display = carrinho.length ? 'block' : 'none';
  if (!carrinho.length) return;
  document.getElementById('carrinhoItems').innerHTML = carrinho.map(item => `
    <div class="carrinho-item">
      <div class="carrinho-item-info"><h4>${escapar(item.nome)} (${item.tamanho})</h4><p>${dinheiro(item.preco)}</p></div>
      <div class="carrinho-item-qtd">
        <button onclick="quantidade('${item.chave}',-1)">−</button><span>${item.quantidade}</span>
        <button onclick="quantidade('${item.chave}',1)">+</button>
      </div>
      <strong>${dinheiro(item.preco * item.quantidade)}</strong>
      <button class="carrinho-item-remove" onclick="remover('${item.chave}')"><i class="fas fa-times"></i></button>
    </div>`).join('');
  document.getElementById('carrinhoTotal').textContent =
    dinheiro(carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0));
}

function quantidade(chave, valor) {
  const item = carrinho.find(i => i.chave === chave);
  item.quantidade += valor;
  if (item.quantidade <= 0) remover(chave);
  else renderCarrinho();
  atualizarContador();
}

function remover(chave) {
  carrinho = carrinho.filter(i => i.chave !== chave);
  atualizarContador();
  renderCarrinho();
}

document.getElementById('btnLimparCarrinho').onclick = () => { carrinho = []; atualizarContador(); renderCarrinho(); };
document.getElementById('btnFinalizarPedido').onclick = () => {
  if (!carrinho.length) return avisar('O carrinho está vazio.', 'warning');
  document.getElementById('finalizarItems').innerHTML = carrinho.map(i =>
    `<div class="finalizar-item"><span>${escapar(i.nome)} (${i.tamanho}) x${i.quantidade}</span><span>${dinheiro(i.preco*i.quantidade)}</span></div>`
  ).join('');
  document.getElementById('finalizarTotal').textContent =
    dinheiro(carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0));
  navegar('finalizar');
};

document.getElementById('formFinalizar').onsubmit = async evento => {
  evento.preventDefault();
  const form = new FormData(evento.target);
  const pedido = {
    nome: form.get('nome').trim(), telefone: form.get('telefone').trim(), cpf: form.get('cpf').trim(),
    formaPagamento: form.get('formaPagamento'),
    observacao: form.get('observacao').trim(),
    itens: carrinho.map(i => ({produtoId:i.produtoId, tamanho:i.tamanho, quantidade:i.quantidade}))
  };
  try {
    const pedidoCriado = await api.criarPedido(pedido);
    const telefone = pedido.telefone;
    carrinho = []; atualizarContador(); evento.target.reset();
    const horario = pedidoCriado.horarioRetirada.substring(0, 5);
    avisar(`Pedido realizado! Sua pizza estará pronta em ${pedidoCriado.tempoPreparoMinutos} minutos, por volta das ${horario}.`, 'success');
    document.getElementById('consultaTelefone').value = telefone;
    navegar('meus-pedidos');
    consultarPedidos(telefone);
  } catch (erro) { avisar(erro.message, 'error'); }
};

document.getElementById('formConsultaTelefone').onsubmit = evento => {
  evento.preventDefault();
  consultarPedidos(document.getElementById('consultaTelefone').value.trim());
};

async function consultarPedidos(telefone) {
  const lista = document.getElementById('pedidosLista');
  try {
    const pedidos = await api.pedidosPorTelefone(telefone);
    lista.innerHTML = pedidos.length ? pedidos.map(cardPedido).join('') : '<p>Nenhum pedido encontrado.</p>';
  } catch (erro) { lista.innerHTML = `<p class="erro">${escapar(erro.message)}</p>`; }
}

function cardPedido(pedido) {
  return `<article class="pedido-card">
    <div class="pedido-header"><strong>Pedido #${pedido.id}</strong><span class="pedido-status status-${pedido.status.toLowerCase()}">${pedido.status.replace('_',' ')}</span></div>
    <p>${pedido.itens.map(i => `${escapar(i.produto.nome)} (${i.tamanho}) x${i.quantidade}`).join(', ')}</p>
    <p><strong>${dinheiro(pedido.valorTotal)}</strong> · Retirada ${pedido.horarioRetirada.substring(0,5)}</p>
  </article>`;
}

document.getElementById('loginForm').onsubmit = evento => {
  evento.preventDefault();
  const usuario = document.getElementById('loginUser').value;
  const senha = document.getElementById('loginPassword').value;
  if (usuario !== 'Admin' || senha !== 'admin123') return avisar('Usuário ou senha incorretos.', 'error');
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('dashboardContainer').style.display = 'block';
  carregarDashboard();
};

document.getElementById('btnLogout').onclick = () => {
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('dashboardContainer').style.display = 'none';
  document.getElementById('loginForm').reset();
};

async function carregarDashboard() {
  try {
    const [listaProdutos, pedidos] = await Promise.all([api.produtos(true), api.pedidos()]);
    renderProdutosAdmin(listaProdutos);
    renderPedidosAdmin(pedidos);
  } catch (erro) { avisar(erro.message, 'error'); }
}

function renderProdutosAdmin(lista) {
  produtosAdmin = lista;
  document.getElementById('dashboardProdutosList').innerHTML = lista.map(p => `
    <tr><td>${escapar(p.nome)}</td><td>${dinheiro(p.precoMedia)}</td><td>${p.ativo ? 'Ativo' : 'Inativo'}</td>
    <td><div class="btn-acoes">
      <button class="btn-edit" onclick="editarProdutoPorId(${p.id})"><i class="fas fa-edit"></i></button>
      <button class="btn-delete" onclick="inativarProduto(${p.id})"><i class="fas fa-trash"></i></button>
    </div></td></tr>`).join('');
}

function renderPedidosAdmin(lista) {
  document.getElementById('dashboardPedidosList').innerHTML = lista.map(p => `
    <tr><td>#${p.id}</td><td>${escapar(p.cliente.nome)}</td><td>${escapar(p.cliente.telefone)}</td>
    <td>${dinheiro(p.valorTotal)}</td><td>${p.status.replace('_',' ')}</td><td>
    ${proximoStatus(p.status) ? `<button class="btn-status" onclick="mudarStatus(${p.id},'${proximoStatus(p.status)}')">${proximoStatus(p.status).replace('_',' ')}</button>` : 'Concluído'}
    ${p.status === 'PRONTO' ? `<button class="btn-delete" onclick="mudarStatus(${p.id},'NAO_VEIO')">NÃO VEIO</button>` : ''}
    </td></tr>`).join('');
}

const proximoStatus = status => ({PENDENTE:'PRONTO', PRONTO:'ENTREGUE'}[status]);
async function mudarStatus(id, status) {
  try { await api.atualizarStatus(id, status); carregarDashboard(); } catch (erro) { avisar(erro.message, 'error'); }
}

document.getElementById('btnAddProduto').onclick = () => editarProduto();
function editarProdutoPorId(id) {
  editarProduto(produtosAdmin.find(produto => produto.id === id));
}

function editarProduto(produto = null) {
  produtoEmEdicao = produto;
  const form = document.getElementById('formProduto');
  form.reset();
  if (produto) {
    form.nome.value = produto.nome;
    form.descricao.value = produto.descricao || '';
    form.precoPequena.value = produto.precoPequena;
    form.precoMedia.value = produto.precoMedia;
    form.precoGrande.value = produto.precoGrande;
    form.ativo.checked = produto.ativo;
  } else form.ativo.checked = true;
  document.getElementById('modalProduto').classList.add('show');
}

document.getElementById('formProduto').onsubmit = async evento => {
  evento.preventDefault();
  const form = evento.target;
  const dados = {
    nome:form.nome.value.trim(), descricao:form.descricao.value.trim(),
    precoPequena:Number(form.precoPequena.value), precoMedia:Number(form.precoMedia.value),
    precoGrande:Number(form.precoGrande.value), ativo:form.ativo.checked
  };
  try {
    const salvo = produtoEmEdicao ? await api.atualizarProduto(produtoEmEdicao.id, dados) : await api.criarProduto(dados);
    if (form.imagem.files[0]) await api.enviarImagem(salvo.id, form.imagem.files[0]);
    document.getElementById('modalProduto').classList.remove('show');
    await Promise.all([carregarCardapio(), carregarDashboard()]);
    avisar('Produto salvo.', 'success');
  } catch (erro) { avisar(erro.message, 'error'); }
};

async function inativarProduto(id) {
  if (!confirm('Deseja retirar esta pizza do cardápio?')) return;
  try { await api.excluirProduto(id); await Promise.all([carregarCardapio(), carregarDashboard()]); }
  catch (erro) { avisar(erro.message, 'error'); }
}

document.querySelectorAll('.modal-close').forEach(x => x.onclick = () => x.closest('.modal').classList.remove('show'));
document.getElementById('cartIcon').onclick = () => navegar('carrinho');
document.addEventListener('DOMContentLoaded', carregarCardapio);
