
const reservas = [];
window.reservas = reservas;

const form = document.getElementById("formReserva");
const lista = document.getElementById("listaReservas");

function render() {

    lista.innerHTML = "";

    reservas.forEach((reserva) => {

        const elementoLista = document.createElement("li");

        const span = document.createElement("span");

        const listaServicios = reserva.servicios.length
        ? reserva.servicios.join(", ")
        : "Ninguno";

        span.textContent = `${reserva.sala} | ${reserva.fecha} | ${reserva.horaInicio} - ${reserva.horaFin} | ${reserva.tema} |${reserva.usuario} | Servicios: ${listaServicios} | ${reserva.comentarios}`;
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
