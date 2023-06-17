document.addEventListener("DOMContentLoaded", function () {

    // Variables
    let vehiculos = [];
    let accionBoton = 'alta';
    let vehiculoSeleccionado;
    let formularioAbm = document.getElementById("formularioAbm");
    let titulo = document.getElementById("tituloFormLista");
    let botonAgregar = document.getElementById("btnAgregar");
    let botonEliminar = document.getElementById("btnEliminar");
    formularioAbm.style.display = "none";
    titulo.style.display = "none";
    botonAgregar.style.display = "none";
    let spinner = document.getElementById("spinner");
    spinner.style.display = "none";

    let crearListavehiculos = function () {
        let Listavehiculos = [];
        spinner.style.display = "block";
        return fetch('http://localhost/vehiculoAereoTerrestre.php')
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                for (let i = 0; i < json.length; i++) {
                    if ('cantPue' in json[i]) {
                        let terrestre = new Terrestre(
                            json[i].id,
                            json[i].modelo,
                            json[i].anoFab,
                            json[i].velMax,
                            json[i].cantPue,
                            json[i].cantRue
                        );
                        Listavehiculos.push(terrestre);
                    } else {
                        let aereo = new Aereo(
                            json[i].id,
                            json[i].modelo,
                            json[i].anoFab,
                            json[i].velMax,
                            json[i].altMax,
                            json[i].autonomia
                        );
                        Listavehiculos.push(aereo);
                    }
                }
                console.log(Listavehiculos);
                spinner.style.display = "none";
                return Listavehiculos;
            })
            .catch(function (error) {
                console.log(error);
                return Listavehiculos;
            });

    };

    let crearTablaVehiculos = function (lista) {
        let fila;
        let stringTable = "<tr><th>Id</th><th>Modelo</th><th>AñoFabricacion</th><th>VelMax</th><th>AltMax</th><th>Autonomia</th><th>CantRue</th><th>CantPue</th><th colspan='2'>Acciones</th></tr>";

        for (let elem of lista) {
            fila = "<tr id='" + elem.getId() + "'>";
            if (elem instanceof Aereo) {
                fila += "<td>" + elem.getId() + "</td>";
                fila += "<td>" + elem.getModelo() + "</td>";
                fila += "<td>" + elem.getAnoFab() + "</td>";
                fila += "<td>" + elem.getVelMax() + "</td>";
                fila += "<td>" + elem.getAltMax() + "</td>";
                fila += "<td>" + elem.getAutonomia() + "</td>";
                fila += "<td></td>";
                fila += "<td></td>";
            }

            if (elem instanceof Terrestre) {
                fila += "<td>" + elem.getId() + "</td>";
                fila += "<td>" + elem.getModelo() + "</td>";
                fila += "<td>" + elem.getAnoFab() + "</td>";
                fila += "<td>" + elem.getVelMax() + "</td>";
                fila += "<td></td>";
                fila += "<td></td>";
                fila += "<td>" + elem.getCantRue() + "</td>";
                fila += "<td>" + elem.getCantPue() + "</td>";
            }

            //fila += "<td><input type='button' value='Modificar'></td>";
            fila += "<td><input type='button' value='Eliminar'></td>";
            fila += "</tr>";
            stringTable += fila;
        }

        return stringTable;
    };

    let mostrarFormLista = function () {
        formularioAbm.style.display = "none";
        let tablaVehiculos = document.getElementById("tablaVehiculos");
        if (tablaVehiculos) {
            tablaVehiculos.innerHTML = crearTablaVehiculos(vehiculos);
            abrirFila();
        }
        titulo.style.display = "block";
        botonAgregar.style.display = "block";
        //botonEliminar.style.display = "block";
        formularioAbm.style.display = "none";
    }

    crearListavehiculos()
        .then(function (data) {
            vehiculos = data;
            mostrarFormLista();
        });

    btnAgregar.addEventListener("click", function () {
        abrirFormularioAlta();
        limpiarFormAbm();
        btnModificar.style.display = "none";
        btnAceptar.style.display = "block";
        btnAgregar.style.display = "none";
        cambiarAccionBoton("alta");
        //  abrirFila();
        console.log("entre")
    });

    let limpiarFormAbm = function () {
        let controles = ["txtModelo", "txtAnoFab", "txtVelMax", "txtAltMax", "txtAutonomia", "txtCantPue", "txtCantRue"];

        for (let i = 0; i < controles.length; i++) {
            let control = document.getElementById(controles[i]);
            control.value = "";
        }
    }


    function cambiarAccionBoton(accion) {
        accionBoton = accion;
    }



    let abrirFormularioAlta = function () {
        let formularioAbm = document.getElementById("formularioAbm");
        let formLista = document.getElementById("formLista");
        formLista.style.display = "none";
        formularioAbm.style.display = "block";
        formLista.style.display = "none";
        elementosAereo.style.display = "none";
        elementosTerrestre.style.display = "block";
        selectTipo.style.display = "block";

        selectTipo.addEventListener("change", function () {
            let valorSeleccionado = selectTipo.value;
            switch (valorSeleccionado) {
                case "terrestre":
                    elementosAereo.style.display = "block";
                    elementosTerrestre.style.display = "none";
                    break;
                case "aereo":
                    elementosTerrestre.style.display = "block";
                    elementosAereo.style.display = "none";
                    break;
            }
        });

    }

    btnAceptar.addEventListener("click", async function () {
        btnAgregar.style.display = "block";
        if (accionBoton === 'alta') {
            await darDeAltaConXHR(vehiculos);

        } else if (accionBoton === 'baja') {
            console.log(vehiculoseleccionado);
            await darDeBaja(vehiculoseleccionado);
            formLista.style.display = "block";
        }
        //abrirFila();
    });
    let darDeAltaConXHR = function (listaVehiculos) {
        return new Promise((resolve, reject) => {
            let datos = devolverDatos();
            btnAgregar.style.display = "none";
            console.log(JSON.stringify(datos));

            spinner.style.display = "block";
            formularioAbm.style.display = "none";
            console.log(datos);

            let xhr = new XMLHttpRequest();
            xhr.open('PUT', 'http://localhost/vehiculoAereoTerrestre.php');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        let data = JSON.parse(xhr.responseText);

                        if (datos.cantPue) {
                            let nuevoTerrestre = new Terrestre(data.id, datos.modelo, datos.anoFab, datos.velMax, datos.cantPue, datos.cantRue);
                            listaVehiculos.push(nuevoTerrestre);
                            console.log(nuevoTerrestre);
                        } else {
                            nuevoAereo = new Aereo(data.id, datos.modelo, datos.anoFab, datos.velMax, datos.altMax, datos.autonomia);
                            listaVehiculos.push(nuevoAereo);
                        }

                        console.log("IMPORTADO CORRECTAMENTE");
                        formLista.style.display = "block";
                        formularioAbm.style.display = "none";
                        btnAgregar.style.display = "block";


                        spinner.style.display = "none";
                        resolve(listaVehiculos);
                        document.getElementById("tablaVehiculos").innerHTML = crearListavehiculos(listaVehiculos);
                    } else {
                        console.log("Error en la solicitud:", xhr.status);
                        reject("Error en la solicitud");
                    }
                }
            };

            xhr.send(JSON.stringify(datos));
        });
    };

    btnModificar.addEventListener("click",  function () {
        abrirFila();
        if (vehiculoSeleccionado !== undefined) {
            console.log("este es" +vehiculoSeleccionado)
            modificarVehiculo(vehiculoSeleccionado);
        }

    });


    let abrirFila = function() {
      let filas = document.querySelectorAll('tr');
      btnModificar.style.display = 'block';
    
      filas.forEach((fila) => {
        const idFila = fila.getAttribute('id');
        if (idFila) {
          let vehiculo = obtenerInstanciaVehiculo(idFila); 
          fila.addEventListener('click', (event) => {
            const clickedElement = event.target;
            if (
              clickedElement.tagName.toLowerCase() === 'input' &&
              clickedElement.type === 'button'
            ) {
              abrirFormularioEdicion(vehiculo);
              cambiarAccionBoton('baja');
              btnModificar.style.display = 'none';
              btnAceptar.style.display = 'block';
              document.getElementById('tablaVehiculos').innerHTML = crearTablaVehiculos(vehiculos);
              vehiculoSeleccionado = vehiculo;
            } else {
              console.log(`Clic en la fila ${idFila}: ${vehiculo.toString()}`);
              abrirFormularioEdicion(vehiculo);
              cambiarAccionBoton('alta');
              if (btnAceptar.style.display === 'block') {
                btnModificar.style.display = 'none';
              } else {
                btnModificar.style.display = 'block';
              }
              vehiculoSeleccionado = vehiculo;
            }
            return;
          });
        }
      });
    };
    
    abrirFila();
    function obtenerInstanciaVehiculo(numeroFila) {
        let vehiculo;
        for (let i = 0; i < vehiculos.length; i++) {
            if (numeroFila == vehiculos[i].getId()) vehiculo = vehiculos[i];
        }
        return vehiculo;
    }

    let abrirFormularioEdicion = function (vehiculo) {
        let formularioAbm = document.getElementById('formularioAbm');
        let formLista = document.getElementById('formLista');
        let btnAgregar = document.getElementById('btnAgregar');
        btnAgregar.style.display = 'none';

        formularioAbm.style.display = 'block';
        formLista.style.display = 'none';

        let modelo = document.getElementById("txtModelo").value;
        let anoFab = document.getElementById("txtAnoFab").value;
        let velMax = document.getElementById("txtVelMax").value;
        let altMax = document.getElementById("txtAltMax").value;
        let autonomia = document.getElementById("txtAutonomia").value;
        let cantPue = document.getElementById("txtCantPue").value;
        let cantRue = document.getElementById("txtCantRue").value;


        let labelTipo = document.getElementById('lblTipo');
        let selectTipo = document.getElementById('selectTipo');

        labelTipo.style.display = 'none';
        selectTipo.style.display = 'none';

        if (vehiculo instanceof Aereo) {
            document.getElementById('txtModelo').value = vehiculo.getModelo();
            document.getElementById('txtAnoFab').value = vehiculo.getAnoFab();
            document.getElementById('txtVelMax').value = vehiculo.getVelMax();
            document.getElementById('txtAltMax').value = vehiculo.getAltMax();
            document.getElementById('txtAutonomia').value = vehiculo.getAutonomia();

            elementosAereo.style.display = 'block';
            elementosTerrestre.style.display = 'none';
        } else if (vehiculo instanceof Terrestre) {
            document.getElementById('txtModelo').value = vehiculo.getModelo();
            document.getElementById('txtAnoFab').value = vehiculo.getAnoFab();
            document.getElementById('txtVelMax').value = vehiculo.getVelMax();
            document.getElementById('txtCantPue').value = vehiculo.getCantPue();
            document.getElementById('txtCantRue').value = vehiculo.getCantRue();
            elementosAereo.style.display = 'none';
            elementosTerrestre.style.display = 'block';
        } else {

            elementosAereo.style.display = 'none';
            elementosTerrestre.style.display = 'none';
        }
    };



    let devolverDatos = function () {
        let modelo = document.getElementById("txtModelo").value;
        let anoFab = document.getElementById("txtAnoFab").value;
        let velMax = document.getElementById("txtVelMax").value;
        let altMax = document.getElementById("txtAltMax").value;
        let autonomia = document.getElementById("txtAutonomia").value;
        let cantPue = document.getElementById("txtCantPue").value;
        let cantRue = document.getElementById("txtCantRue").value;
        let datos = {};

        if (modelo.trim() !== "" && anoFab.trim() !== "" && velMax.trim() !== "") {
            if (!isNaN(parseInt(velMax))) {
                console.log("Datos correctos");

                if (altMax.trim() !== "" && autonomia.trim() !== "") {
                    if (!isNaN(parseInt(altMax)) && !isNaN(parseInt(autonomia))) {
                        datos.modelo = modelo;
                        datos.anoFab = anoFab;
                        datos.velMax = parseInt(velMax);
                        datos.altMax = parseInt(altMax);
                        datos.autonomia = parseInt(autonomia);
                    } else {
                        alert("Error: Valide los datos del vehículo aéreo.");
                    }
                } else if (cantPue.trim() !== "" && cantRue.trim() !== "") {
                    if (!isNaN(parseInt(cantPue)) && !isNaN(parseInt(cantRue))) {
                        datos.modelo = modelo;
                        datos.anoFab = anoFab;
                        datos.velMax = parseInt(velMax);
                        datos.cantPue = parseInt(cantPue);
                        datos.cantRue = parseInt(cantRue);
                    } else {
                        alert("Error: Valide los datos del vehículo terrestre.");
                    }
                } else {
                    alert("Error: Debe ingresar los datos correspondientes al vehículo aéreo o terrestre.");
                }
            } else {
                alert("Error: Valide los datos del vehículo.");
            }
        } else {
            alert("Error: Debe ingresar los datos correspondientes al vehículo.");
        }

        return datos;
    };


    let modificarVehiculo = async function (vechiculoModificar) {
        const endPoint = "http://localhost/vehiculoAereoTerrestre.php";
      
        const modelo = document.getElementById("txtModelo").value;
        const anoFab = document.getElementById("txtAnoFab").value;
        const velMax = document.getElementById("txtVelMax").value;
        const altMax = document.getElementById("txtAltMax").value;
        const autonomia = document.getElementById("txtAutonomia").value;
      
        const cantPue = document.getElementById("txtCantPue").value;
        const cantRue = document.getElementById("txtCantRue").value;
      
        const spinner = document.getElementById("spinner");
        const formLista = document.getElementById("formLista");
        const formularioAbm = document.getElementById("formularioAbm");
        const btnAgregar = document.getElementById("btnAgregar");
      
        spinner.style.display = "block";
        formLista.style.display = "none";
        formularioAbm.style.display = "none";
        btnAgregar.style.display = "none";
      
        try {
          let datosActualizados = {};
      
          if (anoFab !== vechiculoModificar.getAnoFab()) {
            datosActualizados.anoFab = anoFab;
            vechiculoModificar.setAnoFab(datosActualizados.anoFab);
          }
      
          if (modelo !== vechiculoModificar.getModelo()) {
            datosActualizados.modelo = modelo;
            vechiculoModificar.setModelo(datosActualizados.modelo);
          }
      
          if (velMax !== vechiculoModificar.getVelMax()) {
            datosActualizados.velMax = velMax;
            vechiculoModificar.setVelMax(datosActualizados.velMax);
          }
      
          if (vechiculoModificar instanceof Aereo) {
            if (altMax !== vechiculoModificar.getAltMax()) {
              datosActualizados.altMax = altMax;
              vechiculoModificar.setAltMax(datosActualizados.altMax);
            }
            if (autonomia !== vechiculoModificar.getAutonomia()) {
              datosActualizados.autonomia = autonomia;
              vechiculoModificar.setAutonomia(datosActualizados.autonomia);
            }
          } else if (vechiculoModificar instanceof Terrestre) {
            if (cantPue !== vechiculoModificar.getCantPue()) {
              datosActualizados.cantPue = cantPue;
              vechiculoModificar.setCantPue(datosActualizados.cantPue);
            }
            if (cantRue !== vechiculoModificar.getCantRue()) {
              datosActualizados.cantRue = cantRue;
              vechiculoModificar.setCantRue(datosActualizados.cantRue);
            }
          }
          datosActualizados.modelo = modelo; 
      
          console.log(datosActualizados);
      
          const respuesta = await fetch(endPoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosActualizados),
          });
      
        } catch (error) {
          console.log("Error en la solicitud:", error);
        }
      
        spinner.style.display = "none";
        formLista.style.display = "block";
        formularioAbm.style.display = "none";
        btnAgregar.style.display = "block";
      };
      

    let darDeBaja = async function (vehiculo) {
        const id = vehiculo.getId();
        const endPoint = "http://localhost/vehiculoAereoTerrestre.php";

        try {
            const respuesta = await fetch(endPoint, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (respuesta.status === 200) {
                console.log("Se eliminó correctamente");
                eliminarVehiculo(vehiculo);
                document.getElementById("tablaVehiculos").innerHTML = crearListaVehiculos(vehiculos);
            } else {
                console.log("Ocurrió un error al eliminar");
            }
        } catch (error) {
            console.log("Error en la solicitud:", error);
        }

        spinner.style.display = "none";
        formLista.style.display = "block";
        formularioAbm.style.display = "none";
        btnAgregar.style.display = "block";
    };

    function eliminarVehiculo(vehiculo) {
        const index = vehiculos.findIndex((v) => v.getId() === vehiculo.getId());
        if (index !== -1) {
            vehiculos.splice(index, 1);
            console.log("Vehículo eliminado correctamente");
        } else {
            console.log("No se encontró el vehículo en la colección");
        }
    }


});
