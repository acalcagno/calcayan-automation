exports.registerCustomHelpers = function(hbs) {

    hbs.registerHelper('json',  function( context ){
        return JSON.stringify(context);
    });

    hbs.registerHelper('ifIn',  function( value, array, options ){
        array = ( array instanceof Array ) ? array : [array];
        return (array.indexOf(value) > -1) ? options.fn( this ) : "";
    });

    hbs.registerHelper('ifManual',  function(value, options){
        return (value.control == "manual") ? options.fn( this ) : options.inverse(this);
    });

    hbs.registerHelper('ifAbierto',  function(dispo, options){
        return (dispo.accion == "abrir")? options.fn( this ) : options.inverse(this);
    });

    hbs.registerHelper('ifCerrado',  function(dispo, options){
        return (dispo.accion == "cerrar")? options.fn( this ) : options.inverse(this);
    });

    hbs.registerHelper('ifEncendido',  function(dispo, options){
        return (dispo.accion == "encender")? options.fn( this ) : options.inverse(this);
    });

    hbs.registerHelper('ifApagado',  function(dispo, options){
        return (dispo.accion == "apagar")? options.fn( this ) : options.inverse(this);
    });

    hbs.registerHelper('cueRender', function(dispo) {
       return dispo.replace('electrovalvula_frio_fermentador_', "Fermentador ").replace('bomba_', 'Bomba del ').replace("cerrar","cerrado").replace("abrir","abierto").replace("encender", "encendido").replace("apagar", "apagado");
    });

    hbs.registerHelper('ifThird',  function(index, options){
        if ((index+1) % 3 == 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });


}
    /*json: function(context){
        return JSON.stringify(context);
    },
    ifIn: function( value, array, options ){
        // fallback...
        array = ( array instanceof Array ) ? array : [array];
        return (array.indexOf(value) > -1) ? options.fn( this ) : "";
    },
    ifManual: function(value, options){
        return (value.control == "manual") ? options.fn( this ) : options.inverse(this);
    },
    ifEsElectrovalvula: function(value, options) {
        return (value.substring(0,14) == "electrovalvula")? options.fn( this ) : options.inverse(this);
    },
    fermentadorCorrespondiente: function(value) {
        return fermentadorFrom(value);
    },
    fermentador: function(value, dispositivos) {
        return dispositivos.filter(function(each) {
            return each.dispositivo == fermentadorFrom(value);
        })[0].temperatura;
    },
    ifAbierto: function(dispo, options) {
        return (dispo.accion == "abrir")? options.fn( this ) : options.inverse(this);
    },
    ifCerrado: function(dispo, options) {
        return (dispo.accion == "cerrar")? options.fn( this ) : options.inverse(this);
    },
    ifEncendido: function(dispo, options) {
        return (dispo.accion == "encender")? options.fn( this ) : options.inverse(this);
    },
    ifApagado: function(dispo, options) {
        return (dispo.accion == "apagar")? options.fn( this ) : options.inverse(this);
    },
    ifThird: function (index, options) {
        if ((index+1) % 3 == 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
}

fermentadorFrom = function(value) {
    return "fermentador" + value.substring(value.length -1 , value.length );
}*/