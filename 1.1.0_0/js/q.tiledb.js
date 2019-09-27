window.indexedDB = window.indexedDB || window.webkitIndexedDB;
if ('webkitIndexedDB' in window) {
  window.IDBTransaction = window.webkitIDBTransaction;
  window.IDBKeyRange = window.webkitIDBKeyRange;
}

var MT = MT || {};
MT.miniDB = (function() {

  var db,
    dbname = 'metrotab',
    tilest = 'tiles',
    version = 1,
    orden = 100;

  function onerror(evt) {
    console.error('Base de datos', this, evt);
  }

  function abrirDB() {
    var defer = Q.defer(),
      inicial = indexedDB.open(dbname, version);

    //数据库出错
    inicial.onerror = function(evt) {
      console.error('Error en la apertura de la base de datos');
      defer.reject(evt);
    };
    // http://crbug.com/108223
    //数据库版本号需要发生改变时
    inicial.onupgradeneeded = function(evt) {
      console.warn('Cambio de versión en progreso');
      db = db || evt.target.result;
      
      //if(db.objectStoreNames.contains(that.tilest))
      //  db.deleteObjectStore(that.tilest);
      var newver = db.createObjectStore(tilest, {keyPath: "hashid"});
      newver.createIndex("bloque", "bloque", { unique: false });
      newver.createIndex("orden", "orden", { unique: false });
      
      console.log('Cambio de versión completo');
    };
    //数据库版本改变
    inicial.onversionchange = function() {
      console.log('onversionchange', this);
      defer.notify();
    };
    //数据库打开成功
    inicial.onsuccess = function(evt) {
      console.log('Base de datos abierta correctamente');
      db = evt.target.result;
      
      if(version != db.version) {
        console.log('Cambio de versión, método antiguo');
          //设置数据库版本号
        var req = db.setVersion(version);
        req.onerror = onerror;
        req.onsuccess = evt.target.onupgradeneeded;
        console.log(req);
      }
      //发送广播消息，数据库加载完成
      document.dispatchEvent(new CustomEvent('minidbLoaded'));
      defer.resolve(db);
    };

    return defer.promise;
  }
  
  function objStore(rw) {
        return db.transaction([tilest], rw || 'readonly').objectStore(tilest);
  }
  //added
  function cargarTileByLink(link){
        var
            defer = Q.defer(),
            req = objStore().openCursor().onsuccess = function(event){
                var cursor = event.target.result;
                if(cursor){
                    if(cursor.value.link == link.link){
                        defer.resolve(true);
                    }else{
                        cursor.continue();
                    }
                }else{
                    defer.resolve(link);
                }
            };
        return defer.promise;
  }
  function cargarTile(model) {
    var
      defer = Q.defer(),
      req = objStore().get(model.id ? model.id : model);
    
    req.onerror = function(evt) {
      console.error('Error durante la obtención', model, evt);
      defer.reject(evt);
    };
    
    req.onsuccess = function(evt) {
      //console.log('Inserción completada con éxito', evt);
      defer.resolve(evt.target.result);// datos modelo del tile
    };
    
    return defer.promise;
  }

  //增加一个磁贴到数据库
  function guardarTile(model) {
    var req, datos,
      defer = Q.defer();

    datos = {
      'hashid': model.id || model.hashid,
      'bloque': model.bloque,
      'orden': (model.orden === 0 ? 0 : (model.orden || orden)),
      'etiqueta': model.etiqueta,
      'link': model.link,
      'doble': model.doble,
      'dimens': model.dimens,
      'icono': model.icono,
      'bgcolor': model.bgcolor,
      'chromeapp': model.chromeapp,
      'notificador': model.notificador,
      'livetile': model.livetile,
      'rssurl': model.rssurl,
      'html':model.html?model.html:""
    };
    if(model.spfunc)
      datos.spfunc = model.spfunc;
    orden++;
    req = objStore('readwrite').put(datos);
    
    req.onerror = function(evt) {
      console.error('Error durante la inserción', model, evt);
      defer.reject(evt);
    };
    
    req.onsuccess = function(evt) {
      //console.log('Inserción completada con éxito', evt.target.result, evt);
      defer.resolve(evt.target.result);// id del tile insertado
    };
    //tx.oncomplete = function(evt) {
      //console.log('Transacción completada', evt);
    //};
    
    return defer.promise;
  }

  function borrarTile(model) {
    var req,
      defer = Q.defer();
    
    req = objStore('readwrite').delete(model.id ? model.id : model);
    
    req.onerror = function(evt) {
      console.error('Error durante la eliminación', model, evt);
      defer.reject(evt);
    };
    
    req.onsuccess = function(evt) {
      //console.log('Eliminación completada con éxito', evt);
      defer.resolve(evt.target);
    };
    
    return defer.promise;
  }


  //遍历取数据库数据
  function cursor(indice) {
    var cursor,
      lista = [],
      defer = Q.defer();
    
    cursor = objStore('readwrite').index(indice || 'orden').openCursor();
    
    cursor.onerror = function(evt) {
      console.error('Error en el procesamiento del cursor', indice, evt);
      defer.reject(evt);
    };

    //取数据
    cursor.onsuccess = function(evt) {
        //如果取到尾就返回
        if(!!evt.target.result == false) {
        console.log('Cursor finalizado completamente con éxito');
        defer.resolve(lista);
        return;
      }
      //压入数据,继续遍历
      lista.push(evt.target.result.value);
      evt.target.result.continue();
    };

    
    return defer.promise;
  }

  return {
    get db() { return db; },
    abrir: abrirDB,
    objStore: objStore,
    cursor: cursor,
    getTile: cargarTile,
    setTile: guardarTile,
    delTile: borrarTile,
    //added
    inLink:cargarTileByLink
  }
})();