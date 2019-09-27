/**
 * Created by IntelliJ IDEA.
 * https://github.com/fatlinesofcode/jquery.smoothwheel
 * User: phil
 * Date: 15/11/12
 * Time: 11:04 AM
 *
 + Dejqueryfication and horizontal scrolling modifications by frabarz.
 */

//滚轮动画
(function () {
    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    function smoothWheel(cont, options) {
        var options = options || {};
        //var options = jQuery.extend({}, arguments[0]);
        if ('ontouchstart' in window)
            return;

        //lista.each(function(cont, index) {
        var direction,
            fricton = 0.75, // higher value for slower deceleration
            running = false,
            currentX = 0,
            targetX = 0,
            oldX = 0,
            maxScrollLeft = 0,
        //onRenderCallback = null,
            vy = 0,
            stepAmt = 10,
            minMovement = 0.1,
            ts = 0.1;

        function minScrollLeft() {
            return cont.clientWidth - cont.scrollWidth;
        }

        function updateScrollTarget(amt) {
            targetX += amt;
            vy += (targetX - oldX) * stepAmt;
            oldX = targetX;
        }

        function render() {
            if (vy < -(minMovement) || vy > minMovement) {
                currentX = (currentX + vy);
                if (currentX > maxScrollLeft) {
                    currentX = vy = 0;
                } else if (currentX < minScrollLeft()) {
                    vy = 0;
                    currentX = minScrollLeft();
                }
                cont.scrollLeft = -currentX;
                vy *= fricton;
                // vy += ts * (currentX-targetX);
                // scrollLeftTweened += settings.tweenSpeed * (scrollLeft - scrollLeftTweened);
                // currentX += ts * (targetX - currentX);
                //if (onRenderCallback) {
                //  onRenderCallback();
                //}
            } else {
                running = false;
            }
        }

        function animateLoop() {
            if (!running) return;
            requestAnimFrame(animateLoop);
            render();
            //log("45","animateLoop","animateLoop", "",stop);
        }

        function onWheel(evt) {
            if (this.classList.contains('aplastado'))
                return;
            evt.preventDefault();

            var delta = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
            var dir = delta < 0 ? -1 : 1;
            if (dir != direction) {
                vy = 0;
                direction = dir;
            }

            //reset currentX in case non-wheel scroll has occurred (scrollbar drag, etc.)
            currentX = -cont.scrollLeft;

            updateScrollTarget(delta);
            if (!running) {
                running = true;
                animateLoop();
            }
        }

        cont.addEventListener(mousewheel, onWheel, false);

        //set target/old/current Y to match current scroll position to prevent jump to top of container
        targetX = oldX = cont.scrollLeft;
        currentX = -targetX;
    }

    window.addEventListener(windowLoad, function () {
        var antx, //anty,
        //pivot = document.getElementById('pivot'),
            html = document.body.parentNode,
            horscroll = document.querySelectorAll('.horscroll');

        [].forEach.call(horscroll, function (pivot) {
            if (localStorage.getItem('apar_parallaxbg') == 'true') {
                pivot.addEventListener('scroll', function (evt) {
                    if (this.classList.contains('aplastado'))
                        return;
                    html.style.backgroundPositionX = (this.scrollLeft / -1.5) + 'px';
                }, false);
            }

            if (localStorage.getItem('opcional_touchsupport') == 'true') {
                pivot.addEventListener('touchstart', function (evt) {
                    if (this.style.display == 'none') return;
                    antx = evt.changedTouches[0].screenX;
                    //anty = evt.changedTouches[0].clientY;
                }, false);
                pivot.addEventListener('touchmove', function (evt) {
                    if (this.style.display == 'none') return;
                    //console.log('touchmove', evt.changedTouches[0].screenX);
                    pivot.scrollLeft -= (evt.changedTouches[0].screenX - antx);
                    antx = evt.changedTouches[0].screenX;
                    //anty = evt.changedTouches[0].clientY;
                }, false);
                //pivot.addEventListener('touchend', function(evt) {}, false);
            }

            document.addEventListener('keydown', function (evt) {
                if (pivot.classList.contains('aplastado') || MT.status && (MT.status.lateral || MT.status.marcadores))
                    return;
                //console.log(evt.keyIdentifier, evt.ctrlKey, evt.shiftKey, evt.keyCode);
                switch (evt.keyCode) {
                    case 33:  //Re Pag
                        pivot.scrollLeft -= (pivot.offsetWidth * 2 / 3);
                        break;
                    case 34:  //Av Pag
                        pivot.scrollLeft += (pivot.offsetWidth * 2 / 3);
                        break;
                    case 35:  //Fin
                        pivot.scrollLeft = pivot.scrollWidth;
                        break;
                    case 36:  //Inicio
                        pivot.scrollLeft = 0;
                        break;
                    case 37:  //Izquierda
                    case 38:  //Arriba
                        pivot.scrollLeft -= 120;
                        break;
                    case 39:  //Derecha
                    case 40:  //Abajo
                        pivot.scrollLeft += 120;
                        break;
                }
            }, false);

            if (localStorage.getItem('apar_smoothscroll') == 'true') {
                smoothWheel(pivot);
            } else {
                pivot.addEventListener(mousewheel, function normalWheel(evt) {
                    if (this.style.display == 'none') return;
                    evt.stopPropagation();
                    var data;
                    if (evt.wheelDelta) {
                        data = evt.wheelDelta / 1.5;
                        this.scrollLeft -= data;
                    } else {
                        data = evt.detail * 80;
                        this.scrollLeft += data;
                    }
                }, false);
            }
        });

        document.addEventListener('keydown', function (evt) {
            if (MT.status && (MT.status.lateral || MT.status.marcadores))
                return;
            switch (evt.keyCode) {
                case 46: //Supr
                    evt.stopPropagation();
                    var i, tiles = document.querySelectorAll('.tile.seleccionado');
                    for (i = 0; i < tiles.length; i++)
                        MT.modelBase[tiles[i].id].eliminar();
                    document.dispatchEvent(new CustomEvent('desactContextual'));
                    break;
                case 65:
                    evt.stopPropagation();
                    var i, itm,
                        t = [].slice.call(document.querySelectorAll('a.tile'), 0),
                        ult = t.pop();
                    if (evt.ctrlKey && ult) {
                        for (i = 0; itm = t[i]; i++)
                            itm.classList.toggle('seleccionado');
                        var e = document.createEvent('MouseEvents');
                        e.initMouseEvent('contextmenu', true, true, window, 2, 100, 200, 100, 200, false, false, false, false, 2, null);
                        ult.dispatchEvent(e);
                        t = ult = itm = null;
                    }
                    break;
            }
        }, true);

    }, false);

})();