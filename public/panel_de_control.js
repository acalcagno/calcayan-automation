$(document).ready(function(){

    //para lanzar excepion en caso de error interno del servidor
    //       deberia llamarse siempre que se use fetch
    var handleErrors = function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }


    //cuando hacen click en "encender/apagar" o "manual/automatico" (osea click en componentes class="control")
    var acciono_control = function(event) {
        var req = {
            model_id: event.currentTarget.attributes.model_id.value,
        }

        if (event.currentTarget.attributes.accion) {
            req.accion= parseInt(event.currentTarget.attributes.accion.value)
        }
        if (event.currentTarget.attributes.control) {
            req.control = event.currentTarget.attributes.control.value
        }

        fetch('control', {  method: 'POST',
                            body: JSON.stringify(req),
                            headers: {"Content-Type": "application/json"}
                         }
        )
        .then(handleErrors)
        .catch(e => alert(e))
    }

    //ningun dispositivo cuando esta en "auto" se deberia poder prender/apagar
    var deshabilitar_acciones_auto = function() {
        //TODO
    }

    var format_temp_text = function(temp) {
        return temp + ' ºC'
    }

    var format_config_text =  function(ideal, tolerancia) {
        return ideal + " ºC +/- " + tolerancia + ' ºC'
    }

    var render_accion = function(dispositivo, boton_name) {
        if(dispositivo.accion != parseInt(localStorage.getItem(dispositivo.dispositivo +'_accion'))) {
            localStorage.setItem(dispositivo.dispositivo + '_accion', dispositivo.accion)
            var $boton = $(boton_name)
            $boton.attr('accion', dispositivo.accion ? 0: 1)
            if (dispositivo.accion != 1) {
                $boton.text('Encender')
                $boton.removeClass('btn-secondary')
                $boton.addClass('btn-primary')
            } else {
                $boton.text('Apagar')
                $boton.removeClass('btn-primary')
                $boton.addClass('btn-secondary')
            }
        }
    }

    var render_temp = function(dispositivo, div_nombre) {
        var new_temp_text = format_temp_text(dispositivo.temperatura)
        if(new_temp_text != localStorage.getItem(dispositivo.dispositivo +'_temp')) {
            localStorage.setItem(dispositivo.dispositivo + '_temp', new_temp_text)
            var $div = $(div_nombre)
            $div.text(new_temp_text)
        }
    }

    var render_config = function(dispositivo, div_nombre) {
        var new_cfg_text = format_config_text(dispositivo.temp_ideal, dispositivo.tolerancia)
        if(new_cfg_text != localStorage.getItem(dispositivo.dispositivo +'_config')) {
            localStorage.setItem(dispositivo.dispositivo + '_config', new_cfg_text)
            var $div = $(div_nombre)
            $div.text(new_cfg_text)
        }
    }

    var render_cb_auto = function(dispositivo, cb_nombre) {
        if(dispositivo.control !=  localStorage.getItem(dispositivo.dispositivo +'_control')) {
            localStorage.setItem(dispositivo.dispositivo + '_control', dispositivo.control)
        } else {
            var new_value = dispositivo.control == 'manual' ? 'automatico': 'manual'
            var $cb = $(cb_nombre)
            $cb.attr('control', new_value)
            if (dispositivo.control != 'manual') {
                $cb.find('[type="checkbox"]').prop('checked',true)
            } else {
                $cb.find('[type="checkbox"]').prop('checked',false)
            }
        }
    }


    var render_fermentador = function(fermentador, dispositivos) {
        var ev1 = _.find(dispositivos, d => d.dispositivo == 'electrovalvula_frio_'+ fermentador)
        var f1 = _.find(dispositivos, d => d.dispositivo == fermentador.replace('_',''))
        render_accion(ev1, '#btn_' + fermentador)
        render_temp(f1, '#div_temp_' + fermentador)
        render_config(f1, '#div_cfg_' + fermentador)
        render_cb_auto(ev1, '#cb_' + fermentador)
    }

    //se ejecuta periodicamente, actualizando los valores de cada dispositivo
    var render_controls = function(dispositivos) {
        ///chiller
        var chiller = _.find(dispositivos, d => d.dispositivo == 'chiller')
        render_accion(chiller, '#btn_chiller')
        render_temp(chiller, '#div_temp_chiller')
        render_config(chiller, '#div_cfg_chiller')
        render_cb_auto(chiller, '#cb_chiller')

        ///bomba
        var bomba = _.find(dispositivos, d => d.dispositivo == 'bomba_chiller')
        render_accion(bomba, '#btn_bomba')
        render_cb_auto(bomba, '#cb_bomba')

        render_fermentador('fermentador_1', dispositivos)
        render_fermentador('fermentador_2', dispositivos)
    }

    //traer el estado de los dispositivos del backend
    var fetch_dispositivos = function(cb) {
        fetch('dispositivos')
            .then(handleErrors)
            .then(function(response) {
                return response.json();
            })
            .then(function(dispositivos) {
                cb(dispositivos)
            })
    }

    //configura los compoenntes, solo sucede una vez al cargar el dom.
    var init_components = function(dispositivos) {
        localStorage.clear()
        var chiller_id = _.find(dispositivos, d => d.dispositivo == 'chiller')._id
        $('#btn_chiller').attr('model_id', chiller_id)
        $('#cb_chiller').attr('model_id', chiller_id)

        var bomba_id = _.find(dispositivos, d => d.dispositivo == "bomba_chiller")._id
        $('#btn_bomba').attr('model_id', bomba_id)
        $('#cb_bomba').attr('model_id', bomba_id)

        var ev1_id = _.find(dispositivos, d => d.dispositivo == "electrovalvula_frio_fermentador_1")._id
        $('#btn_fermentador_1').attr('model_id', ev1_id)
        $('#cb_fermentador_1').attr('model_id', ev1_id)

        var ev2_id = _.find(dispositivos, d => d.dispositivo == "electrovalvula_frio_fermentador_2")._id
        $('#btn_fermentador_2').attr('model_id', ev2_id)
        $('#cb_fermentador_2').attr('model_id', ev2_id)

        $(".control").click(acciono_control)
        render_controls(dispositivos)
    }

    var init = function() {
        fetch_dispositivos(init_components)
    }


    //pedir periodicamente al backend el estado de los dispositivos
    //y mostrarlo en pantalla
    var loop = function() {
        fetch_dispositivos(function(dispositivos) {
            render_controls(dispositivos)
            setTimeout(loop, 500)
        })
    }

    init()
    loop()

})