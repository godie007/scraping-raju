// This file would be used in a Node.js backend environment
// It contains the original scraping logic provided in your request

exports.scrape = async (processCode, callback) => {
  const ciudad = processCode.slice(0, 5);
  const especialidad = processCode.slice(5, 9);
  const phantom = require("phantom");
  try {
    const delay = (duration) => {
      return new Promise(function (resolve, reject) {
        setTimeout(resolve, duration);
      });
    };
    const instance = await phantom.create()
    const page = await instance.createPage();
    await page.open("http://procesos.ramajudicial.gov.co/consultaprocesos/");
    await page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
    page.on("onConsoleMessage", (data) => console.log(data));
    await page.evaluate(function (ciudad) {
      $(document).ready(function () {
        //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
        var esCiudad = false;
        for (var i = 0; i < $("#ddlCiudad option").length; i++) {
          if ($("#ddlCiudad option:eq(" + i + ")").val() == ciudad) {
            esCiudad = true;
            break;
          }
        }
        if (esCiudad) {
          $("#ddlCiudad").val(ciudad).trigger("change");
          console.log("se selecciona la Ciudad de: " + $("#ddlCiudad option[value='" + ciudad + "']").text());
        } else {
          console.log("No se Encontro la Ciudad (" + ciudad + ")");
        }
      })
    }, ciudad)
    await delay(500);
    await page.evaluate(function (especialidad) {
      if ($("#ddlEntidadEspecialidad option[value*=\"" + especialidad + "\"]").length > 0) {
        $("#ddlEntidadEspecialidad").val($("#ddlEntidadEspecialidad option[value*=\"" + especialidad + "\"]").val()).trigger("change");
        console.log("Especialidad: " + $("#ddlEntidadEspecialidad option[value=\"" + $("#ddlEntidadEspecialidad option[value*=\"" + especialidad + "\"]").val() + "\"]").text());
      } else {
        console.log("No Se encontro la Especialidad (" + especialidad + ")");
      }
    }, especialidad)
    await page.evaluate(function (codigo) {
      if ($("#divNumRadicacion input[type=text]").length > 0) {
        $("#divNumRadicacion > table > tbody > tr:nth-child(2) > td > div > input").val(codigo);
        $("#divNumRadicacion > table > tbody > tr:nth-child(3) > td > input").prop("disabled", false);
        $("#divNumRadicacion > table > tbody > tr:nth-child(3) > td > input").click();
      } else {
        console.log("no se encontro el Input");
      }
    }, processCode)
    await delay(1000);
    const result = await page.evaluate(function (codigo) {
      function convertirFecha(fecha_String) {
        var salida = "";
        if (fecha_String != "") {
          salida = fecha_String.split(" ")[0] + "/";
          var meses = ["Ene", "Feb", "Mar", "Apr", "May", "Jan", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          var mese2 = ["Jan", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          for (var i = 0; i < meses.length; i++) {
            if (mese2[i].toUpperCase().indexOf(fecha_String.split(" ")[1].toUpperCase()) > -1 || meses[i].toUpperCase().indexOf(fecha_String.split(" ")[1].toUpperCase()) > -1) {
              salida += (i + 1) + "/";
              break;
            }
          }
          salida += fecha_String.split(" ")[2];
          return salida;
        } else {
          return "";
        }
      }
      var filas = $("#divActuacionesDetalle > table > tbody > tr:nth-child(2) > td > table > tbody > tr").length;
      console.log("Si se Cargo el Formulario!---------------" + filas);
      if (filas > 0) {
        var tabla = $("#divActuacionesDetalle > table > tbody > tr:nth-child(2) > td > table > tbody > tr");
        if ($("#lblJuzgadoActual").text() === "") return "{}";
        var salida = {
          JuzgadoActual: $("#lblJuzgadoActual").text().trim(),
          Ponente: $("#lblPonente").text().trim(),
          Tipo: $("#lblTipo").text().trim(),
          Clase: $("#lblClase").text().trim(),
          Recurso: $("#lblRecurso").text().trim(),
          Ubicacion: $("#lblUbicacion").text().trim(),
          NomDemandante: $("#lblNomDemandante").text().trim(),
          NomDemandado: $("#lblNomDemandado").text().trim(),
          Contenido: $("#lblContenido").text().trim(),
          Codigo: "p" + $("#divNumRadicacion input[type=text]").val().trim(),
          actuaciones: Array.prototype.map.call(tabla,
            function (tr, i) {
              return {
                date: convertirFecha($(tabla[i]).find("td:nth-child(1) > div > span").text().trim()),
                action: $(tabla[i]).find("td:nth-child(2) > div > span").text().trim(),
                annotation: $(tabla[i]).find("td:nth-child(3) > div > span").text().trim(),
                startDate: convertirFecha($(tabla[i]).find("td:nth-child(4) > div > span").text().trim()),
                endDate: convertirFecha($(tabla[i]).find("td:nth-child(5) > div > span").text().trim()),
                registerDate: convertirFecha($(tabla[i]).find("td:nth-child(6) > div > span").text().trim())
              };
            })
        };
        return salida;
      } else {
        return '';
      }
    });
    await page.close();
    callback(result);
    await instance.exit();
  } catch (error) {
    callback('');
  }
};
