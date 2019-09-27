function DOMgen(elem, id, clase) {
  this.item = typeof elem == 'string' ? document.createElement(elem) : elem;
  if(id)
    this.item.id = id;
  if(clase)
    this.item.className = clase;
}

DOMgen.prototype.txt = function(txt) {
  this.item.textContent = txt;
  return this;
};

DOMgen.prototype.i18n = function(clave) {
  if(this.item.nodeName == 'INPUT')
    this.item.value = getI18nMsg(clave);
  else
    this.item.textContent = getI18nMsg(clave);
  return this;
};
  
DOMgen.prototype.clase = function(txt) {
  this.item.className = txt;
  return this;
};
  
DOMgen.prototype.id = function(txt) {
  this.item.id = txt;
  return this;
};
  
DOMgen.prototype.attr = function(att, val) {
  if(typeof att == 'string') {
    if(val == null) {
      return this.item.getAttribute(att);
    }
    this.item.setAttribute(att, val);
  } else if(typeof att == 'object') {
    var that = this.item;
    Object.keys(att).forEach(function(i) {
      that.setAttribute(i, att[i]);
    });
  }
  return this;
};

DOMgen.prototype.on = function(event, funct) {
  if(typeof event == 'string')
    this.item.addEventListener(event, funct, false);
  else {
    for(var i in event)
      this.item.addEventListener(i, event[i], false);
  }
  return this;
};
  
DOMgen.prototype.html = function(txt) {
  this.item.innerHTML = txt;
  return this;
};

DOMgen.prototype.appTo = function(dest) {
  if(dest && dest.nodeType)
    dest.appendChild(this.item);
  return this;
};

DOMgen.prototype.prepTo = function(dest) {
  if(dest && dest.nodeType)
    dest.parentNode.insertBefore(this.item, dest);
  return this;
};