(function() {

var stream, video, canvas, contextual;

function activar() {
  navigator.webkitGetUserMedia({video: true, audio: false}, function(localMediaStream) {
    canvas = document.createElement('canvas');
    video = document.createElement('video');
    var contxt = canvas.getContext('2d');
        
    stream = localMediaStream;
    video.src = window.URL.createObjectURL(localMediaStream);

    video.addEventListener('canplaythrough', function(e) {
      console.log('Ready to go. Do some stuff.');
      
      canvas.id = 'fullview';
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      
      this.play();
      setInterval(function() {
        contxt.drawImage(video, 0, 0);
      }, 50);
      
      document.dispatchEvent(new CustomEvent('appCargada'));
    }, false);
    
    canvas.addEventListener('click', capturar, false);

    console.log(localMediaStream);
    document.getElementById('contenedor').appendChild(canvas);
  }, function() {
    console.error('Error en la carga: ', arguments);
  });
};

function capturar() {
  chrome.tabs.create({url: canvas.toDataURL()});
};

function qr(canvas) {
  var contxt = canvas.getContext('2d');
  qrcode.width = canvas.width;
  qrcode.height = canvas.height;
  qrcode.imagedata = contxt.getImageData(0, 0, qrcode.width, qrcode.height);
  qrcode.result = qrcode.process(contxt);
  return qrcode.result;
};

var menu = document.getElementById('contextual');
contextual = {};
contextual.status = false;
contextual.abrir = function(evt) {
  evt.preventDefault();
  contextual.status = true;
  menu.innerHTML = '';
  
  //new DOMgen('span').id('camara-captura').i18n('camara_captura').on('click', MT.camara.capturar).appTo(menu);
  new DOMgen('span').id('camara-ajustes').i18n('camara_ajustes').appTo(menu);
};

contextual.cerrar = function() {
  if(contextual.status) {
    contextual.status = false;
    menu.innerHTML = '';
  }
};

document.addEventListener('DOMContentLoaded', function(evt) {
  //var holder = document.getElementById('contenedor');
  //holder.addEventListener('contextmenu', contextual.abrir, false);
  //holder.addEventListener('click', contextual.cerrar, false);
  
  //activar();
  var holder = document.getElementById('aviso');
  
  new DOMgen('h2').appTo(holder).txt('Camera miniapp temporarily disabled');
  new DOMgen('p').appTo(holder).txt('Since Chrome 28, miniapp Camera has stopped working, due to restrictions on the permissions on Chrome extensions.');
  new DOMgen('p').appTo(holder).txt('The tile has been removed from the list that comes by default, and will be reinstated when the miniapp is working again.');
  new DOMgen('p').appTo(holder).txt('Meanwhile, the miniapp Camera will not be available.');
  new DOMgen('a').appTo(new DOMgen('p').appTo(holder).txt('I suggest you to check the Paul Neave\'s webapp, ').item).txt('Webcam Toy').attr('href', 'http://webcamtoy.com/');
  
  setTimeout(function() {
    document.dispatchEvent(new CustomEvent('appCargada'));
  }, 1000);
}, false);

})();