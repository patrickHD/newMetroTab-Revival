(function() {
  function sobrePantalla(titulo) {
    var pant = document.createElement('div');
    pant.id = 'pantalla';
    document.body.appendChild(pant);
    
    var cont = document.createElement('div');
    cont.className = 'pantalla';
    pant.appendChild(cont);
    
    var titl = document.createElement('h2');
    titl.className = 'centro';
    titl.textContent = titulo;
    cont.appendChild(titl);
    
    pant.addEventListener('click', function(evt) {
      if( evt.target.isEqualNode(pant) ) {
        pant.addEventListener(transitionEnd, function eliminar(evt) {
          pant.removeEventListener(transitionEnd, eliminar, false);
          document.body.removeChild(pant);
        }, false);
        pant.classList.remove('visible');
      }
    }, false);
    
    var frame = document.createElement('div');
    frame.className = 'centro';
    cont.appendChild(frame);

    requestAnimFrame(function() {
        pant.classList.add('visible');
    });
    
    return frame;
  }

  var reloj = {
    subcon: null,
    tzreg: null,
    genCuadro: function(info) {
      var sq = document.createElement('div'),
        delb = document.createElement('button'),
        ubic = document.createElement('span');
      
      sq.className = 'relojtzreg';
      sq.dataset.pais = info.pais;
      sq.dataset.lugar = info.lugar;
      sq.dataset.offnor = info.offnor;
      sq.dataset.offdst = info.offdst;
      sq.dataset.dston = info.dston || false;
      
      delb.textContent = '×';
      sq.appendChild(delb);
      ubic.textContent = info.pais +' / '+ info.lugar;
      sq.appendChild(ubic);
      
      if( info.offnor != info.offdst ) {
        var dstl = document.createElement('label'),
          ckbx = document.createElement('input');
        ckbx.id = 'reloj'+ info.pais + info.lugar;
        ckbx.type = 'checkbox';
        ckbx.checked = info.dston === 'true';
        dstl.setAttribute('for', ckbx.id);
        dstl.textContent = 'DST';
        dstl.appendChild(ckbx);
        sq.appendChild(dstl);
      }
      
      reloj.tzreg.appendChild(sq);
    },
    cargar: function() {
      asyncXHR('/tz.txt').then(function(req) {
        var i, itm,
          reg = new RegExp('_', 'gi'),
          lista = req.responseText.split('\n');
        for(i=1; itm = lista[i]; i++) {
          reloj.listado.push(itm.replace(reg, ' ').split('\t'));
        }
      });
      
      var reg = JSON.parse(localStorage.getItem('livet_zonahora') || '[]');
      reg.forEach(reloj.genCuadro);
    },
    abrirPantalla: function() {
      var cont = sobrePantalla(getI18nMsg('ubicacion_anadir'));
      
      var subt = document.createElement('h3'),
        busq = document.createElement('input');
      reloj.subcon = document.createElement('div');
      subt.textContent = getI18nMsg('ubicacion_buscar');
      subt.className = 'enlinea';
      busq.type = 'text';
      busq.placeholder = 'America/Santiago';
      busq.addEventListener('keyup', reloj.filtro, false);
      reloj.subcon.style.height = Math.floor(document.body.offsetHeight * 0.5) + 'px';
      reloj.subcon.className = 'contprinc';
      reloj.subcon.addEventListener('click', reloj.anadir, false);
      
      cont.appendChild(subt);
      cont.appendChild(busq);
      cont.appendChild(reloj.subcon);
    },
    listado: [],
    filtro: function() {
      reloj.subcon.innerHTML = '';
      var txt = new RegExp(this.value, 'i');

      reloj.listado.filter(function(itm) {
        return txt.test(itm[1]);
      }).map(function(itm) {
        var elem = document.createElement('span');
        elem.className = 'reloj_ubic';
        elem.dataset.pais = itm[0];
        elem.textContent = itm[1];
        elem.dataset.offnor = itm[2];
        elem.dataset.offdst = itm[3];
        reloj.subcon.appendChild(elem);
        elem = null;
      });
    },
    anadir: function(evt) {
      if(!evt.target.classList.contains('reloj_ubic'))
        return;
      
      reloj.genCuadro({
        pais: evt.target.dataset.pais,
        lugar: evt.target.textContent.split('/').pop(),
        offnor: evt.target.dataset.offnor,
        offdst: evt.target.dataset.offdst,
        dston: false
      });
      
      reloj.guardar();
      document.getElementById('pantalla').click();
    },
    opciones: function(evt) {
      if( evt.target.nodeName == 'INPUT' ) {
        var cont = evt.target.parentNode.parentNode;
        cont.dataset.dston = evt.target.checked;
      } else if( evt.target.nodeName == 'BUTTON' ) {
        var cont = evt.target.parentNode;
        cont.parentNode.removeChild(cont);
      }
      reloj.guardar();
    },
    guardar: function() {
      var lista = [];
      [].forEach.call(reloj.tzreg.children, function(lug) {
        lista.push(lug.dataset);
      });
      localStorage.setItem('livet_zonahora', JSON.stringify(lista));
      console.log(lista);
    }
  };
  
  var devart = {
    cargarItems: function() {
      var lista = (localStorage.getItem('livet_da_include') || '').split('&');
      
      [].forEach.call(document.getElementsByClassName('devartitems'), function(elm, i) {
        elm.checked = lista.indexOf(elm.name) != -1;
      });
    },
    guardarItems: function() {
      var lista = [];
      
      [].forEach.call(document.getElementsByClassName('devartitems'), function(elm, i) {
        if(elm.checked)
          lista.push(elm.name);
      });
      
      localStorage.setItem('livet_da_include', lista.join('&'));
    }
  };

  var clima = {
    cargarItems: function() {
      clima.lista.innerHTML = '<option value="'+ localStorage.getItem('livet_clima_ubic') +'">'+ localStorage.getItem('livet_clima_busubic') +'</option>';
      clima.cuadro.textContent = '';
      document.getElementById('livet-clima'+(localStorage.getItem('livet_climasist') == 'true' ? 'cels' : 'fahr')).checked = true;
    },
    guardarItems: function() {
      localStorage.setItem('livet_clima_ubic', clima.lista.value);
      localStorage.setItem('livet_clima_busubic', clima.lista.selectedOptions[0].textContent);
    },
    buscarLug: function(evt) {
      if(this.value.length < 4)
        return;
      var req = new XMLHttpRequest();
      req.open('GET', 'http://autocomplete.wunderground.com/aq?query='+ evt.target.value, true);
      req.onload = clima.cargarLug;
      req.send();
    },
    cargarLug: function() {
      var resp = JSON.parse(this.responseText);

      clima.lista.innerHTML = '';
      resp.RESULTS.forEach(function(itm) {
        var opt = document.createElement('option');
        opt.value = itm.l;
        //opt.label = itm.name;
        opt.textContent = itm.name;
        clima.lista.appendChild(opt);
      });
      clima.guardarItems();
    }
  };
  
  var feedrss = {
    campo: null,
    urls: {
      feedly: 'https://cloud.feedly.com/',
      digg: 'http://reader.digg.com/',
      aol: 'https://reader.aol.com/',
      ino: 'https://www.inoreader.com/'
      //get otro() { return (prompt('Ingresa la dirección URL de tu lector de feeds') || false) }
    },
    cambio: function() {
      feedrss.campo.livet_rssauth_user.value = '';
      feedrss.campo.livet_rssauth_pswd.value = '';
      if(this.value == 'digg') {
        feedrss.campo.classList.remove('visible');
        feedrss.fijarOpc();
      } else {
        feedrss.campo.classList.add('visible');
      }
    },
    autorizar: function(evt) {
      evt.preventDefault();
      var urlbase = feedrss.urls[feedrss.opts.value],
        llaves = [feedrss.opts.value],
        claves = {
          'Email': this.livet_rssauth_user.value,
          'Passwd': this.livet_rssauth_pswd.value
      };
      
      function noCarga() {
        throw new Error('Server unreachable. Please, try again later.');
      }
      function presentarError(err) {
        alert(err.message);
      }
      
      asyncXHR(urlbase +'accounts/ClientLogin', {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        params: claves,
        method: 'POST'
      }).then(function(req) {
        console.log('RSS auth', 1);
        if(req.status == 200) {
          var llave = req.responseText.replace(/\n/g,'').split('Auth=')[1];
          llaves.push(llave);
          return llave;
        } else if(req.status == 401) {
          throw new Error(getI18nMsg('auth_denied'));
        }
      }, noCarga).then(function(llave) {
        console.log('RSS auth', 2);
        return asyncXHR(urlbase +'reader/api/0/user-info', {
          headers: {'Authorization': 'GoogleLogin auth='+llave}
        });
      }, presentarError).then(function(req) {
        console.log('RSS auth', 3);
        if(req.status == 200) {
          llaves.push(JSON.parse(req.responseText).userId);
          return llaves;
        } else {
          throw new Error('Error desconocido');
        }
      }, noCarga).then(function(keys) {
        console.log('RSS auth', 4);
        alert(getI18nMsg('auth_approved'));
        localStorage.setItem('rssauthhead', keys);
        feedrss.fijarOpc();
      });
    },
    fijarOpc: function() {
      var newlink = feedrss.urls[feedrss.opts.value || 'digg'];
      MT.miniDB.getTile('tilerss').then(function(tile) {
        tile.link = newlink;
        return tile;
      }).then(MT.miniDB.setTile).then(function() {
        feedrss.inicial = feedrss.opts.value;
        feedrss.campo.livet_rssauth_user.value = '';
        feedrss.campo.livet_rssauth_pswd.value = '';
        setTimeout(function() {
          feedrss.campo.classList.remove('visible');
        }, 1500);
      });
    },
    reset: function() {
      feedrss.campo.classList.remove('visible');
      feedrss.opts.value = feedrss.inicial;
    }
  };
  
  function cargarLector() {
    //var tileid = localStorage.getItem('rsstileid') || 'tilerss';
    MT.miniDB.getTile('tilerss').then(function(tile) {
      feedrss.inicial = 'digg';
      Object.keys(feedrss.urls).some(function(opt) {
        if(feedrss.urls[opt] == tile.link) {
          feedrss.opts.value = opt;
          feedrss.inicial = opt;
          return true;
        }
        return false;
      });
      feedrss.opts.addEventListener('change', feedrss.cambio, false);
      feedrss.campo.addEventListener('submit', feedrss.autorizar, false);
      feedrss.campo.addEventListener('reset', feedrss.reset, false);
    });
    document.removeEventListener('minidbLoaded', cargarLector, false);
  }
  
  window.addEventListener(windowLoad, function() {
    feedrss.campo = document.getElementById('livet-rssauth');
    feedrss.opts = document.getElementById('livet-rss-reader');
    document.addEventListener('minidbLoaded', cargarLector, false);
    
    clima.cuadro = document.getElementById('livet-clima-busubic');
    clima.lista = document.getElementById('livet-clima-ubic');
    
    clima.cargarItems();

    clima.cuadro.addEventListener('keyup', clima.buscarLug, false);
    clima.lista.addEventListener('change', clima.guardarItems, false);
    
    document.getElementById('livet-reloj-add').addEventListener('click', reloj.abrirPantalla, false);
    reloj.tzreg = document.getElementById('livet-reloj-tzreg');
    reloj.tzreg.addEventListener('click', reloj.opciones, false);
    reloj.cargar();

    devart.cargarItems();
    $('#devart-items').on('change', 'input', devart.guardarItems);
  }, false);

})();