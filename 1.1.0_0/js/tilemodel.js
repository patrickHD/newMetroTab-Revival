var MT = MT || {};
MT.modelBase = MT.modelBase || {};
MT.spBase = MT.spBase || {};

//数据库对象化
var Tile = function (datos) {
    this.id = datos.hashid || MT.utiles.genID();
    this.bloque = datos.bloque;
    this.orden = datos.orden || document.getElementsByClassName('tile').length;
    this.etiqueta = datos.etiqueta;
    this.link = datos.link;
    this.dimens = datos.dimens || [2, 2];
    this.bgcolor = datos.bgcolor;
    this.icono = datos.icono;
    this.chromeapp = datos.chromeapp;
    this.livetile = !!datos.livetile;
    this.rssurl = datos.rssurl;
    this.spfunc = datos.spfunc;
    this.html = datos.html ? datos.html : "";
    this.DOM = {};
    //创建DOM节点
    this.genDOM();

    MT.modelBase[this.id] = this;
};

if (chrome.management && chrome.management.onUninstalled) {
    chrome.management.onUninstalled.addListener(function (id) {
        MT.modelBase[id].eliminar();
        MT.modelBase[id].DOM.tile.parentNode.removeChild(MT.modelBase[id].DOM.tile);
        delete MT.modelBase[id];
    });
}
(function () {
    // http://stackoverflow.com/questions/4726344/how-do-i-change-text-color-determined-by-the-background-color
    //获取想要的标题文字颜色
    function idealTextColor(bgColor) {
        var nThreshold = 50;
        var components = getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "negro" : "blanco";
    }

    //获取RGB颜色值
    function getRGBComponents(color) {
        if (color.indexOf('rgb') > -1) {
            var test = color.replace(/\s/g, '').split(',');
            return {
                R: parseInt(test[0].split('(')[1]),
                G: parseInt(test[1]),
                B: parseInt(test[2].split(')')[0])
            };
        } else {
            return {
                R: parseInt(color.substr(1, 2), 16),
                G: parseInt(color.substr(3, 2), 16),
                B: parseInt(color.substr(5, 2), 16)
            };
        }
    }

    //清空数据
    function bloquesVacios() {
        [].forEach.call(document.querySelectorAll('.bloque:empty'), function (itm) {
            itm.parentNode.removeChild(itm);
        });
        document.dispatchEvent(new CustomEvent('comprimir'));
    }

    Tile.prototype.genDOM = function () {
        //最外层a标签
        this.DOM.tile = document.createElement('a'),
            //icon图片标签
            this.DOM.icon = document.createElement('div'),
            //etiqueta标题标签
            this.DOM.name = document.createElement('div');
        //设置a标签ID号
        this.DOM.tile.id = this.id;
        //设置a标签draggable属性
        this.DOM.tile.setAttribute('draggable', true);
        //将图片标签加入a中
        this.DOM.tile.appendChild(this.DOM.icon);
        //将标题标签加入a中
        this.DOM.tile.appendChild(this.DOM.name);
        //html
        if (this.html) {
            this.DOM.html = document.createElement("div");
            this.DOM.tile.appendChild(this.DOM.html);
        }
        this.actualizar();

        return this.DOM.tile;
    };

    Object.defineProperty(Tile.prototype, "esDoble", {
        get: function esDoble() {
            return (this.dimens[0] == 4);
        }
    });

    Tile.prototype.actualizar = function () {
        //设置类名
        this.DOM.tile.className = 'tile';
        //设置链接地址
        this.DOM.tile.href = this.link;
        //设置图片标签类名
        this.DOM.icon.className = 'icono';
        //设置标题标签类名
        this.DOM.name.className = 'etiqueta';
        //设置标题的内容
        this.DOM.name.innerHTML = this.etiqueta;
        //this.DOM.name.style.display = this.vernombre ? 'block' : 'none';
        //设置座标点
        this.DOM.tile.dataset.ancho = this.dimens[0];
        this.DOM.tile.dataset.alto = this.dimens[1];
        //添加类样式，HTML5方法
        this.DOM.tile.classList.add('tam' + this.dimens.join(''));
        //设置背景底图
        if (this.icono)
            this.DOM.icon.style.backgroundImage = 'url(' + this.icono + ')';
        //设置动态图样式
        if (this.livetileon)
            this.DOM.tile.classList.add('notificacion');
        //设置APP样式
        if (this.chromeapp){
            this.DOM.tile.classList.add('app');
            //设置pack app
            if (this.chromeapp.type)
            	this.DOM.tile.classList.add(this.chromeapp.type);
        }
        //设置背景颜色+设置标题颜色
        if (this.bgcolor) {
            this.DOM.tile.classList.add(idealTextColor(this.bgcolor));
            this.DOM.icon.style.backgroundColor = this.bgcolor;
        }
        //设置html
        if (this.DOM.html) {
            this.DOM.html.style.display = "none";
            this.DOM.html.innerHTML = this.html;
        }
    };
    //设置Box图标,重新刷新
    Tile.prototype.setIcono = function (icono) {
        this.icono = icono;
        this.guardar();
        this.actualizar();
    };
    //设置box颜色，重新刷新
    Tile.prototype.setColor = function (color) {
        if (color && color != this.bgcolor) {
            this.bgcolor = color;
            this.guardar();
            this.actualizar();
        }
        return this;
    };
    //设置大小位置，重新刷新
    Tile.prototype.cambiaTam = function (ancho, alto) {
        this.dimens = [ancho, alto];
        this.guardar();
        this.actualizar();
        return this;
    };
    //设置标题，重新刷新
    Tile.prototype.etiquetar = function () {
        //开启输入对话框
        var tag = prompt(getI18nMsg('ingresaretiqueta'), this.etiqueta);
        if (tag && tag != this.etiqueta) {
            this.etiqueta = tag;
            this.guardar();
            this.actualizar();
        }
        return this;
    };

    Tile.prototype.guardar = function () {
        MT.miniDB.setTile(this);
        return this;
    };
    //删除Tile
    Tile.prototype.eliminar = function () {
        var model = this;
        MT.miniDB.delTile(this.id).then(function () {
            model.DOM.tile.parentNode.removeChild(model.DOM.tile);
            delete MT.modelBase[model.id];
            bloquesVacios();
        });
    };
    Tile.prototype.desinstalarApp = function () {
        chrome.management.uninstall(this.id, {showConfirmDialog: true});
        bloquesVacios();
    };
})();