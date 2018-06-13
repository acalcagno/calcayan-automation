var tarjeta_click = function(e) {
    e.preventDefault();
    console.log('select_link clicked');
    var btn = e.target.attributes;


    var data = {dispositivo: btn.dispositivo.value, accion:btn.accion.value };

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://localhost:5000/control',
        success: function(data) {
            var dom = $(data);
            var main_div_name = dom[0].id;
            dom.find(".acciona_backend").on('click', tarjeta_click);
            var new_ui = $("#"+main_div_name).replaceWith(dom);

        }
    });
}

$('.acciona_backend').on('click', tarjeta_click);