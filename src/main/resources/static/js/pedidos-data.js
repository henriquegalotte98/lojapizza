// pedidos-data.js
window.pedidos = [
  {
    id: 1,
    cliente: 'João Silva',
    telefone: '(11) 99999-1111',
    endereco: 'Rua das Flores, 123 - Centro',
    formaPagamento: 'cartao-credito',
    observacoes: 'Sem cebola na pizza',
    itens: [
      { nome: 'Margherita', quantidade: 2, preco: 39.90 },
      { nome: 'Refrigerante 2L', quantidade: 1, preco: 12.90 }
    ],
    total: 92.70,
    status: 'entregue',
    data: '2026-06-15 19:30'
  },
  {
    id: 2,
    cliente: 'Maria Oliveira',
    telefone: '(11) 99999-2222',
    endereco: 'Av. Principal, 456 - Jardim',
    formaPagamento: 'pix',
    observacoes: 'Entregar no portão',
    itens: [
      { nome: 'Pepperoni', quantidade: 1, preco: 45.90 },
      { nome: 'Suco Natural', quantidade: 2, preco: 9.90 }
    ],
    total: 65.70,
    status: 'preparando',
    data: '2026-06-16 20:15'
  },
  {
    id: 3,
    cliente: 'Carlos Santos',
    telefone: '(11) 99999-3333',
    endereco: 'Rua dos Pássaros, 789 - Parque',
    formaPagamento: 'dinheiro',
    observacoes: 'Troco para 100',
    itens: [
      { nome: '4 Queijos', quantidade: 1, preco: 49.90 },
      { nome: 'Chocolate com Morango', quantidade: 1, preco: 39.90 },
      { nome: 'Água Mineral', quantidade: 2, preco: 5.90 }
    ],
    total: 101.60,
    status: 'pendente',
    data: '2026-06-16 21:00'
  },
  {
    id: 4,
    cliente: 'Ana Paula Lima',
    telefone: '(11) 99999-4444',
    endereco: 'Rua das Palmeiras, 100 - Bairro Novo',
    formaPagamento: 'cartao-debito',
    observacoes: '',
    itens: [
      { nome: 'Calabresa', quantidade: 1, preco: 41.90 },
      { nome: 'Nutella com Marshmallow', quantidade: 1, preco: 44.90 }
    ],
    total: 86.80,
    status: 'pronto',
    data: '2026-06-16 19:45'
  }
];