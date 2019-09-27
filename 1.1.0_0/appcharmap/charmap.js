document.addEventListener('DOMContentLoaded', function() {
  var cont = document.getElementById('pivot'),
    direccion = 'left',
    flyout = {
    sel: document.getElementById('flyoutsel'),
    list: null,
    status: false
  }
  
  function uniCompresor() {
    var bloque, tile, target, newpos, col, a, b,
      margen = 8,
      bloques = cont.children,
      altocont = bloques[0].offsetHeight;
    
    //console.warn('Base: ', base, ' | Altura: ', altocont, ' | Bloques: ', bloques.length);
    
    for (a = 0; bloque = bloques[a]; a++) {
      if (bloque.childElementCount == 0)
        continue;
      
      target = [0,0];
      col = 0;
      for(b = 0; tile = bloque.children[b]; b++) {
        newpos = [target[0] + tile.offsetWidth + margen, target[1] + tile.offsetHeight + margen];
        //console.log(tile.id, target, newpos, col);
        
        if (newpos[1] >= altocont) {// Si el target est� m�s abajo de donde se puede
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
  }
  
  function elegirBloque(datos) {
    cont.innerHTML = '';
    var bloq = new DOMgen('div').clase('bloque').appTo(cont).item;
    flyout.sel.firstElementChild.textContent = datos[2];
    requestAnimFrame(function() {
      console.log(datos);
      for(var i = datos[0]; i <= datos[1]; i++) {
        new DOMgen('span').clase('tile').txt(String.fromCharCode(i)).attr('title', i).appTo(bloq);
      }
      uniCompresor();
    });
  }
  
  var lista = new XMLHttpRequest();
  lista.open('GET', 'bloques.json', true);
  lista.send();
  lista.onload = function() {
    var info = JSON.parse(this.response);
    //,[983040,1048575,"Supplementary Private Use Area-A"],[1048576,1114111,"Supplementary Private Use Area-B"]
    flyout.list = new DOMgen('div', 'flyout').appTo(flyout.sel).item;
    info.sort(function (a, b) {
      return a[2].localeCompare(b[2]);
    }).forEach(function(opt) {
      new DOMgen('div').attr('data-value', opt[0] +';'+ opt[1]).txt(opt[2]).appTo(flyout.list);
    });
    
    var itm = info[Math.floor(Math.random() * info.length)];
    elegirBloque(itm);
  
    flyout.list.addEventListener('click', function(evt) {
      evt.stopPropagation();
      var elm = evt.target;
      if(elm.matcheSelector('div')) {
        var datos = elm.dataset.value.split(';').map(function(i) { return parseInt(i) });
        datos.push(elm.textContent);
        elegirBloque(datos);
      }
    }, false);
    
    setTimeout(function() {
      document.dispatchEvent(new CustomEvent('appCargada'));
    }, 500);
  }
  
  flyout.sel.addEventListener('click', function(evt) {
    flyout.list.classList.add('visible');
    flyout.status = true;
  }, false);
  
  cont.addEventListener('click', function(evt) {
    if(flyout.status) {
      flyout.list.classList.remove('visible');
      flyout.status = false;
      return;
    }
    if(evt.target.matcheSelector('span.tile')) {
      var txtarea = new DOMgen('textarea').txt(evt.target.textContent).appTo(cont).item;
      txtarea.select();
      document.execCommand('copy');
      cont.removeChild(txtarea);
    }
  }, false);
  
  /*
  var rango = 1024*8;
  for(var i=rango; i < rango+1024; i++) {
    new DOMgen('span').clase('tile').txt(String.fromCharCode(i)).appTo(bloq);
  }*/
}, false);