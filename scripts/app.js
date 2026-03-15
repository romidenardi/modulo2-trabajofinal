
const reservas = [];
window.reservas = reservas;

const input = document.getElementById("crearReserva");
const boton = document.getElementById("btnCrearReserva");
const lista = document.getElementById("listaReservas");

function render() {

    lista.innerHTML = "";

    reservas.forEach((reserva, index) => {

        const elementoLista = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = reserva;

        const btnEditarReserva = document.createElement("button");
        btnEditarReserva.textContent = "Editar";

        btnEditarReserva.addEventListener("click", () => {
            const nuevoTexto = prompt("Editar reserva:", reserva);
            if (nuevoTexto) {
                reservas[index] = nuevoTexto.trim();
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
                reservas.splice(index, 1);
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
    const texto = input.value.trim();
    if (texto) {
        reservas.push(texto);
        render();
        input.value = "";
    }
}

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        crearReserva();
    }
});

boton.addEventListener("click", crearReserva);
