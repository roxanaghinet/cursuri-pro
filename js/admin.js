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
    <label>Icon (emoji sau text scurt)<br><input name="icon" value="${p.icon||''}" placeholder="🎓 sau Formare" style="width:100%;padding:8px;margin-top:6px"></label><br><br>
    <div style="display:flex;gap:8px">
      <button class="btn" type="submit">Salvează</button>
      <button class="btn ghost" type="button" id="cancel">Anulează</button>
    </div>
  </form>`;
}
