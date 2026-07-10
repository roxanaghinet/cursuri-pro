// index.js
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
    el.innerHTML = `
      <div class="tag">${p.level}</div>
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="meta">
        <div>⏱️ ${p.duration}</div>
        <div>👥 ${p.places} locuri</div>
        <div class="price">${p.price} RON</div>
      </div>
      <div class="actions">
        <button class="btn ghost details" data-id="${p.id}">Vezi detalii</button>
        <button class="btn add" data-id="${p.id}">Vezi detalii →</button>
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
