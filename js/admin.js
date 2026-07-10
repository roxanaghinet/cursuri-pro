// admin.js
(async function(){
  const area = document.getElementById('admin-area');
  const addBtn = document.getElementById('add-new');
  const resetBtn = document.getElementById('reset');

  async function load(){
    const prods = await API.getProducts();
    renderTable(prods);
  }

  function renderTable(prods){
    let html = `<table class="table"><thead><tr><th>CURS</th><th>CATEGORIE</th><th>PREȚ</th><th>STOC</th><th>ACȚIUNE</th></tr></thead><tbody>`;
    prods.forEach(p=>{
      html += `<tr data-id="${p.id}">
        <td>${p.title} – <small>${p.level}</small></td>
        <td>${p.category}</td>
        <td>${p.price} RON</td>
        <td>${p.places}</td>
        <td>
          <button class="btn edit">Editează</button>
          <button class="btn ghost del">Șterge</button>
        </td>
      </tr>`;
    });
    html += `</tbody></table><div id="form-area" style="margin-top:12px"></div>`;
    area.innerHTML = html;
    area.querySelectorAll('.edit').forEach(b=> b.onclick = e=> showForm(Number(e.target.closest('tr').dataset.id)));
    area.querySelectorAll('.del').forEach(b=> b.onclick = e=> delItem(Number(e.target.closest('tr').dataset.id)));
  }

  function showForm(id){
    const formArea = document.getElementById('form-area');
    if(id==null || id===undefined){
      formArea.innerHTML = formHtml({});
      bindForm(null);
    } else {
      API.getProduct(id).then(p=>{
        formArea.innerHTML = formHtml(p);
        bindForm(id);
      });
    }
  }

  function formHtml(p){
    p = p || {};
    return `<form id="prod-form" style="background:#fff;padding:12px;border-radius:8px;border:1px solid #eee">
      <label>Nume<br><input name="title" value="${p.title||''}" required style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <label>Descriere<br><textarea name="desc" style="width:100%;padding:8px;margin-top:6px">${p.desc||''}</textarea></label><br><br>
      <label>Categorie<br><input name="category" value="${p.category||'Formare'}" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <label>Level<br><input name="level" value="${p.level||'Intermediar'}" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <label>Durata<br><input name="duration" value="${p.duration||'20h'}" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <label>Locuri<br><input name="places" type="number" value="${p.places||10}" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <label>Pret<br><input name="price" type="number" value="${p.price||100}" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <label>Imagine (cale)<br><input name="image" value="${p.image||'images/course1.svg'}" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
      <div style="display:flex;gap:8px">
        <button class="btn" type="submit">Salvează</button>
        <button class="btn ghost" type="button" id="cancel">Anulează</button>
      </div>
    </form>`;
  }

  function bindForm(id){
    const form = document.getElementById('prod-form');
    form.onsubmit = async (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      data.price = Number(data.price);
      data.places = Number(data.places);
      if(id==null) await API.createProduct(data);
      else await API.updateProduct(id, data);
      document.getElementById('form-area').innerHTML = '';
      await load();
    };
    document.getElementById('cancel').onclick = ()=> document.getElementById('form-area').innerHTML = '';
  }

  async function delItem(id){
    if(!confirm('Ștergi acest curs?')) return;
    await API.deleteProduct(id);
    await load();
  }

  addBtn.onclick = ()=> showForm();
  resetBtn.onclick = async ()=> { await API.resetMock(); await load(); };

  await load();
})();
