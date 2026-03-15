
const reservas = [];
window.reservas = reservas;

const form = document.getElementById("formReserva");
const lista = document.getElementById("listaReservas");

function render() {

    lista.innerHTML = "";

    reservas.sort((a, b) => {
        if (a.fecha === b.fecha) {
            return a.horaInicio.localeCompare(b.horaInicio);
        }
        return a.fecha.localeCompare(b.fecha);
    });

    reservas.forEach((reserva) => {

        const elementoLista = document.createElement("li");

        const span = document.createElement("span");

        const listaServicios = reserva.servicios.length
        ? reserva.servicios.join(", ")
        : "Ninguno";

        span.innerHTML = `<strong>${reserva.sala}</strong> | ${reserva.fecha} | ${reserva.horaInicio} - ${reserva.horaFin}<br>
                            Tema: ${reserva.tema}<br>
                            Usuario: ${reserva.usuario}<br>
                            Servicios: ${listaServicios}<br>
                            Comentarios: ${reserva.comentarios}`;
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

    const datos = new FormData(form);

    const sala = datos.get("sala");
    const fecha = datos.get("fecha");
    const horaInicio = datos.get("inicio");
    const horaFin = datos.get("fin");
    const tema = datos.get("tema");
    const usuario = datos.get("usuario");
    const servicios = datos.getAll("servicios");
    const comentarios = datos.get("comentarios") || "Sin comentarios";

    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaReserva = new Date(fecha);
    if (fechaReserva < hoy) {
        alert("La fecha de reserva debe ser igual o posterior a la fecha del día");
        return;
    }

    if (horaFin <= horaInicio) {
        alert("La hora de finalización debe ser posterior a la de inicio.");
        return;
    }

    const hayConflicto = reservas.some(r =>
        r.sala === sala &&
        r.fecha === fecha &&
        horaInicio < r.horaFin &&
        horaFin > r.horaInicio
    );

    if (hayConflicto) {
        alert(`La sala ${sala} ya tiene una reserva el ${fecha} entre ${horaInicio} y ${horaFin}.`);        
        return;
    }

    const reserva = {
        id: Date.now(),
        sala,
        fecha,
        horaInicio,
        horaFin,
        tema,
        usuario,
        servicios,
        comentarios
    };

    reservas.push(reserva);

    render();

    form.reset();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    crearReserva();
});
