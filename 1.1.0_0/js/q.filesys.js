window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

var MT = MT || {};
MT.fileSys = (function() {

  var fs,
    dirbase = [];

  function errorHandler(err) {
    var msg = 'An error occured: ';

    switch (err.code) { 
      case FileError.NOT_FOUND_ERR: 
        msg += 'File or directory not found'; 
        break;

      case FileError.NOT_READABLE_ERR: 
        msg += 'File or directory not readable'; 
        break;

      case FileError.PATH_EXISTS_ERR: 
        msg += 'File or directory already exists'; 
        break;

      case FileError.TYPE_MISMATCH_ERR: 
        msg += 'Invalid filetype'; 
        break;

      default:
        msg += 'Unknown Error'; 
        break;
    }

    console.error(msg);
  }
  
  function initFS() {
    window.requestFileSystem(window.PERSISTENT, 5*1024*1024, function(res) {
      alert("Welcome to Filesystem! It's showtime :)");
      fs = res;
    
      // place the functions you will learn bellow here
    }, errorHandler);
  }
  
  // directorio(fs.root, 'Documents/Images/Nature/Sky/'); 
  function directorio(raiz, ruta) {
    var defer = Q.defer();
    
    if (typeof ruta == 'string')
      ruta = ruta.split('/');
    
    raiz.getDirectory(ruta[0], {create: true}, function(nraiz) {
      if (ruta.length > 1)
        directorio(nraiz, ruta.slice(1));
      else
        defer.resolve(nraiz);
    }, defer.reject);
    
    return defer.promise;
  }
  
  function ruta(ruta) {
    var defer = Q.defer();
    
    raiz.getDirectory(ruta[0], {create: true}, function(nraiz) {
      if (ruta.length > 1)
        directorio(nraiz, ruta.slice(1));
      else
        defer.resolve(nraiz);
    }, defer.reject);
    
    return defer.promise;
  }
  
  function elementos(raiz) {
    var defer = Q.defer(),
      dirReader = raiz.createReader();
    
    dirReader.readEntries(function(elems) {
      var itm, i;
      for(i=0; itm = elems[i]; i++) {
        if (itm.isDirectory) {
          console.log('Directorio', itm.fullPath, itm);
        } else if (itm.isFile) {
          console.log('Archivo', itm.fullPath, itm);
        }
      }
      itm = null;
      defer.resolve(elems);
    }, defer.reject);
    
  }
  
  function borrarDir(raiz) {
    var defer = Q.defer();
    raiz.remove(defer.resolve, defer.reject);
    return defer.promise;
  }
  
  function vaciarDir(raiz) {
    var defer = Q.defer();
    raiz.removeRecursively(defer.resolve, defer.reject);
    return defer.promise;
  }
  
  function obtenerArchivo(ruta) {
    var defer = Q.defer();
    fs.root.getFile(ruta, {create: false}, defer.resolve, defer.reject);
    return defer.promise;
  }
  
  function crearArchivo(ruta) {
    var defer = Q.defer();
    fs.root.getFile(ruta, {create: true, exclusive: true}, defer.resolve, defer.reject);
    return defer.promise;
  }
  
  function escribirArchivo(archivo, contenido) {
    archivo.createWriter(function(fileWriter) {
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder; 
    var bb = new BlobBuilder();
    bb.append('Filesystem API is awesome!');
    fileWriter.write(bb.getBlob('text/plain')); 
  }, errorHandler);
  }
  
  return {
    get fs() { return fs; },
    abrir: initFS,
    cd: ruta,
    dir: elementos,
    delDir: borrarDir,
    delAll: vaciarDir,
    getFile: obtenerArchivo,
    setTile: crearArchivo,
    delTile: borrarTile
  }
})();