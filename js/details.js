// js/details.js (afișare icon)
function qs(name){ return new URLSearchParams(location.search).get(name); }
function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(e){ return []; } }
function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function updateCartCount(){ const el = document.getElementById('cart-count'); if(!el) return; const c = getCart(); el.textContent = c.reduce((s,i)=>s+(i.qty||1),0); }

(async function(){
  updateCartCount();
  const id = Number(qs('id'));
  const content = document.getElementById('content');
  if(isNaN(id)){ content.innerHTML = '<p>Id invalid.</p>'; return; }
  const p = await API.getProduct(id);
  if(!p){ content.innerHTML = '<p>Produs inexistent.</p>'; return; }

  const visual = p.icon ? `<div style="font-size:96px">${p.icon}</div>` : `<img src="${p.image}" alt="${p.title}" style="width:100%;border-radius:10px">`;

  content.innerHTML = `
    <div style="display:flex;gap:20px;flex-wrap:wrap">
      <div style="flex:1;min-width:280px">${visual}</div>
      <div style="flex:1;min-width:280px">
        <div class="tag">${p.level}</div>
        <h2 style="margin-top:8px">${p.title}</h2>
        <p style="color:#555">${p.desc}</p>
        <div style="margin:12px 0" class="meta">
          <div>⏱️ ${p.duration}</div>
          <div>👥 ${p.places} locuri</div>
          <div class="price">${p.price} RON</div>
        </div>
        <div style="display:flex;gap:10px">
          <button id="add-cart" class="btn">Adaugă în coș</button>
          <a href="cart.html" class="btn ghost" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center">Vezi coș</a>
        </div>
        <div id="msg" style="margin-top:12px"></div>
      </div>
    </div>
  `;

  document.getElementById('add-cart').onclick = ()=>{
    const cart = getCart();
    const existing = cart.find(x=>x.id==p.id);
    if(existing) existing.qty = (existing.qty||1) + 1;
    else cart.push({id:p.id,title:p.title,price:p.price,icon:p.icon,image:p.image,qty:1});
    setCart(cart);
    updateCartCount();
    const msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert">Produs adăugat în coș</div>';
    setTimeout(()=> msg.innerHTML = '', 2200);
  };
})();
