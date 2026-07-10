// js/index.js (actualizat pentru icon)
(async function(){
  const grid = document.getElementById('courses-grid');
  const countEl = document.getElementById('found-count');
  const cartCountEl = document.getElementById('cart-count');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(e){ return []; } }
  function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
  function updateCartCount(){ const c = getCart(); const n = c.reduce((s,i)=>s + (i.qty||1),0); cartCountEl.textContent = n; }

  function createCard(p){
    const el = document.createElement('article');
    el.className = 'card';
    // afișăm icon-ul mare în loc de imagine (dacă există icon), altfel folosim image
    const visual = p.icon ? `<div style="font-size:48px;line-height:1;margin-bottom:6px">${p.icon}</div>` :
                   `<img src="${p.image}" alt="${p.title}">`;
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div style="flex:1">
          <div class="tag">${p.level}</div>
          <div style="display:flex;gap:12px;align-items:center;margin-top:8px">
            <div class="visual">${visual}</div>
            <div style="flex:1">
              <h3 style="margin:0">${p.title}</h3>
              <p style="margin:6px 0;color:#555">${p.desc}</p>
              <div class="meta">
                <div>⏱️ ${p.duration}</div>
                <div>👥 ${p.places} locuri</div>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
          <div class="price">${p.price} RON</div>
          <div class="actions">
            <button class="btn ghost details" data-id="${p.id}">Vezi detalii</button>
            <button class="btn add" data-id="${p.id}">Vezi detalii →</button>
          </div>
        </div>
      </div>
    `;
    el.querySelectorAll('.details, .add').forEach(btn=>{
      btn.onclick = ()=> location.href = `details.html?id=${p.id}`;
    });
    return el;
  }

  async function loadProducts(filter=''){
    grid.innerHTML = '';
    try {
      const prods = await API.getProducts();
      const filtered = prods.filter(p=>{
        if(!filter) return true;
        const q = filter.toLowerCase();
        return (p.title + ' ' + p.desc + ' ' + p.category).toLowerCase().includes(q);
      });
      countEl.textContent = `${filtered.length} cursuri găsite`;
      filtered.forEach(p=> grid.appendChild(createCard(p)));
    } catch(e){
      grid.innerHTML = '<p>Eroare la încărcarea cursurilor.</p>';
    }
  }

  searchBtn.onclick = ()=> loadProducts(searchInput.value.trim());
  searchInput.addEventListener('keydown', e=> { if(e.key==='Enter') loadProducts(searchInput.value.trim()); });

  updateCartCount();
  await loadProducts();
  window.addEventListener('storage', updateCartCount);
})();
