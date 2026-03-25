/* =====================================================
   js/core.js — Armazenamento, Utilitários e Dados
   ===================================================== */

const STORAGE_KEY = 'tesourariaUFADS_v2';

/* ---- ESTRUTURA DE DADOS ---- */
let appData = {
  congregations: ["Café Sem Troco", "Monte Sião", "Betel", "Ebenézer"],
  movements: [],
  uniformFest: [],
  uniformPandeiro: [],
  sales: []
};

/* ---- PERSISTÊNCIA ---- */
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      appData = JSON.parse(saved);
    } else {
      seedSampleData();
      saveData();
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    seedSampleData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

function seedSampleData() {
  const now = Date.now();
  appData.movements = [
    { id: now - 5000, type: 'entrada', date: '2026-03-01', description: 'Oferta de março',    category: 'oferta',              value: 200,  form: 'PIX',     pixPart: 200, moneyPart: 0,  obs: '',           justification: '' },
    { id: now - 4000, type: 'saida',   date: '2026-03-05', description: 'Compra de tecido',   category: 'compra de tecido',    value: 150,  form: 'Dinheiro', pixPart: 0,  moneyPart: 150, obs: '',          justification: 'Material para costura dos uniformes da festividade.' },
    { id: now - 3000, type: 'entrada', date: '2026-03-10', description: 'Contribuição extra',  category: 'contribuição',        value: 80,   form: 'Dinheiro', pixPart: 0,  moneyPart: 80, obs: 'Dona Maria', justification: '' },
    { id: now - 2200, type: 'entrada', date: '2026-03-14', description: 'Arrecadação da festa',category: 'contribuição',        value: 130,  form: 'Misto',   pixPart: 80, moneyPart: 50, obs: 'PIX R$80 + Dinheiro R$50', justification: '' }
  ];
  appData.uniformFest = [
    { id: now - 2500, congregation: 'Café Sem Troco', woman: 'Ana Paula',  phone: '(61) 99999-9999', totalValue: 100, pixPaid: 50, moneyPaid: 50, date: '2026-03-10', obs: '' },
    { id: now - 2000, congregation: 'Monte Sião',     woman: 'Maria José', phone: '',                totalValue: 100, pixPaid: 30, moneyPaid: 20, date: '2026-03-12', obs: 'Parcial' },
    { id: now - 1500, congregation: 'Betel',          woman: 'Ruth Silva', phone: '(61) 98888-7777', totalValue: 100, pixPaid: 0,  moneyPaid: 0,  date: '',           obs: '' }
  ];
  appData.uniformPandeiro = [
    { id: now - 1000, congregation: 'Café Sem Troco', woman: 'Ana Paula',   phone: '(61) 99999-9999', totalValue: 80, pixPaid: 40, moneyPaid: 40, date: '2026-03-15', obs: '' },
    { id: now - 500,  congregation: 'Ebenézer',       woman: 'Débora Lima', phone: '',                 totalValue: 80, pixPaid: 0,  moneyPaid: 0,  date: '',           obs: '' }
  ];
  appData.sales = [
    { id: now - 300, date: '2026-03-15', product: 'Pamonha', qty: 20, unitValue: 8,  total: 160, form: 'Dinheiro' },
    { id: now - 200, date: '2026-03-18', product: 'Pão',     qty: 30, unitValue: 5,  total: 150, form: 'PIX' }
  ];
}

/* ---- CÁLCULO DOS TOTAIS ---- */
function calculateTotals() {
  let totalEntradas = 0, totalSaidas = 0;
  let totalPIX = 0, totalDinheiro = 0;
  let totalUniformFest = 0, totalUniformPandeiro = 0, totalVendas = 0;

  appData.movements.forEach(m => {
    const v = +m.value;
    if (m.type === 'entrada') {
      totalEntradas += v;
      if (m.form === 'PIX') {
        totalPIX += v;
      } else if (m.form === 'Dinheiro') {
        totalDinheiro += v;
      } else if (m.form === 'Misto') {
        totalPIX      += (+m.pixPart   || 0);
        totalDinheiro += (+m.moneyPart || 0);
      }
    } else {
      totalSaidas += v;
    }
  });

  appData.uniformFest.forEach(u => {
    const pago = (+u.pixPaid || 0) + (+u.moneyPaid || 0);
    totalEntradas += pago; totalUniformFest += pago;
    totalPIX += (+u.pixPaid || 0); totalDinheiro += (+u.moneyPaid || 0);
  });

  appData.uniformPandeiro.forEach(u => {
    const pago = (+u.pixPaid || 0) + (+u.moneyPaid || 0);
    totalEntradas += pago; totalUniformPandeiro += pago;
    totalPIX += (+u.pixPaid || 0); totalDinheiro += (+u.moneyPaid || 0);
  });

  appData.sales.forEach(s => {
    const v = +s.total;
    totalEntradas += v; totalVendas += v;
    if (s.form === 'PIX') totalPIX += v;
    else totalDinheiro += v;
  });

  const saldo = totalEntradas - totalSaidas;
  const pendentes = countPendentes();

  return {
    saldo, totalEntradas, totalSaidas,
    totalPIX, totalDinheiro,
    totalUniformFest, totalUniformPandeiro, totalVendas,
    ...pendentes
  };
}

function countPendentes() {
  let naopagas = 0, parciais = 0, total = 0;
  [...appData.uniformFest, ...appData.uniformPandeiro].forEach(u => {
    total++;
    const pago = (+u.pixPaid || 0) + (+u.moneyPaid || 0);
    if (pago === 0) naopagas++;
    else if (pago < +u.totalValue) parciais++;
  });
  return { mulheresCadastradas: total, naopagas, parciais };
}

function paymentStatus(u) {
  const pago = (+u.pixPaid || 0) + (+u.moneyPaid || 0);
  if (pago === 0) return { label: 'Não pago',   cls: 'danger',  pago: 0 };
  if (pago < +u.totalValue) return { label: 'Parcial', cls: 'warning', pago };
  return { label: 'Pago integral', cls: 'success', pago };
}

/* ---- UTILITÁRIOS ---- */
function fmt(v) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(+v || 0);
}

function fmtDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function genId() { return Date.now() + Math.floor(Math.random() * 1000); }

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '', error: '', warning: '!' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || '•'}</span> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ---- MODAL ---- */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}

/* ---- AUTH ---- */
function getAuthRole() {
  return sessionStorage.getItem('ufads_auth'); // '1' = admin, 'irma' = irma, null = none
}
function isLoggedIn() {
  return getAuthRole() === '1';
}
// Paginas de admin exigem role '1' — se irma tentar acessar, manda pro portal dela
function requireAuth() {
  const role = getAuthRole();
  const inPages = window.location.pathname.includes('/pages/');
  const base = inPages ? '../index.html' : 'index.html';
  if (!role) { window.location.href = base; return; }
  if (role === 'irma') { window.location.href = (inPages ? '' : 'pages/') + 'portal-irma.html'; return; }
}
function logout() {
  sessionStorage.removeItem('ufads_auth');
  sessionStorage.removeItem('ufads_irma_nome');
  sessionStorage.removeItem('ufads_irma_cong');
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

/* ---- POPULATE CONGREGAÇÃO SELECT ---- */
function populateCongregationSelect(selectId, includeAll = false) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = includeAll ? '<option value="">Todas as congregações</option>' : '<option value="">Selecione...</option>';
  appData.congregations.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
}
