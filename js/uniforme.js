/* =====================================================
   js/uniforme.js — Lógica compartilhada para
   Uniforme Festividade e Uniforme Pandeiro
   ===================================================== */

// Chamado por ambas as páginas. Cada uma define UNIFORME_TYPE antes de incluir este script.
// UNIFORME_TYPE = 'fest' | 'pandeiro'

function getUniformeList() {
  return UNIFORME_TYPE === 'fest' ? appData.uniformFest : appData.uniformPandeiro;
}

function setUniformeList(list) {
  if (UNIFORME_TYPE === 'fest') appData.uniformFest = list;
  else appData.uniformPandeiro = list;
}

function getDefaultValue() {
  return UNIFORME_TYPE === 'fest' ? 100 : 80;
}

function renderStats() {
  const lista = getUniformeList();
  let totalPago = 0, totalPendente = 0, naopagas = 0, parciais = 0, integrais = 0;

  lista.forEach(u => {
    const pago = (+u.pixPaid || 0) + (+u.moneyPaid || 0);
    const pend = (+u.totalValue || 0) - pago;
    totalPago     += pago;
    totalPendente += pend;
    const s = paymentStatus(u);
    if (s.label === 'Não pago')      naopagas++;
    else if (s.label === 'Parcial')  parciais++;
    else                             integrais++;
  });

  document.getElementById('unif-stats').innerHTML = [
    { label: 'Total Arrecadado', value: fmt(totalPago),     cls: 'success', icon: '' },
    { label: 'Pendente Total',   value: fmt(totalPendente),  cls: 'danger',  icon: '' },
    { label: 'Cadastradas',      value: lista.length,        cls: 'primary', icon: '' },
    { label: 'Não pago',         value: naopagas,            cls: 'danger',  icon: '' },
    { label: 'Pagamento Parcial',value: parciais,            cls: 'warning', icon: '' },
    { label: 'Pago Integral',    value: integrais,           cls: 'success', icon: '' },
  ].map(s => `
    <div class="stat-card ${s.cls}"> <div class="stat-icon ${s.cls}">${s.icon}</div> <div class="stat-value">${s.value}</div> <div class="stat-label">${s.label}</div> </div>
  `).join('');
}

function renderUniforme() {
  const filtroCong = document.getElementById('filtro-congregacao') ? document.getElementById('filtro-congregacao').value : '';
  const filtroStatus = document.getElementById('filtro-status') ? document.getElementById('filtro-status').value : '';
  const busca = document.getElementById('filtro-busca') ? document.getElementById('filtro-busca').value.toLowerCase() : '';

  let lista = [...getUniformeList()];
  if (filtroCong)   lista = lista.filter(u => u.congregation === filtroCong);
  if (filtroStatus) lista = lista.filter(u => {
    const s = paymentStatus(u);
    if (filtroStatus === 'integral') return s.label === 'Pago integral';
    if (filtroStatus === 'parcial')  return s.label === 'Parcial';
    if (filtroStatus === 'nao')      return s.label === 'Não pago';
    return true;
  });
  if (busca) lista = lista.filter(u => u.woman.toLowerCase().includes(busca) || u.congregation.toLowerCase().includes(busca));

  lista.sort((a, b) => a.congregation.localeCompare(b.congregation));

  const tbody = document.querySelector('#tabela-uniforme tbody');
  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><p>Nenhum registro encontrado.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = lista.map(u => {
    const pago     = (+u.pixPaid || 0) + (+u.moneyPaid || 0);
    const pendente = (+u.totalValue || 0) - pago;
    const st = paymentStatus(u);
    return `
      <tr> <td><span class="badge badge-neutral">${u.congregation}</span></td> <td> <div style="font-weight:500;">${u.woman}</div>
          ${u.phone ? `<div class="text-muted text-sm">${u.phone}</div>` : ''}
        </td> <td>${fmt(u.totalValue)}</td> <td style="color:var(--primary)">${fmt(u.pixPaid)}</td> <td style="color:var(--warning)">${fmt(u.moneyPaid)}</td> <td style="font-weight:600; color:var(--success)">${fmt(pago)}</td> <td style="color:${pendente > 0 ? 'var(--danger)' : 'var(--success)'}">${fmt(pendente)}</td> <td><span class="badge badge-${st.cls}">${st.label}</span></td> <td> <div class="table-actions"> <button class="btn btn-sm btn-outline" onclick="editarUniforme(${u.id})" title="Editar"></button> <button class="btn btn-sm btn-danger"  onclick="excluirUniforme(${u.id})" title="Excluir"></button> </div> </td> </tr>
    `;
  }).join('');
}

function abrirModalNovo() {
  document.getElementById('edit-id-unif').value = '';
  document.getElementById('modal-unif-title').textContent = 'Nova Irmã — ' + (UNIFORME_TYPE === 'fest' ? 'Uniforme Festividade' : 'Uniforme Pandeiro');
  document.getElementById('nome-irma').value = '';
  document.getElementById('telefone-irma').value = '';
  document.getElementById('valor-total-unif').value = getDefaultValue();
  document.getElementById('pix-pago').value = 0;
  document.getElementById('dinheiro-pago').value = 0;
  document.getElementById('data-unif').value = new Date().toISOString().split('T')[0];
  document.getElementById('obs-unif').value = '';
  populateCongregationSelect('congregacao-unif');
  recalcularPagamento();
  openModal('modal-uniforme');
}

function editarUniforme(id) {
  const u = getUniformeList().find(u => u.id === id);
  if (!u) return;
  document.getElementById('edit-id-unif').value         = u.id;
  document.getElementById('modal-unif-title').textContent = 'Editar — ' + u.woman;
  document.getElementById('valor-total-unif').value     = u.totalValue;
  document.getElementById('pix-pago').value             = u.pixPaid;
  document.getElementById('dinheiro-pago').value        = u.moneyPaid;
  document.getElementById('data-unif').value            = u.date || '';
  document.getElementById('obs-unif').value             = u.obs || '';
  document.getElementById('nome-irma').value            = u.woman;
  document.getElementById('telefone-irma').value        = u.phone || '';
  populateCongregationSelect('congregacao-unif');
  document.getElementById('congregacao-unif').value     = u.congregation;
  recalcularPagamento();
  openModal('modal-uniforme');
}

function salvarUniforme() {
  const id     = document.getElementById('edit-id-unif').value;
  const cong   = document.getElementById('congregacao-unif').value;
  const woman  = document.getElementById('nome-irma').value.trim();
  const phone  = document.getElementById('telefone-irma').value.trim();
  const total  = parseFloat(document.getElementById('valor-total-unif').value);
  const pix    = parseFloat(document.getElementById('pix-pago').value) || 0;
  const money  = parseFloat(document.getElementById('dinheiro-pago').value) || 0;
  const date   = document.getElementById('data-unif').value;
  const obs    = document.getElementById('obs-unif').value.trim();

  if (!cong || !woman) { showToast('Nome e congregação são obrigatórios!', 'error'); return; }
  if (isNaN(total) || total <= 0) { showToast('Valor total inválido!', 'error'); return; }
  if (pix + money > total) { showToast('Valor pago não pode exceder o total!', 'error'); return; }

  const item = { id: id ? +id : genId(), congregation: cong, woman, phone, totalValue: total, pixPaid: pix, moneyPaid: money, date, obs };

  const lista = getUniformeList();
  if (id) {
    const idx = lista.findIndex(u => u.id === +id);
    if (idx > -1) lista[idx] = item;
  } else {
    lista.push(item);
  }
  setUniformeList(lista);
  saveData();
  closeModal('modal-uniforme');
  renderUniforme();
  renderStats();
  showToast(id ? 'Registro atualizado!' : 'Irmã cadastrada com sucesso!');
}

function excluirUniforme(id) {
  if (!confirm('Excluir este registro?')) return;
  setUniformeList(getUniformeList().filter(u => u.id !== id));
  saveData();
  renderUniforme();
  renderStats();
  showToast('Registro removido.', 'warning');
}

function recalcularPagamento() {
  const total = parseFloat(document.getElementById('valor-total-unif').value) || 0;
  const pix   = parseFloat(document.getElementById('pix-pago').value)  || 0;
  const money = parseFloat(document.getElementById('dinheiro-pago').value) || 0;
  const pago  = pix + money;
  const pend  = total - pago;

  const el = document.getElementById('calc-resumo');
  if (el) {
    el.innerHTML = `
      <div style="display:flex; gap:20px; flex-wrap:wrap; font-size:.82rem; color:var(--neutral-600);"> <span>Total: <strong>${fmt(total)}</strong></span> <span>Pago: <strong style="color:var(--success)">${fmt(pago)}</strong></span> <span>Pendente: <strong style="color:${pend > 0 ? 'var(--danger)' : 'var(--success)'}">${fmt(pend)}</strong></span> </div>
    `;
  }
}
