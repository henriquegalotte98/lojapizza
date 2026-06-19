const API_URL = '/api';

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  const corpo = resposta.status === 204 ? null : await resposta.json();
  if (!resposta.ok) throw new Error(corpo?.erro || 'Não foi possível concluir a operação.');
  return corpo;
}

const api = {
  produtos: (todos = false) => requisicao(`/produtos${todos ? '/todos' : ''}`),
  criarProduto: produto => requisicao('/produtos', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(produto)
  }),
  atualizarProduto: (id, produto) => requisicao(`/produtos/${id}`, {
    method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(produto)
  }),
  excluirProduto: id => requisicao(`/produtos/${id}`, {method: 'DELETE'}),
  enviarImagem: (id, arquivo) => {
    const dados = new FormData();
    dados.append('file', arquivo);
    return requisicao(`/produtos/${id}/imagem`, {method: 'POST', body: dados});
  },
  criarPedido: pedido => requisicao('/pedidos', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(pedido)
  }),
  pedidos: () => requisicao('/pedidos'),
  pedidosPorTelefone: telefone => requisicao(`/pedidos/cliente/${encodeURIComponent(telefone)}`),
  atualizarStatus: (id, status) => requisicao(`/pedidos/${id}/status`, {
    method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status})
  })
};
