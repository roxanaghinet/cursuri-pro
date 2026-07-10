// js/index.js (versiune corectă: un buton "Vezi detalii", un buton "Adaugă în coș")
(async function(){
  const grid = document.getElementById('courses-grid');
  const countEl = document.getElementById('found-count');
  const cartCountEl = document.getElementById('cart-count');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(e){ return []; } }
  function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
  function updateCartCount(){ const c = getCart(); const n = c.reduce((s,i)=>s + (i.qty||1),0); if(cartCountEl) cartCountEl.textContent = n; }

  function createCard(p){
    const el = document.createElement('article');
    el.className = 'card';

    // vizual: emoji/icon sau imagine
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
            <button class="btn add" data-id="${p.id}">Adaugă în coș</button>
          </div>
        </div>
      </div>
    `;

    // buton Vezi detalii -> navighează la pagina de detalii
    const detailsBtn = el.querySelector('.details');
    detailsBtn.addEventListener('click', ()=> {
      location.href = `details.html?id=${p.id}`;
    });

    // buton Adaugă în coș -> salvează în localStorage și actualizează contorul
    const addBtn = el.querySelector('.add');
    addBtn.addEventListener('click', ()=>{
      const cart = getCart();
      const existing = cart.find(x=>x.id==p.id);
      if(existing) existing.qty = (existing.qty||1) + 1;
      else cart.push({id:p.id,title:p.title,price:p.price,icon:p.icon,image:p.image,qty:1});
      setCart(cart);
      updateCartCount();
      showTempMessage(`${p.title} a fost adăugat în coș.`);
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

  function showTempMessage(text){
    const container = document.querySelector('.container');
    if(!container) return;
    const msg = document.createElement('div');
    msg.className = 'alert';
    msg.textContent = text;
    container.prepend(msg);
    setTimeout(()=> msg.remove(), 2200);
  }

  searchBtn.onclick = ()=> loadProducts(searchInput.value.trim());
  searchInput.addEventListener('keydown', e=> { if(e.key==='Enter') loadProducts(searchInput.value.trim()); });

  updateCartCount();
  await loadProducts();
  window.addEventListener('storage', updateCartCount);
})();
