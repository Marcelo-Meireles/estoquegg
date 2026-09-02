import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { produtoApi } from '../api';

const CATEGORIAS = ['Eletrônicos', 'Alimentos', 'Vestuário', 'Higiene', 'Limpeza', 'Ferramentas', 'Outro'];

const camposVazios = {
  nome: '', codigoBarras: '', descricao: '', quantidadeEstoque: 0,
  categoria: '', dataValidade: '', imagemUrl: '',
};

export default function Produtos() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(camposVazios);
  const [categoriaCustom, setCategoriaCustom] = useState('');
  const [imagemFile, setImagemFile] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [erros, setErros] = useState({});
  const fileRef = useRef(null);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const data = await produtoApi.listar();
    setLista(data);
  }

  function validar() {
    const e = {};
    if (!form.nome) e.nome = 'Nome do produto é obrigatório';
    if (!form.codigoBarras) e.codigoBarras = 'Código de barras é obrigatório';
    if (!form.descricao) e.descricao = 'Descrição é obrigatória';
    if (!form.categoria) e.categoria = 'Categoria é obrigatória';
    if (form.categoria === 'Outro' && !categoriaCustom.trim())
      e.categoriaCustom = 'Informe a categoria personalizada';
    return e;
  }

  async function salvar(e) {
    e.preventDefault();
    const errosValidacao = validar();
    if (Object.keys(errosValidacao).length) { setErros(errosValidacao); return; }
    setErros({});

    try {
      let imagemUrl = form.imagemUrl;

      if (imagemFile) {
        const fd = new FormData();
        fd.append('file', imagemFile);
        const res = await axios.post('/api/upload', fd);
        imagemUrl = res.data.url;
      }

      const categoriaFinal = form.categoria === 'Outro' ? categoriaCustom.trim() : form.categoria;
      const dados = { ...form, categoria: categoriaFinal, imagemUrl };

      if (editandoId) {
        const { codigoBarras, ...semCodigo } = dados;
        await produtoApi.atualizar(editandoId, semCodigo);
        exibirMensagem('Produto atualizado com sucesso!', 'sucesso');
      } else {
        await produtoApi.criar(dados);
        exibirMensagem('Produto cadastrado com sucesso!', 'sucesso');
      }

      resetForm();
      carregar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao salvar produto';
      exibirMensagem(Array.isArray(msg) ? msg.join(', ') : msg, 'erro');
    }
  }

  async function remover(id) {
    if (!confirm('Deseja remover este produto?')) return;
    await produtoApi.remover(id);
    exibirMensagem('Produto removido com sucesso!', 'sucesso');
    carregar();
  }

  function editar(p) {
    setEditandoId(p.id);
    const catCustom = CATEGORIAS.includes(p.categoria) ? '' : p.categoria;
    setForm({
      nome: p.nome, codigoBarras: p.codigoBarras, descricao: p.descricao,
      quantidadeEstoque: p.quantidadeEstoque,
      categoria: CATEGORIAS.includes(p.categoria) ? p.categoria : 'Outro',
      dataValidade: p.dataValidade || '', imagemUrl: p.imagemUrl || '',
    });
    setCategoriaCustom(catCustom);
    setImagemFile(null);
    window.scrollTo(0, 0);
  }

  function resetForm() {
    setEditandoId(null);
    setForm(camposVazios);
    setCategoriaCustom('');
    setImagemFile(null);
    if (fileRef.current) fileRef.current.value = '';
    setErros({});
  }

  function exibirMensagem(texto, tipo) {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
  }

  const campo = (label, name, placeholder, type = 'text') => (
    <div style={styles.campo}>
      <label style={styles.label}>{label}</label>
      <input style={{ ...styles.input, borderColor: erros[name] ? '#e53e3e' : '#cbd5e0' }}
        type={type} placeholder={placeholder} value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })} />
      {erros[name] && <span style={styles.erro}>{erros[name]}</span>}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Cadastro de Produto</h2>

      {mensagem.texto && (
        <div style={{ ...styles.alerta, background: mensagem.tipo === 'sucesso' ? '#c6f6d5' : '#fed7d7', color: mensagem.tipo === 'sucesso' ? '#276749' : '#9b2c2c' }}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={salvar} style={styles.form}>
        {campo('Nome do Produto *', 'nome', 'Insira o nome do produto')}
        {!editandoId && campo('Código de Barras *', 'codigoBarras', 'Insira o código de barras')}

        <div style={styles.campo}>
          <label style={styles.label}>Descrição *</label>
          <textarea style={{ ...styles.input, borderColor: erros.descricao ? '#e53e3e' : '#cbd5e0', minHeight: 80, resize: 'vertical' }}
            placeholder="Descreva brevemente o produto" value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })} />
          {erros.descricao && <span style={styles.erro}>{erros.descricao}</span>}
        </div>

        {campo('Quantidade em Estoque', 'quantidadeEstoque', 'Quantidade disponível', 'number')}

        <div style={styles.campo}>
          <label style={styles.label}>Categoria *</label>
          <select style={{ ...styles.input, borderColor: erros.categoria ? '#e53e3e' : '#cbd5e0' }}
            value={form.categoria} onChange={e => { setForm({ ...form, categoria: e.target.value }); setCategoriaCustom(''); }}>
            <option value="">Selecione uma categoria</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {erros.categoria && <span style={styles.erro}>{erros.categoria}</span>}
        </div>

        {form.categoria === 'Outro' && (
          <div style={styles.campo}>
            <label style={styles.label}>Especifique a categoria *</label>
            <input style={{ ...styles.input, borderColor: erros.categoriaCustom ? '#e53e3e' : '#cbd5e0' }}
              placeholder="Digite o nome da categoria" value={categoriaCustom}
              onChange={e => setCategoriaCustom(e.target.value)} />
            {erros.categoriaCustom && <span style={styles.erro}>{erros.categoriaCustom}</span>}
          </div>
        )}

        {campo('Data de Validade', 'dataValidade', '', 'date')}

        <div style={styles.campo}>
          <label style={styles.label}>Imagem do Produto</label>
          <input ref={fileRef} type="file" accept="image/*" style={styles.fileInput}
            onChange={e => setImagemFile(e.target.files[0] || null)} />
          {(imagemFile || form.imagemUrl) && (
            <div style={{ marginTop: 8 }}>
              <img
                src={imagemFile ? URL.createObjectURL(imagemFile) : form.imagemUrl}
                alt="Preview"
                style={{ height: 80, borderRadius: 4, objectFit: 'cover', border: '1px solid #cbd5e0' }}
              />
            </div>
          )}
        </div>

        <div style={styles.botoes}>
          <button type="submit" style={styles.btnPrimario}>{editandoId ? 'Salvar Alterações' : 'Cadastrar'}</button>
          {editandoId && <button type="button" onClick={resetForm} style={styles.btnSecundario}>Cancelar</button>}
        </div>
      </form>

      <h3 style={{ marginTop: 32 }}>Produtos cadastrados</h3>
      {lista.length === 0 ? <p style={{ color: '#718096' }}>Nenhum produto cadastrado.</p> : (
        <table style={styles.tabela}>
          <thead>
            <tr>{['Imagem', 'Nome', 'Cód. Barras', 'Categoria', 'Qtd.', 'Fornecedores', 'Ações'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {lista.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>
                  {p.imagemUrl
                    ? <img src={p.imagemUrl} alt={p.nome} style={{ height: 40, objectFit: 'cover', borderRadius: 4 }} />
                    : <span style={{ color: '#a0aec0', fontSize: 12 }}>—</span>}
                </td>
                <td style={styles.td}>{p.nome}</td>
                <td style={styles.td}>{p.codigoBarras}</td>
                <td style={styles.td}>{p.categoria}</td>
                <td style={styles.td}>{p.quantidadeEstoque}</td>
                <td style={styles.td}>{p.fornecedores?.map(f => f.nomeEmpresa).join(', ') || '—'}</td>
                <td style={styles.td}>
                  <button onClick={() => editar(p)} style={styles.btnEditar}>Editar</button>
                  <button onClick={() => remover(p.id)} style={styles.btnRemover}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 960, margin: '0 auto', padding: 24 },
  titulo: { fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#2d3748' },
  form: { background: '#f7fafc', padding: 24, borderRadius: 8, marginBottom: 24 },
  campo: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, color: '#4a5568', fontSize: 14 },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  fileInput: { display: 'block', fontSize: 14 },
  erro: { color: '#e53e3e', fontSize: 12, marginTop: 4, display: 'block' },
  alerta: { padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontWeight: 600 },
  botoes: { display: 'flex', gap: 12, marginTop: 8 },
  btnPrimario: { background: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 },
  btnSecundario: { background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#edf2f7', padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 700 },
  td: { padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontSize: 14, verticalAlign: 'middle' },
  btnEditar: { background: '#ecc94b', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 6, cursor: 'pointer', fontWeight: 600 },
  btnRemover: { background: '#fc8181', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 },
};
