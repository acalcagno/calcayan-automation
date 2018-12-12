function tableRowFrom(model, row_template, attr_to_controls_map) {
    row = row_template.clone()
    row.removeClass('row-template')
    row.show()

    _.each(model, function (attr_value, attr_name) {
        var tds = _.filter(row.find('td'), function (td) {
            return td.innerHTML.includes('{{' + attr_name + '}}')
        })

        _.each(tds, function (td) {
            //chekcboxes
            var $cb = $(td).find('[type="checkbox"][cb_checked="{{' + attr_name + '}}"]')

            if ($cb.length > 0) {
                $cb.attr('checked', attr_value == 'checked')
                $cb.removeAttr('cb_checked')
            }

            //controls
            _.each(attr_to_controls_map, controlled_attr => {
                var map_item = _.find(controlled_attr.map, val => val.attr_value == attr_value)
                if(map_item) {
                    var control = $('[discriminator="' + map_item.control_discriminator + '"]')
                    td.innerHTML = td.innerHTML.replace('{{' + controlled_attr.attr_name + '}}', '')
                    var new_control_instance = control.first().clone()
                    new_control_instance.attr('model_id', model._id)
                    $(td).append(new_control_instance)
                }
            })
            //plain text
            td.innerHTML = td.innerHTML.replace('{{' + attr_name + '}}', attr_value)
        })
    })

    return row
}

var insert_empty_row = function (body) {
    var cant_columnas = body.siblings('thead').find('th').length
    var td = $('<td>')
        .attr('colspan', cant_columnas)
        .text('Tabla sin registros')
    var tr = $('<tr>').append(td)
    body.append(tr)
}

/* Esta funcion recibe
* id: el selector de jquery para obtener la tabla del html (e.g. #tablaPersonas)
* registros: un array de objetos del modelo que se quieren cargar en la grilla (e.g. [ { nombre: 'juan', apellido: 'perez'},
*                                                                                      { nombre: 'pedro', apellido: 'mendez'}])
*
* la tabla html (cuyo id, es recibido por parametro) debe ser declarada en el .html con
* especificando un template de row (señalado con class="row-template"), y luego
* entre dobles llaves {{ }}, se especifican los atributos del modelo a ser mostrados (e. g. {{nombre}})
* como en el siguiente ejemplo
* <table ="nombre_tabla">
*  <thead>
*      <th>Nombre de la persona</th>
*      <th>Apellido de la persona</th>
*  </thead>
*  <tbody>
*      <tr class="row-template" style="display:none">
*          <td> {{nombre}} </td>
*          <td> {{apellido}} </td>
*      </tr>
*  </tbody>
* </table> */
function GrillaFrom(id, registros, attr_to_controls_map) {
    var body = $(id + ' > tbody')

    var row_template = body.find('.row-template')

    //borro los registros
    body.empty()
    //pero salvaguardo el template
    body.append(row_template)

    if (!registros || registros.length < 1) {
        insert_empty_row(body)
        return
    } else {
        _.each(registros, function (each) {
            body.append(tableRowFrom(each, row_template, attr_to_controls_map))
        })
    }

    $(id).append(body)
}