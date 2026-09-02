import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const produtoApi = {
  listar: () => api.get('/produtos').then(r => r.data),
  buscar: (id) => api.get(`/produtos/${id}`).then(r => r.data),
  criar: (data) => api.post('/produtos', data).then(r => r.data),
  atualizar: (id, data) => api.put(`/produtos/${id}`, data).then(r => r.data),
  remover: (id) => api.delete(`/produtos/${id}`).then(r => r.data),
};

export const fornecedorApi = {
  listar: () => api.get('/fornecedores').then(r => r.data),
  buscar: (id) => api.get(`/fornecedores/${id}`).then(r => r.data),
  criar: (data) => api.post('/fornecedores', data).then(r => r.data),
  atualizar: (id, data) => api.put(`/fornecedores/${id}`, data).then(r => r.data),
  remover: (id) => api.delete(`/fornecedores/${id}`).then(r => r.data),
};

export const associacaoApi = {
  associar: (produtoId, fornecedorId) =>
    api.post(`/produtos/${produtoId}/fornecedores/${fornecedorId}`).then(r => r.data),
  desassociar: (produtoId, fornecedorId) =>
    api.delete(`/produtos/${produtoId}/fornecedores/${fornecedorId}`).then(r => r.data),
  listarFornecedores: (produtoId) =>
    api.get(`/produtos/${produtoId}/fornecedores`).then(r => r.data),
};
