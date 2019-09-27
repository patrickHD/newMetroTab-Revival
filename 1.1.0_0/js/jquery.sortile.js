/* HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 * No tan ligeras modificaciones por frabarz.
 */
(function ($) {
    var dragging;
    $.fn.sortable = function (options) {
        options = $.extend({
            objetivo: '.bloque',
            connectWith: false,
            selector: '.tile'
        }, options);

        return this.each(function () {
            var cont = $(this);

            var index, items, ancho,
                placeholder = $('<div />');

            cont.on({
                'dragstart.h5s': function (e) {
                    var dt = e.originalEvent.dataTransfer;
                    dt.effectAllowed = 'move';
                    dt.setData('Text', 'dummy');
                    items = cont.find(options.selector);
                    placeholder[0].dataset.alto = this.dataset.alto;
                    placeholder[0].dataset.ancho = this.dataset.ancho;
                    ancho = this.dataset.ancho == 4;
                    placeholder[0].className = this.className + ' sortable-placeholder';
                    dragging = $(this).addClass('sortable-dragging');
                    index = dragging.index();
                    requestAnimFrame(function () {
                        // Generar bloques vacíos nuevos
                        cont[0].classList.add('arrastrando');
                        $('.bloque').after('<div class="prebloque"><div class="tile dummy-placeholder"></div></div>')
                            .eq(0).before('<div class="prebloque"><div class="tile dummy-placeholder"></div></div>');
                    });
                },
//For the drop event to fire at all, you have to cancel the defaults of both the dragover and the dragenter event.
                'dragenter.h5s': function (e) {
                    e.preventDefault();
                    e.originalEvent.dataTransfer.dropEffect = 'move';
                    if (items.is(this) || this.classList.contains('dummy-placeholder')) {
                        dragging.hide();
                        var $this = $(this),
                            desde = (placeholder.index() < $this.index());
                        if (ancho && (this.dataset.medio == 'izq') && desde) {
                            $this.next().after(placeholder);
                        } else if (ancho && (this.dataset.medio == 'der') && !desde) {
                            $this.prev().before(placeholder);
                        } else {
                            $this[desde ? 'after' : 'before'](placeholder);
                        }
                    }
                    document.dispatchEvent(new CustomEvent('comprimir'));
                    return false;
                },
                'dragover.h5s': function (e) {
                    e.preventDefault();
                    return false;
                },
                'drop.h5s': function (e) {
                    e.stopPropagation();
                    placeholder.after(dragging);
                    return false;
                },
                'dragend.h5s': function (e) {
                    e.stopPropagation();

                    $('.dummy-placeholder').remove();

                    dragging.removeClass('sortable-dragging').show();
                    placeholder.detach();

                    dragging = null;

                    $('.prebloque:empty, .bloque:empty').remove();
                    $('.prebloque').addClass('bloque').removeClass('prebloque').attr('id', MT.utiles.genID);
                    cont[0].classList.remove('arrastrando');

                    cont.trigger('sortupdate', {item: dragging});

                    document.dispatchEvent(new CustomEvent('comprimir'));
                }
            }, options.selector);
        });
    };
})(jQuery);
