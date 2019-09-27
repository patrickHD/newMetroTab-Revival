(function() {
  var optactivpcr, optactivbkmr;
  
  function onerror() {
    console.log(arguments);
  }
  
  function dependencia() {
    var status = !this.checked;
    if(this.dataset.dependencias) {
      this.dataset.dependencias.split(',').forEach(function(d) {
        document.getElementById(d).disabled = status;
      });
    }
  }
  function permResult(result) {
    console.log('Estado de la función', this.id, result);
    this.checked = result;
    dependencia.call(this);
  }
  
  function generarPeticion(permiso) {
    return (function(evt) {
      var that = this;
      chrome.permissions[that.checked ? 'request' : 'remove'](
        { permissions: permiso.split(',') },
        function(result) {
          that.checked = that.checked ? !!result : !result;
          if (result) {
            console.log(that.checked ? 'Permiso concedido: '+ permiso +', función habilitada' : 'Permiso removido: '+ permiso +', función deshabilitada');
          } else {
            console.error(that.checked ? 'Permiso no concedido: '+ permiso : 'Ocurrió un problema al desactivar la función');
          }
          dependencia.call(that);
        }
      );
    });
  }
  
  window.addEventListener('load', function() {
    // PCR
    optactivpcr = document.getElementById('opcional-activpcr');
    tengoPermiso('tabs').then(permResult.bind(optactivpcr));
    optactivpcr.addEventListener('change', generarPeticion('tabs'), false);
    
    // BKMR
    optactivbkmr = document.getElementById('opcional-activbkmr');
    tengoPermiso('bookmarks').then(permResult.bind(optactivbkmr));
    optactivbkmr.addEventListener('change', generarPeticion('bookmarks'), false);
  }, false);
})();