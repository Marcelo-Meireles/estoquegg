import { useState, useEffect } from 'react';
import { fornecedorApi } from '../api';

const camposVazios = {
  nomeEmpresa: '', cnpj: '', endereco: '', telefone: '', email: '', contatoPrincipal: '',
};

export default function Fornecedores() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(camposVazios);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [erros, setErros] = useState({});

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const data = await fornecedorApi.listar();
    setLista(data);
  }

  function validar() {
    const e = {};
    if (!form.nomeEmpresa) e.nomeEmpresa = 'Nome da empresa é obrigatório';
    if (!form.cnpj) e.cnpj = 'CNPJ é obrigatório';
    else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(form.cnpj))
      e.cnpj = 'CNPJ deve estar no formato 00.000.000/0000-00';
    if (!form.endereco) e.endereco = 'Endereço é obrigatório';
    if (!form.telefone) e.telefone = 'Telefone é obrigatório';
    if (!form.email) e.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido';
    if (!form.contatoPrincipal) e.contatoPrincipal = 'Contato principal é obrigatório';
    return e;
  }

  async function salvar(e) {
    e.preventDefault();
    const errosValidacao = validar();
    if (Object.keys(errosValidacao).length) { setErros(errosValidacao); return; }
    setErros({});
    try {
      if (editandoId) {
        await fornecedorApi.atualizar(editandoId, form);
        exibirMensagem('Fornecedor atualizado com sucesso!', 'sucesso');
      } else {
        await fornecedorApi.criar(form);
        exibirMensagem('Fornecedor cadastrado com sucesso!', 'sucesso');
      }
      setForm(camposVazios);
      setEditandoId(null);
      carregar();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao salvar fornecedor';
      exibirMensagem(Array.isArray(msg) ? msg.join(', ') : msg, 'erro');
    }
  }

  async function remover(id) {
    if (!confirm('Deseja remover este fornecedor?')) return;
    await fornecedorApi.remover(id);
    exibirMensagem('Fornecedor removido com sucesso!', 'sucesso');
    carregar();
  }

  function editar(f) {
    setEditandoId(f.id);
    setForm({ nomeEmpresa: f.nomeEmpresa, cnpj: f.cnpj, endereco: f.endereco, telefone: f.telefone, email: f.email, contatoPrincipal: f.contatoPrincipal });
    window.scrollTo(0, 0);
  }

  function cancelar() { setEditandoId(null); setForm(camposVazios); setErros({}); }

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
      <h2 style={styles.titulo}>Cadastro de Fornecedor</h2>

      {mensagem.texto && (
        <div style={{ ...styles.alerta, background: mensagem.tipo === 'sucesso' ? '#c6f6d5' : '#fed7d7', color: mensagem.tipo === 'sucesso' ? '#276749' : '#9b2c2c' }}>
          {mensagem.texto}
        </div>
      )}

      <form onSubmit={salvar} style={styles.form}>
        {campo('Nome da Empresa *', 'nomeEmpresa', 'Insira o nome da empresa')}
        {!editandoId && campo('CNPJ *', 'cnpj', '00.000.000/0000-00')}
        {campo('Endereço *', 'endereco', 'Insira o endereço completo da empresa')}
        {campo('Telefone *', 'telefone', '(00) 0000-0000')}
        {campo('E-mail *', 'email', 'exemplo@fornecedor.com', 'email')}
        {campo('Contato Principal *', 'contatoPrincipal', 'Nome do contato principal')}
        <div style={styles.botoes}>
          <button type="submit" style={styles.btnPrimario}>
            {editandoId ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          {editandoId && <button type="button" onClick={cancelar} style={styles.btnSecundario}>Cancelar</button>}
        </div>
      </form>

      <h3 style={{ marginTop: 32 }}>Fornecedores cadastrados</h3>
      {lista.length === 0 ? <p style={{ color: '#718096' }}>Nenhum fornecedor cadastrado.</p> : (
        <table style={styles.tabela}>
          <thead>
            <tr>{['Empresa', 'CNPJ', 'Telefone', 'E-mail', 'Contato', 'Ações'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {lista.map(f => (
              <tr key={f.id}>
                <td style={styles.td}>{f.nomeEmpresa}</td>
                <td style={styles.td}>{f.cnpj}</td>
                <td style={styles.td}>{f.telefone}</td>
                <td style={styles.td}>{f.email}</td>
                <td style={styles.td}>{f.contatoPrincipal}</td>
                <td style={styles.td}>
                  <button onClick={() => editar(f)} style={styles.btnEditar}>Editar</button>
                  <button onClick={() => remover(f.id)} style={styles.btnRemover}>Remover</button>
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
  container: { maxWidth: 900, margin: '0 auto', padding: 24 },
  titulo: { fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#2d3748' },
  form: { background: '#f7fafc', padding: 24, borderRadius: 8, marginBottom: 24 },
  campo: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 4, fontWeight: 600, color: '#4a5568', fontSize: 14 },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  erro: { color: '#e53e3e', fontSize: 12, marginTop: 4, display: 'block' },
  alerta: { padding: '12px 16px', borderRadius: 6, marginBottom: 16, fontWeight: 600 },
  botoes: { display: 'flex', gap: 12, marginTop: 8 },
  btnPrimario: { background: '#3182ce', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 },
  btnSecundario: { background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: 6, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 },
  tabela: { width: '100%', borderCollapse: 'collapse' },
  th: { background: '#edf2f7', padding: '10px 12px', textAlign: 'left', fontSize: 13, fontWeight: 700 },
  td: { padding: '10px 12px', borderBottom: '1px solid #e2e8f0', fontSize: 14 },
  btnEditar: { background: '#ecc94b', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 6, cursor: 'pointer', fontWeight: 600 },
  btnRemover: { background: '#fc8181', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 },
};
