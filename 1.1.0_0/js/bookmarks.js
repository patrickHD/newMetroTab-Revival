var MT = MT || {};
MT.status = MT.status || {};

(function() {
  Object.defineProperty(MT.status, 'marcadores', {
    get: function() {
      return !document.getElementById('bookmarks').classList.contains('aplastado');
    }
  });
  
  var 
    titlbar = document.getElementById('bkmrh1'),
    bkmr = document.getElementById('bookmarks'),
    direccion = getComputedStyle(document.body).direction == 'ltr' ? 'left' : 'right',
    nombres = [],
    datos = {};
  
  document.getElementById('bkmrcarp').addEventListener('click', function(evt) {
    var target = evt.target;
    evt.preventDefault();
    while(!matcheSelector(target,'.bkmrcarp')) {
      target = target.parentNode;
      if( !this.contains(target) ) return;
    }
    evt.stopPropagation();
    
    chrome.bookmarks.getSubTree(target.dataset.id, parseArbol);
  }, false);
  
  function parseArbol(nodo) {
    parseHijos(nodo[0].children);
    nombres[0] = getI18nMsg('menu_bkmr');
    addTitulo(nodo[0]);
    uniCompresor();
  }
  
  function parseHijos(lista) {
    var i, itm,
      carps = document.getElementById('bkmrcarp'),
      links = document.getElementById('bkmrlink');
    
    carps.innerHTML = '';
    links.innerHTML = '';
    
    for(i=0; itm = lista[i]; i++) {
      nombres[itm.id] = itm.title;
      if(itm.children)
        carps.appendChild(genCarpeta(itm));
      else
        links.appendChild(genLink(itm));
    }
  }
  
  function genCarpeta(nodo) {
    var carpeta = document.createElement('div'),
      etiq = document.createElement('div');
    carpeta.className = 'bkmrcarp';
    carpeta.id = 'carp'+ nodo.id;
    carpeta.dataset.id = nodo.id;
    carpeta.dataset.padre = nodo.parentId;
    
    etiq.className = 'etiqueta';
    etiq.textContent = nodo.title;
    carpeta.appendChild(etiq);
    return carpeta;
  }
  
  function genLink(nodo) {
    var link = document.createElement('a'),
      icon = document.createElement('div'),
      etiq = document.createElement('div');
    if(localStorage.getItem("apar_opennewtab")=="true")
        link.target = "_blank";
    link.href = nodo.url;
    link.className = 'bkmrlink';
    link.id = 'link'+ nodo.id;
    link.dataset.id = nodo.id;
    link.dataset.padre = nodo.parentId;
    
    icon.className = 'icono';
    icon.style.backgroundImage = 'url(chrome://favicon/'+ nodo.url +')';
    link.appendChild(icon);
    
    etiq.className = 'etiqueta';
    etiq.textContent = nodo.title;
    link.appendChild(etiq);
    return link;
  }
  
  function addTitulo(elem) {
    if(titlbar.childElementCount && !(titlbar.lastElementChild.dataset.id == elem.id)) {
      var actual = document.createElement('span');
      actual.textContent = nombres[elem.id];
      actual.dataset.id = elem.id;
      titlbar.appendChild(actual);
    }
    checkSoloDos();
  }
  
  function checkSoloDos() {
    var i,
      todos = [].splice.call(titlbar.children, 0).reverse();
    for(i = 0; i < todos.length; i++)
      todos[i].classList[i < 2 ? 'remove' : 'add']('ocultar');
  }
  
  titlbar.addEventListener('click', function(evt) {
    var i,
      target = evt.target;
      evt.preventDefault();
    while(!matcheSelector(target,'span')) {
      target = target.parentNode;
      if( !this.contains(target) ) return;
    }
    evt.stopPropagation();
    
    for(i = target.nextElementSibling; i; i = target.nextElementSibling)
      titlbar.removeChild(i);
    //titlbar.removeChild(target);
    checkSoloDos();
    
    chrome.bookmarks.getSubTree(target.dataset.id, parseArbol);
  }, false);
  
  function uniCompresor() {
    if(!MT.status.marcadores) return;
    
    var bloque, tile, target, newpos, col, a, b,
      margen = 8,
      bloques = document.getElementById('bookmarks').children,
      altocont = Math.max(100, bloques[0].offsetHeight, bloques[1].offsetHeight);
    
    for (a = 0; bloque = bloques[a]; a++) {
      if (bloque.childElementCount == 0)
        continue;
      
      target = [0,0];
      col = 0;
      for(b = 0; tile = bloque.children[b]; b++) {
        newpos = [target[0] + tile.offsetWidth + margen, target[1] + tile.offsetHeight + margen];
        
        if (newpos[1] >= altocont) {// Si el target está más abajo de donde se puede
          col += tile.offsetWidth + margen;// pasar a la columna siguiente
          target = [col, 0];// ponerlo al principio
          b--;// y recalcular
          continue;
        }
        
        tile.style[direccion] = target[0]+'px';
        tile.style.top = target[1]+'px';
        target = [col, newpos[1]];
      }
      bloque.style.width = newpos[0] +'px';
    }
    bloques = tile = null;
  }
  
  function seleccionBkmr(evt) {
    var target = evt.target;
    evt.preventDefault();
    while(!matcheSelector(target,'a.bkmrlink, div.bkmrcarp')) {
      target = target.parentNode;
      if( !this.contains(target) ) return;
    }
    evt.stopPropagation();
    
    target.classList.toggle('seleccionado');
    var selecao,// noblesse oblige, bitches
      menucont = document.getElementById('contextual'),
      carpeta = target.classList.contains('bkmrcarp');
    
    [].forEach.call(document.querySelectorAll( (carpeta ? '.bkmrlink' : '.bkmrcarp') + '.seleccionado'), function(itm) {
      itm.classList.remove('seleccionado');
    });
    
    selecao = document.querySelectorAll('#bookmarks .seleccionado');
    
    function genOpcion(id, i18nlabel, subclase) {
      var i,
        btn = document.createElement('span');
      btn.id = id;
      btn.className = 'ctxnormal';
      if(subclase) {
        subclase = subclase.split('.');
        for(i=0; i<subclase.length; i++)
          btn.classList.add(subclase[i]);
      }
      btn.textContent = getI18nMsg(i18nlabel);
      menucont.appendChild(btn);
      return btn;
    }
    
    if (selecao.length === 0) {
      document.dispatchEvent(new CustomEvent('desactContextual'));
    } else {
      requestAnimFrame(function() {
        menucont.innerHTML = '';
        genOpcion('ctxbkmr-deselec', 'action_deselect', 'ico-deselec.principio');
        
        if (selecao.length === 1) {
          genOpcion('ctxbkmr-renombrar', 'action_rename', 'ico-etiqueta');
          if (carpeta) {
            genOpcion('ctxbkmr-opennewwin', 'action_opennewwin', 'ico-newtab.principio');
          } else {
            genOpcion('ctxbkmr-copylink', 'action_copylink', 'ico-copiar.principio');
          }
        }
        
        if (!carpeta && selecao.length >= 1)
          genOpcion('ctxbkmr-opennewwin', 'action_opennewwin', 'ico-newtab.principio');
        
        if (!carpeta)
          genOpcion('ctxbkmr-eliminar', 'action_delete', 'ico-eliminar');
        
        menucont = null;
      });
    }
  }
  
  var btnback = new DOMgen('div', null, 'regreso')
    .appTo(document.body)
    .attr('style', 'display:none')
    .on('click', function() {
      var pivotbkmr = document.getElementById('bookmarks');
      titlbar.previousElementSibling.style.display = 'block';
      titlbar.style.display = 'none';
      titlbar.innerHTML = '';
      this.style.display = 'none';
      
      function subir() {
        document.getElementById('bkmrcarp').innerHTML = '';
        document.getElementById('bkmrlink').innerHTML = '';
        this.removeEventListener(transitionEnd, subir, false);
      }
      pivotbkmr.addEventListener(transitionEnd, subir, false);
      pivotbkmr.classList.add('aplastado');
      document.getElementById('pivot').classList.remove('aplastado');
      
      pivotbkmr = null;
  }).item;
  
  document.addEventListener('marcadores', function() {
    chrome.bookmarks.getSubTree('0', function(arbol) {
      document.getElementById('bookmarks').classList.remove('aplastado');
      document.getElementById('pivot').classList.add('aplastado');
      btnback.style.display = 'block';
      
      titlbar.previousElementSibling.style.display = 'none';
      titlbar.style.display = 'block';
      titlbar.innerHTML = '<span data-actual="0" style="display: none">'+ (getI18nMsg('menu_bkmr') || 'Marcadores') +'</span>';
      
      //new DOMgen('span').i18n('h1marcadores').appTo(titlbar).attr('data-actual', '0');
      parseArbol(arbol);
      document.dispatchEvent(new CustomEvent('desactAvatar'));
    });
  }, false);
  
  bkmr.addEventListener('contextmenu', seleccionBkmr, false);
  bkmr.addEventListener('click', function(evt) {
    if (MT.status.contextual || MT.status.lateral || MT.status.avatarmenu) {
      evt.preventDefault();
      evt.stopPropagation();
      document.dispatchEvent(new CustomEvent('desactContextual'));
      document.dispatchEvent(new CustomEvent('desactLateral'));
      document.dispatchEvent(new CustomEvent('desactAvatar'));
      return;
    }
  }, true);
  window.addEventListener('resize', uniCompresor, false);
})();