// api.js - simulare server local pe baza products.json
class Product {
  constructor(obj){ Object.assign(this, obj); }
}

const API = (function(){
  const url = 'products.json';
  let cache = null;

  async function loadFromJson(){
    // dacă există mock în localStorage folosește-l (după operații admin)
    const mock = localStorage.getItem('mock_products');
    if(mock){
      try { return JSON.parse(mock).map(p=>new Product(p)); } catch(e){}
    }
    const res = await fetch(url);
    const data = await res.json();
    return data.map(p=>new Product(p));
  }

  return {
    getProducts: async function(){
      if(!cache) cache = await loadFromJson();
      return cache.slice();
    },
    getProduct: async function(id){
      if(!cache) cache = await loadFromJson();
      return cache.find(p=>p.id==id);
    },
    createProduct: async function(data){
      if(!cache) cache = await loadFromJson();
      const id = cache.length ? Math.max(...cache.map(p=>p.id))+1 : 0;
      const prod = new Product(Object.assign({id}, data));
      cache.push(prod);
      localStorage.setItem('mock_products', JSON.stringify(cache));
      return prod;
    },
    updateProduct: async function(id, data){
      if(!cache) cache = await loadFromJson();
      const idx = cache.findIndex(p=>p.id==id);
      if(idx<0) throw new Error('Not found');
      cache[idx] = new Product(Object.assign({}, cache[idx], data));
      localStorage.setItem('mock_products', JSON.stringify(cache));
      return cache[idx];
    },
    deleteProduct: async function(id){
      if(!cache) cache = await loadFromJson();
      cache = cache.filter(p=>p.id!=id);
      localStorage.setItem('mock_products', JSON.stringify(cache));
      return true;
    },
    resetMock: async function(){
      cache = await loadFromJson();
      localStorage.removeItem('mock_products');
      return cache;
    }
  };
})();
