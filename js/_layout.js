/* =====================================================
   _layout.js — Sidebar + Topbar (sem emoji, ícones SVG)
   ===================================================== */

(function () {

  /* ---- SVG ICONS ---- */
  const ICONS = {
    dashboard:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    caixa:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    vendas:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    congregacoes:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    uniforme:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
    pandeiro:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/><line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/></svg>`,
    relatorios: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    config:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    logout:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    arrow:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  };

  const links = [
    { id: 'dashboard',         icon: ICONS.dashboard,   label: 'Dashboard',           href: 'dashboard.html',         group: 'principal' },
    { id: 'caixa',             icon: ICONS.caixa,       label: 'Controle de Caixa',   href: 'caixa.html',             group: 'principal' },
    { id: 'vendas',            icon: ICONS.vendas,      label: 'Vendas',               href: 'vendas.html',            group: 'principal' },
    { id: 'congregacoes',      icon: ICONS.congregacoes,label: 'Congregações',         href: 'congregacoes.html',      group: 'uniformes' },
    { id: 'uniforme-fest',     icon: ICONS.uniforme,    label: 'Uniforme Festividade', href: 'uniforme-fest.html',     group: 'uniformes' },
    { id: 'uniforme-pandeiro', icon: ICONS.pandeiro,    label: 'Uniforme Pandeiro',    href: 'uniforme-pandeiro.html', group: 'uniformes' },
    { id: 'relatorios',        icon: ICONS.relatorios,  label: 'Relatorios',           href: 'relatorios.html',        group: 'extra' },
    { id: 'configuracoes',     icon: ICONS.config,      label: 'Configuracoes',        href: 'configuracoes.html',     group: 'extra' },
  ];

  const groups = { principal: 'Principal', uniformes: 'Uniformes', extra: 'Ferramentas' };
  const cur = typeof CURRENT_PAGE !== 'undefined' ? CURRENT_PAGE : '';

  function navGroup(groupId) {
    return `
      <div class="sidebar-section"> <div class="sidebar-section-label">${groups[groupId]}</div> <nav>
          ${links.filter(l => l.group === groupId).map(l => `
            <button onclick="window.location.href='${l.href}'"
                    class="nav-item ${cur === l.id ? 'active' : ''}"> <span class="nav-icon">${l.icon}</span> <span>${l.label}</span> </button>
          `).join('')}
        </nav> </div>`;
  }

  /* ---- SIDEBAR HTML ---- */
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-brand"> <div class="sidebar-brand-mark">T</div> <div> <div class="brand-name">Tesouraria UFADS</div> <div class="brand-sub">Departamento de Mulheres</div> </div> </div>

    ${navGroup('principal')}
    ${navGroup('uniformes')}
    ${navGroup('extra')}

    <div style="flex:1;min-height:16px;"></div> <div class="sidebar-user-card"> <div class="sidebar-avatar">R</div> <div class="sidebar-user-info"> <div class="sidebar-user-name">Rayssa</div> <div class="sidebar-user-role">Administradora</div> </div> </div> <div class="sidebar-logout-wrap"> <button class="sidebar-logout-btn" onclick="confirmarSaida()"> <span class="sidebar-logout-icon">${ICONS.logout}</span> <span>Sair do Sistema</span> <span class="sidebar-logout-arrow">${ICONS.arrow}</span> </button> </div>
  `;

  /* ---- CSS INJETADO ---- */
  const style = document.createElement('style');
  style.textContent = `
    /* Brand */
    .sidebar-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 20px 16px 16px;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .sidebar-brand-mark {
      width: 34px; height: 34px; flex-shrink: 0;
      background: var(--primary);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'DM Serif Display', serif;
      font-size: 1rem; color: #fff; font-weight: 700;
    }
    .brand-name { font-family:'DM Serif Display',serif; font-size:.9rem; color:#fff; line-height:1.2; }
    .brand-sub  { font-size:.62rem; color:var(--primary-light); letter-spacing:.07em; text-transform:uppercase; }

    /* Nav icons SVG */
    .nav-icon { display:flex; align-items:center; justify-content:center; width:18px; flex-shrink:0; }
    .nav-icon svg { width:16px; height:16px; }

    /* User card */
    .sidebar-user-card {
      display: flex; align-items: center; gap: 10px;
      margin: 0 10px 6px;
      padding: 10px 12px;
      background: rgba(255,255,255,.05);
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,.07);
    }
    .sidebar-avatar {
      width: 32px; height: 32px; flex-shrink: 0;
      border-radius: 50%;
      background: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: .82rem; font-weight: 700; color: #fff;
    }
    .sidebar-user-name { font-size:.82rem; font-weight:600; color:#fff; }
    .sidebar-user-role { font-size:.7rem; color:#71717a; }

    /* Botao Sair */
    .sidebar-logout-wrap { padding: 4px 10px 16px; }
    .sidebar-logout-btn {
      width: 100%;
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px;
      background: rgba(220,38,38,.1);
      border: 1.5px solid rgba(220,38,38,.28);
      border-radius: 10px;
      color: #fca5a5;
      font-family: 'DM Sans', sans-serif;
      font-size: .85rem; font-weight: 600;
      cursor: pointer;
      transition: all .18s;
      text-align: left;
    }
    .sidebar-logout-btn:hover {
      background: rgba(220,38,38,.22);
      border-color: rgba(220,38,38,.55);
      color: #fff;
    }
    .sidebar-logout-btn:hover .sidebar-logout-arrow { transform: translateX(4px); }
    .sidebar-logout-icon { display:flex; align-items:center; }
    .sidebar-logout-icon svg { width:15px; height:15px; }
    .sidebar-logout-arrow {
      margin-left: auto; opacity:.55; display:flex; align-items:center;
      transition: transform .18s;
    }
    .sidebar-logout-arrow svg { width:13px; height:13px; }

    /* Modal sair */
    #modal-sair {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      z-index: 999;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity .2s;
    }
    #modal-sair.open { opacity:1; pointer-events:all; }
    .modal-sair-box {
      background: #fff;
      border-radius: 16px;
      padding: 32px 28px;
      max-width: 360px; width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,.2);
      transform: translateY(14px);
      transition: transform .22s;
    }
    #modal-sair.open .modal-sair-box { transform: translateY(0); }
    .modal-sair-mark {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: #fee2e2;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
    }
    .modal-sair-mark svg { width:22px; height:22px; stroke:#dc2626; }
    .modal-sair-box h3 { font-size:1.05rem; font-weight:700; color:#18181b; margin-bottom:8px; }
    .modal-sair-box p  { font-size:.875rem; color:#71717a; margin-bottom:24px; line-height:1.5; }
    .modal-sair-btns   { display:flex; gap:10px; }
    .modal-sair-btns .btn-cancelar {
      flex:1; padding:10px; border-radius:8px;
      border:1.5px solid #e4e4e7; background:#fff;
      font-family:'DM Sans',sans-serif; font-size:.875rem; font-weight:600;
      color:#52525b; cursor:pointer; transition:background .15s;
    }
    .modal-sair-btns .btn-cancelar:hover { background:#f4f4f5; }
    .modal-sair-btns .btn-confirmar-sair {
      flex:1; padding:10px; border-radius:8px;
      border:none; background:#dc2626;
      font-family:'DM Sans',sans-serif; font-size:.875rem; font-weight:600;
      color:#fff; cursor:pointer; transition:background .15s;
    }
    .modal-sair-btns .btn-confirmar-sair:hover { background:#b91c1c; }
  `;
  document.head.appendChild(style);

  /* ---- MODAL SAIR ---- */
  const modalSair = document.createElement('div');
  modalSair.id = 'modal-sair';
  modalSair.innerHTML = `
    <div class="modal-sair-box"> <div class="modal-sair-mark">
        ${ICONS.logout}
      </div> <h3>Sair do sistema?</h3> <p>Voce sera redirecionada para a tela de login. Todos os dados salvos serao mantidos.</p> <div class="modal-sair-btns"> <button class="btn-cancelar" onclick="fecharModalSair()">Cancelar</button> <button class="btn-confirmar-sair" onclick="executarSaida()">Sair</button> </div> </div>
  `;

  /* ---- OVERLAY MOBILE ---- */
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99;';
  overlay.onclick = () => toggleSidebar(false);

  /* ---- TOAST CONTAINER ---- */
  const toastC = document.createElement('div');
  toastC.id = 'toast-container';

  document.body.prepend(modalSair);
  document.body.prepend(overlay);
  document.body.prepend(sidebar);
  document.body.appendChild(toastC);

  /* ---- FUNÇÕES GLOBAIS ---- */
  window.toggleSidebar = function (force) {
    const s = document.getElementById('sidebar');
    const o = document.getElementById('sidebar-overlay');
    const open = force !== undefined ? force : !s.classList.contains('open');
    s.classList.toggle('open', open);
    o.style.display = open ? 'block' : 'none';
  };

  window.confirmarSaida = function () {
    document.getElementById('modal-sair').classList.add('open');
  };

  window.fecharModalSair = function () {
    document.getElementById('modal-sair').classList.remove('open');
  };

  window.executarSaida = function () {
    sessionStorage.removeItem('ufads_auth');
    sessionStorage.removeItem('ufads_irma_nome');
    sessionStorage.removeItem('ufads_irma_cong');
    const inPages = window.location.pathname.includes('/pages/');
    window.location.href = inPages ? '../index.html' : 'index.html';
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModalSair();
  });

})();
