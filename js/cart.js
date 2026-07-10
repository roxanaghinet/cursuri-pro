// js/cart.js (afișare icon în coș)
function getCart(){ try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(e){ return []; } }
function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
function updateHeaderCount(){ const el = document.querySelector('#cart-count'); if(!el) return; const c = getCart(); el.textContent = c.reduce((s,i)=>s+(i.qty||1),0); }

function render(){
  const root = document.getElementById('cart-content');
  const cart = getCart();
  updateHeaderCount();
  if(!cart.length){
    root.innerHTML = `
      <div class="empty-cart">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 4h10l1.5 6H6.5L7 4z" /></svg>
        <h3>Coșul tău este gol</h3>
        <p>Descoperă cursurile noastre și începe să înveți astăzi.</p>
        <a href="index.html" class="btn">Răsfoiește cursurile</a>
      </div>
    `;
    return;
  }

  let total = 0;
  let html = `<table class="table"><thead><tr><th>Produs</th><th>Preț</th><th>Cantitate</th><th>Subtotal</th><th>Acțiuni</th></tr></thead><tbody>`;
  cart.forEach(item=>{
    const sub = item.price * item.qty;
    total += sub;
    const iconHtml = item.icon ? `<span style="font-size:20px;margin-right:8px">${item.icon}</span>` : `<img src="${item.image}" style="width:40px;height:28px;object-fit:cover;margin-right:8px">`;
    html += `<tr data-id="${item.id}">
      <td>${iconHtml}<a href="details.html?id=${item.id}">${item.title}</a></td>
      <td>${item.price} RON</td>
      <td>${item.qty}</td>
      <td>${sub} RON</td>
      <td class="actions-cell">
        <button class="btn dec">-</button>
        <button class="btn inc">+</button>
        <button class="btn ghost rem">Remove</button>
      </td>
    </tr>`;
  });
  html += `</tbody></table><div style="margin-top:12px;display:flex;justify-content:flex-end;gap:12px;align-items:center">
    <div style="font-weight:800">Total: ${total} RON</div>
    <button class="btn">Finalizează comanda</button>
  </div>`;
  root.innerHTML = html;

  root.querySelectorAll('.inc').forEach(b=> b.onclick = e=> changeQty(e,1));
  root.querySelectorAll('.dec').forEach(b=> b.onclick = e=> changeQty(e,-1));
  root.querySelectorAll('.rem').forEach(b=> b.onclick = e=> removeItem(e));
}

function changeQty(ev,delta){
  const id = Number(ev.target.closest('tr').dataset.id);
  const cart = getCart();
  const it = cart.find(x=>x.id==id);
  if(!it) return;
  it.qty = Math.max(1, it.qty + delta);
  setCart(cart);
  render();
}

function removeItem(ev){
  const id = Number(ev.target.closest('tr').dataset.id);
  let cart = getCart();
  cart = cart.filter(x=>x.id!=id);
  setCart(cart);
  render();
}

render();
