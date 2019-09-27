//动态图接口
function LiveCards(tile) {
    //创建节点
    this.cont = document.createElement('div');
    //设置类名
    this.cont.className = 'fullslider';
    this.tile = tile;
    this.cards = [];
    //增加CSS STYLE
    var style = document.createElement("style");
    style.textContent = '#' + tile.id + ' .fullslider::before {background-image: url(' + tile.icono + ');}';
    document.getElementsByTagName('head')[0].appendChild(style);
    tile.livetileon = true;
    //将节点添加到文档中
    tile.DOM.icon.appendChild(this.cont);
    //添加类名
    tile.DOM.tile.classList.add('notificacion');
    //隐藏标题
    tile.DOM.name.style.display = 'none';
}

//动态图
LiveCards.prototype.activar = function (n) {
    var that = this.cont;
    setTimeout(function () {
        var cuenta = n || that.childElementCount;
        if (cuenta > 1) {
            that.addEventListener(animationEnd, function sliderEnd(e) {
                requestAnimFrame(function () {
                    e.target.parentNode.appendChild(e.target);
                    e.target.style.webkitAnimationDelay = Math.ceil(5 + Math.random() * 4) + 's';
                });
            }, false);
        } else {
            that.classList.add('unico');
        }
        that = null;
    }, 2000);
};

LiveCards.prototype.unico = function () {
    this.cont.classList.add('unico');
    return this;
};

LiveCards.prototype.genNumero = function (num) {
    this.tile.DOM.tile.classList.remove('notificacion');
    if (!num) return false;
    num = num.number ? num.number : num;

    this.cont.parentNode.removeChild(this.cont);
    this.cont = document.createElement('div');

    var tile = this.tile,
        premsg = ['activity', 'available', 'away', 'busy', 'newMessage', 'paused', 'playing', 'unavailable', 'error', 'attention'],//falta la 'alert'
        card = document.createElement('div');
    card.className = 'comnumero';
    if (premsg.indexOf(num) != -1)
        new DOMgen('img').attr('src', '/img/badge_' + num + '.svg').appTo(card);
    else if (!isNaN(num))
        card.textContent = num;

    requestAnimFrame(function () {
        tile.DOM.name.style.display = null;
        tile.DOM.icon.appendChild(card);
    });
    return card;
};

LiveCards.prototype.granNumero = function (obj) {
    if (!obj && !obj.num) return false;

    var cont = this.cont,
        card = document.createElement('div'),
        numero = document.createElement('div'),
        texto = document.createElement('div');

    card.className = 'fullblock grannum';
    numero.className = 'numerotote';
    numero.textContent = obj.num || obj.number;
    texto.className = 'textito';
    texto.textContent = obj.txt || obj.text;
    card.appendChild(numero);
    card.appendChild(texto);

    requestAnimFrame(function () {
        cont.appendChild(card);
    });

    return card;
};

LiveCards.prototype.genFoto = function (obj) {
    if (!obj.img)
        return false;

    var cont = this.cont,
    //创建动态图标签节点
        card = document.createElement('div'),
        pie = document.createElement('div');
    //设置类名
    card.className = 'fullblock foto';
    //设置背景图
    card.style.backgroundImage = 'url(' + obj.img + ')';
    //未知？
    pie.className = 'piefoto';

    if (obj.link) {
        //创建动态图链接
        var link = document.createElement('a');
        link.className = 'enlace';
        link.href = obj.link;
        card.appendChild(link);
    }


    if (obj.title || obj.subtitle)
        card.appendChild(pie);

    if (obj.title) {
        var titulo = document.createElement('div');
        titulo.className = 'titulo';
        titulo.textContent = obj.title;
        pie.appendChild(titulo);
    }

    if (obj.subtitle) {
        var curbloq = document.createElement('div');
        curbloq.className = 'subtitulo';
        curbloq.textContent = obj.subtitle;
        pie.appendChild(curbloq);
    }

    //设置动画
    card.style.webkitAnimationDelay = Math.ceil(4 + Math.random() * 4) + 's';
    requestAnimFrame(function () {
        cont.appendChild(card);
    });
    return card;
};

LiveCards.prototype.genCard = function (obj) {
    if (!obj.text && !obj.title && !obj.subtitle)
        return false;

    var cont = this.cont,
        card = document.createElement('div'),
        conten = document.createElement('div');
    card.className = 'fullblock card';
    conten.className = 'conten';

    if (obj.link) {
        var link = document.createElement('a');
        link.className = 'enlace';
        link.href = obj.link;
        card.appendChild(link);
    }

    if (obj.img) {
        curbloq = new Image();
        curbloq.className = 'figura';
        curbloq.src = obj.img;
        card.appendChild(curbloq);
    }

    if (obj.title) {
        curbloq = document.createElement('div');
        curbloq.className = 'titulo';
        curbloq.textContent = obj.title;
        conten.appendChild(curbloq);
    }

    if (obj.subtitle) {
        curbloq = document.createElement('div');
        curbloq.className = 'subtitulo';
        curbloq.textContent = obj.subtitle;
        conten.appendChild(curbloq);
    }

    if (obj.text) {
        var curbloq = document.createElement('div');
        curbloq.className = 'texto';

        if (typeof obj.text == 'string')
            obj.text = [obj.text];

        curbloq.innerText = obj.text.join('\n');
        conten.appendChild(curbloq);
    }

    requestAnimFrame(function () {
        card.appendChild(conten);
        card.style.webkitAnimationDelay = Math.ceil(4 + Math.random() * 4) + 's';
        cont.appendChild(card);
    });
    return card;
};

LiveCards.prototype.genHolder = function () {
    var cont = this.cont,
        card = document.createElement('div'),
        conten = document.createElement('div');
    card.className = 'fullblock card';
    conten.className = 'conten';

    requestAnimFrame(function () {
        card.appendChild(conten);
        cont.appendChild(card);
    });
    return conten;
};