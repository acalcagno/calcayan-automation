$('.acciona_backend').on('click', function(e) {
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
            console.log('success');
            console.log(JSON.stringify(data));
        }
    });
});