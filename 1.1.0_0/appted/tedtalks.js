var MT = MT || {};

(function() {

var elementos = new Array(),
    cargados = {},
    cargando = false;

function cargarLista() {
  var req = new XMLHttpRequest();
  req.open('GET', 'http://feeds.feedburner.com/tedtalks_video?_='+(+new Date), true);
  req.onload = function() {
    if(this.status == 200) {
      var elems = this.responseXML.getElementsByTagName('item'),
          lista = [];
      if(elems.length) {
        for(i=0; i<elems.length; i++)
          lista[i] = genDict(elems[i]);

        elementos = lista;
        document.dispatchEvent(new CustomEvent('appCargada'));
      }
    }
  };
  req.send();
}

function genDict(xmldom) {
  var dict = {},
      itm, i, j;
  for(itm = xmldom.firstElementChild; itm; itm = itm.nextElementSibling) {
    dict[itm.nodeName] = {};
    dict[itm.nodeName].txt = itm.textContent;
    if(itm.attributes.length > 0) {
      for(j=0; j < itm.attributes.length; j++)
        dict[itm.nodeName][itm.attributes[j].nodeName] = itm.attributes[j].nodeValue;
    }
  }
  return dict;
}

function cargarItems() {
  var cont = document.getElementById('pivot'),
      alto = (cont.offsetHeight - 136) / 2,
      carga = 0,
      i = -1,
      loader, img;
  
  cargando = true;
  loader = document.createElement('div');
  loader.className = 'cargando';
  loader.id = 'toploader';
  loader.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
  document.body.appendChild(loader);

  while(carga < 20 && i < elementos.length) {
    i++;
    if(!elementos[i]['itunes:image'].url || elementos[i]['jwplayer:talkId'].txt in cargados)
      continue;
    
    img = new Image();
    img.datos = elementos[i];
    img.onload = function() {
      var canv = document.createElement('canvas'),
          elem = new DOMgen('a'),
          head = new DOMgen('div'),
          info = new DOMgen('div'),
          ancho = Math.floor(this.width * alto / this.height),
          ind = this.datos['itunes:subtitle'].txt.indexOf(':'),
          blob, j, listo;
      
      canv.height = alto-10;
      canv.width = ancho;
      canv.getContext("2d").drawImage(this, 0, 0, ancho, alto);
      
      elem.id(this.datos['jwplayer:talkId'].txt).clase('item').attr({
        href: this.datos['feedburner:origLink'].txt,
        title: this.datos['itunes:subtitle'].txt.substring(ind+1),
        style: 'width: '+ ancho +'px'
      });
      
      head.clase('head').attr('title', this.datos['itunes:subtitle'].txt.substr(ind+1)).appTo(elem.item).item.appendChild(canv);
      
      info.clase('info').appTo(elem.item);
      //new DOMgen('h3').txt(this.datos['itunes:subtitle'].txt).appTo(info.item);
      new DOMgen('h4').txt(this.datos['itunes:author'].txt +' / '+ this.datos['itunes:duration'].txt).appTo(info.item);
      new DOMgen('p').txt(this.datos['itunes:summary'].txt).appTo(info.item);
      
      cont.appendChild(elem.item);
      
      loader.classList.remove(this.datos['jwplayer:talkId'].txt);
      if(loader.className == 'cargando') {
        loader.parentElement.removeChild(loader);
        cargando = false;
      }
    };
    img.src = elementos[i]['itunes:image'].url;
    
    loader.classList.add(elementos[i]['jwplayer:talkId'].txt);
    cargados[elementos[i]['jwplayer:talkId'].txt] = false;
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
  cargarLista();
  document.body.firstElementChild.addEventListener(transitionEnd, function() {
    cargarItems();
  }, false);
  
  document.getElementById('pivot').addEventListener('scroll', function() {
    if(!cargando && this.scrollLeft + this.offsetWidth >= this.scrollWidth - 300)
      cargarItems();
  }, false);
  
}, false);

})();