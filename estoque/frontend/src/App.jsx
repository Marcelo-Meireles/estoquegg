import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Produtos from './pages/Produtos';
import Fornecedores from './pages/Fornecedores';
import Associacao from './pages/Associacao';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
        <nav style={styles.nav}>
          <span style={styles.logo}>Controle de Estoque</span>
          <div style={styles.links}>
            <NavLink to="/" end style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkAtivo : {}) })}>Produtos</NavLink>
            <NavLink to="/fornecedores" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkAtivo : {}) })}>Fornecedores</NavLink>
            <NavLink to="/associacao" style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkAtivo : {}) })}>Associação</NavLink>
          </div>
        </nav>
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Produtos />} />
            <Route path="/fornecedores" element={<Fornecedores />} />
            <Route path="/associacao" element={<Associacao />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  nav: { background: '#2b6cb0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 },
  logo: { color: '#fff', fontWeight: 700, fontSize: 18 },
  links: { display: 'flex', gap: 8 },
  link: { color: '#bee3f8', textDecoration: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 14 },
  linkAtivo: { background: '#1a4a8a', color: '#fff' },
  main: { padding: 24 },
};
