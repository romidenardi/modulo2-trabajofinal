
const reservas = [];
window.reservas = reservas;

const inputSala = document.getElementById("inputSala");
const inputFecha = document.getElementById("inputFecha");
const inputHoraInicio = document.getElementById("inputHoraInicio");
const inputHoraFin = document.getElementById("inputHoraFin");
const inputTema = document.getElementById("inputTema");
const inputUsuario = document.getElementById("inputUsuario");
const boton = document.getElementById("btnCrearReserva");
const lista = document.getElementById("listaReservas");

function render() {

    lista.innerHTML = "";

    reservas.forEach((reserva) => {

        const elementoLista = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = `${reserva.sala} | 
                            ${reserva.fecha} | 
                            ${reserva.horaInicio} - ${reserva.horaFin} | 
                            ${reserva.tema} | 
                            ${reserva.usuario}`;

        const btnEditarReserva = document.createElement("button");
        btnEditarReserva.textContent = "Editar";

        btnEditarReserva.addEventListener("click", () => {
            const nuevoTema = prompt("Editar tema:", reserva.tema);
            if (nuevoTema && nuevoTema.trim() !== "") {
                const r = reservas.find(r => r.id === reserva.id);
                r.tema = nuevoTema.trim();
                render();
                }
            });

        const btnEliminarReserva = document.createElement("button");
        btnEliminarReserva.textContent = "Eliminar";

        const btnDeshacerEliminacion = document.createElement("button");
        btnDeshacerEliminacion.textContent = "Deshacer";
        btnDeshacerEliminacion.style.display = "none";

        let textoActual;
        let timeoutEliminarReserva;

        btnEliminarReserva.addEventListener("click", () => {
            textoActual = span.textContent;
            span.textContent = "Eliminando...";
            btnDeshacerEliminacion.style.display = "inline";
            timeoutEliminarReserva = setTimeout(() => {
                const i = reservas.findIndex(r => r.id === reserva.id);
                reservas.splice(i, 1);
                render();
            }, 5000);
        });

        btnDeshacerEliminacion.addEventListener("click", () => {
            clearTimeout(timeoutEliminarReserva);
            span.textContent = textoActual;
            btnDeshacerEliminacion.style.display = "none";
        });

        elementoLista.appendChild(span);
        elementoLista.appendChild(btnEditarReserva);
        elementoLista.appendChild(btnEliminarReserva);
        elementoLista.appendChild(btnDeshacerEliminacion);

        lista.appendChild(elementoLista);

    });

}

function crearReserva() {

    const sala = inputSala.value;
    const fecha = inputFecha.value;
    const horaInicio = inputHoraInicio.value;
    const horaFin = inputHoraFin.value;
    const tema = inputTema.value;
    const usuario = inputUsuario.value;

    if (!sala || !fecha || !horaInicio || !horaFin || !tema || !usuario) {
        alert("Por favor completá todos los campos");
        return;
    }

    const reserva = {
        id: Date.now(),
        sala,
        fecha,
        horaInicio,
        horaFin,
        tema,
        usuario
    };

    reservas.push(reserva);

    render();

    inputSala.value = "";
    inputFecha.value = "";
    inputHoraInicio.value = "";
    inputHoraFin.value = "";
    inputTema.value = "";
    inputUsuario.value = "";

    inputSala.focus();
   
}
boton.addEventListener("click", crearReserva);
