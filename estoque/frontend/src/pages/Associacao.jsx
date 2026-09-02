import { useState, useEffect } from 'react';
import { produtoApi, fornecedorApi, associacaoApi } from '../api';

export default function Associacao() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [fornecedoresAssociados, setFornecedoresAssociados] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    produtoApi.listar().then(setProdutos);
    fornecedorApi.listar().then(setFornecedores);
  }, []);

  useEffect(() => {
    if (produtoSelecionado) {
      associacaoApi.listarFornecedores(produtoSelecionado).then(setFornecedoresAssociados);
    } else {
      setFornecedoresAssociados([]);
    }
  }, [produtoSelecionado]);

  async function associar() {
    if (!produtoSelecionado || !fornecedorSelecionado) {
      exibirMensagem('Selecione um produto e um fornecedor', 'erro');
      return;
    }
    try {
      await associacaoApi.associar(produtoSelecionado, fornecedorSelecionado);
      exibirMensagem('Fornecedor associado com sucesso ao produto!', 'sucesso');
      setFornecedorSelecionado('');
      const lista = await associacaoApi.listarFornecedores(produtoSelecionado);
      setFornecedoresAssociados(lista);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao associar fornecedor';
      exibirMensagem(msg, 'erro');
    }
  }

  async function desassociar(fornecedorId) {
    if (!confirm('Deseja desassociar este fornecedor?')) return;
    try {
      await associacaoApi.desassociar(produtoSelecionado, fornecedorId);
      exibirMensagem('Fornecedor desassociado com sucesso!', 'sucesso');
      const lista = await associacaoApi.listarFornecedores(produtoSelecionado);
      setFornecedoresAssociados(lista);
    } catch (err) {
      exibirMensagem('Erro ao desassociar fornecedor', 'erro');
    }
  }

  function exibirMensagem(texto, tipo) {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  }

  const produto = produtos.find(p => String(p.id) === String(produtoSelecionado));

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Associação de Fornecedor a Produto</h2>

      {mensagem.texto && (
        <div style={{ ...styles.alerta, background: mensagem.tipo === 'sucesso' ? '#c6f6d5' : '#fed7d7', color: mensagem.tipo === 'sucesso' ? '#276749' : '#9b2c2c' }}>
          {mensagem.texto}
        </div>
      )}

      <div style={styles.card}>
        <h3 style={styles.secao}>Selecionar Produto</h3>
        <select style={styles.select} value={produtoSelecionado} onChange={e => { setProdutoSelecionado(e.target.value); setFornecedorSelecionado(''); }}>
          <option value="">Selecione um produto</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.codigoBarras}</option>)}
        </select>
      </div>

      {produto && (
        <>
          <div style={styles.card}>
            <h3 style={styles.secao}>Detalhes do Produto</h3>
            <div style={styles.detalheGrid}>
              <div><span style={styles.detalheLabel}>Nome:</span> {produto.nome}</div>
              <div><span style={styles.detalheLabel}>Código de Barras:</span> {produto.codigoBarras}</div>
              <div><span style={styles.detalheLabel}>Categoria:</span> {produto.categoria}</div>
              <div><span style={styles.detalheLabel}>Descrição:</span> {produto.descricao}</div>
            </div>
            {produto.imagemUrl && (
              <div style={{ marginTop: 10 }}>
                <span style={styles.detalheLabel}>Imagem:</span>
                <img src={produto.imagemUrl} alt={produto.nome}
                  style={{ display: 'block', marginTop: 6, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #cbd5e0' }} />
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={styles.secao}>Associar Fornecedor</h3>
            <div style={styles.row}>
              <select style={{ ...styles.select, flex: 1 }} value={fornecedorSelecionado} onChange={e => setFornecedorSelecionado(e.target.value)}>
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nomeEmpresa} — {f.cnpj}</option>)}
              </select>
              <button onClick={associar} style={styles.btnPrimario}>Associar Fornecedor</button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.secao}>Fornecedores Associados</h3>
            {fornecedoresAssociados.length === 0
              ? <p style={{ color: '#718096' }}>Nenhum fornecedor associado a este produto.</p>
              : (
                <table style={styles.tabela}>
                  <thead>
                    <tr>
                      {['Nome da Empresa', 'CNPJ', 'Contato', 'Ação'].map(h => <th key={h} style={styles.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {fornecedoresAssociados.map(f => (
                      <tr key={f.id}>
                        <td style={styles.td}>{f.nomeEmpresa}</td>
                        <td style={styles.td}>{f.cnpj}</td>
                        <td style={styles.td}>{f.contatoPrincipal}</td>
                        <td style={styles.td}>
                          <button onClick={() => desassociar(f.id)} style={styles.btnRemover}>Desassociar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '0 auto', padding: 24 },
  titulo: { fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#2d3748' },
  card: { background: '#f7fafc', padding: 20, borderRadius: 8, marginBottom: 20 },
  secao: { fontSize: 16, fontWeight: 700, color: '#4a5568', marginBottom: 12, marginTop: 0 },
  select: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  row: { display: 'flex', gap: 12, alignItems: 'center' },
  detalheGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14 },
  detalheLabel: { fontWeight: 600, color: '#4a5568' },
  alerta: { padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontWeight: 600 },
  btnPrimario: { background: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#edf2f7', padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 700 },
  td: { padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontSize: 14 },
  btnRemover: { background: '#fc8181', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 },
};
