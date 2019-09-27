var MT = MT || {};

(function() {

var elementos = new Array(),
  cargados = {},
  cargando = false;

function cargarPag() {
  var loader, img,
    i = 0,
    cont = document.getElementById('pivot'),
    alto = cont.offsetHeight - 150,
    inicial = cont.childElementCount > 0 ? parseInt(cont.lastElementChild.name) + 1 : 0,
    carga = 0;
  
  cargando = true;
  
  loader = document.createElement('div');
  loader.className = 'cargando';
  loader.id = 'toploader';
  loader.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
  requestAnimFrame(function() {
    document.body.appendChild(loader);
  });

  while(carga < 20 && i < elementos.length) {
    i++;
    if(!elementos[i].url_k || elementos[i].id in cargados)
      continue;
    
    img = new Image();
    img.datos = elementos[i];
    img.onload = function() {
      var blob, j, listo,
        that = this,
        canv = document.createElement('canvas'),
        elem = document.createElement('a'),
        ancho = Math.floor(that.width * alto / that.height);
      
      canv.height = alto;
      canv.width = ancho;
      canv.getContext("2d").drawImage(that, 0, 0, ancho, alto);
      
      elem.id = that.datos.id;
      elem.className = 'foto';
      elem.href = 'http://www.flickr.com/photos/'+ that.datos.owner +'/'+ that.datos.id +'/';
      elem.title = that.datos.title;

      requestAnimFrame(function() {
        elem.appendChild(canv);
        cont.appendChild(elem);
        
        loader.classList.remove(that.datos.id);
        if(loader.className == 'cargando') {
          loader.parentElement.removeChild(loader);
          cargando = false;
        }
      });
    };
    img.src = elementos[i].url_k;
    
    loader.classList.add(elementos[i].id);
    cargados[elementos[i].id] = false;
    carga++;
  }
}

function dataURLtoBlob(dataURL) {
  var baits = atob(dataURL.split(',')[1]),
      mime = dataURL.split(',')[0].split(':')[1].split(';')[0],
      ab = new ArrayBuffer(baits.length),
      ia = new Uint8Array(ab);
  
  for (var i = 0; i < baits.length; i++)
    ia[i] = baits.charCodeAt(i);
  
  return new Blob([ia], {type: mime});
}


window.addEventListener(windowLoad, function() {
  var fotos = localStorage.getItem('livet_flickr_tmp'),
      link;
  document.body.firstElementChild.addEventListener(transitionEnd, function() {
    if(fotos) {
      elementos = JSON.parse(fotos);
      cargarPag();
    }
  }, false);
  
  document.getElementById('pivot').addEventListener('scroll', function() {
    if(!cargando && this.scrollLeft + this.offsetWidth >= this.scrollWidth - 300)
      cargarPag();
  }, false);
  setTimeout(function() {
    document.dispatchEvent(new CustomEvent('appCargada'));
  }, 1000);
}, false);

})();