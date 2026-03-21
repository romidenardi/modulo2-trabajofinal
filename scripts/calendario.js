import Reserva from "./reserva.js";

export default class Calendario {

    constructor(elementoLista, onChange, onEdit) {
        this.lista = elementoLista;
        this.reservas = [];
        this.onChange = onChange;
        this.onEdit = onEdit;
        this.filtroSala = document.getElementById("filtroSala");
        this.filtroFecha = document.getElementById("filtroFecha");
        this.filtroSala?.addEventListener("change", () => this.render());
        this.filtroFecha?.addEventListener("change", () => this.render());
    }

    setearReservas(reservas) {
        this.reservas = reservas;
        this.render();
    } 

    eliminarReserva(id) {
        this.reservas = this.reservas.filter(r => r.id !== id);
        if (this.onChange) {
            this.onChange(this.reservas);
        }
        this.render();    
    }

    render() {

        this.lista.innerHTML = "";

        let reservasFiltradas = [...this.reservas];

        if (this.filtroSala?.value) {
            reservasFiltradas = reservasFiltradas.filter(r =>
                r.sala === this.filtroSala.value
            );
        }

        if (this.filtroFecha?.value) {
            reservasFiltradas = reservasFiltradas.filter(r =>
                r.fecha === this.filtroFecha.value
            );
        }

        if (reservasFiltradas.length === 0) {
            this.lista.innerHTML = "<li class='alerta'>No hay reservas vigentes</li>";
            return;
        }

        reservasFiltradas
            
            .sort((a, b) => a.fechaHoraInicio.localeCompare(b.fechaHoraInicio))
            .forEach(reserva => {

            const tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta-reserva";

            const listaServicios = reserva.servicios.length
            ? reserva.servicios.join(", ")
            : "Ninguno";

            tarjeta.innerHTML =
                `<div class="tarjeta-header">
                    <h3>${reserva.sala}</h3>
                    <span class="fecha">${reserva.fecha}</span>
                </div>
                <div class="tarjeta-body">
                    <p><strong>Horario:</strong> ${reserva.horaInicio} - ${reserva.horaFin}</p>
                    <p><strong>Tema:</strong> ${reserva.tema}</p>
                    <p><strong>Usuario:</strong> ${reserva.usuario}</p>
                    <p><strong>Servicios:</strong> ${listaServicios}</p>
                    <p><strong>Comentarios:</strong> ${reserva.comentarios}</p>
                </div>`;

            const acciones = document.createElement("div");
            acciones.className = "tarjeta-acciones";
           
            const btnEditarReserva = document.createElement("button");
            btnEditarReserva.textContent = "Editar";

            btnEditarReserva.addEventListener("click", () => {
                localStorage.setItem("reservaAEditar", JSON.stringify(reserva));
                window.location.href = "../index.html";
            });

            const btnEliminarReserva = document.createElement("button");
            btnEliminarReserva.textContent = "Eliminar";

            const btnDeshacerEliminacion = document.createElement("button");
            btnDeshacerEliminacion.textContent = "Deshacer";
            btnDeshacerEliminacion.style.display = "none";

            let timeoutEliminarReserva;

            btnEliminarReserva.addEventListener("click", () => {
                tarjeta.classList.add= ("eliminando");
                btnEliminarReserva.disabled = true;
                btnEditarReserva.disabled = true;
                btnDeshacerEliminacion.style.display = "inline";
                timeoutEliminarReserva = setTimeout(() => {
                    this.eliminarReserva(reserva.id);
                }, 5000);
            });

            btnDeshacerEliminacion.onclick = () => {
                if (timeoutEliminarReserva) {
                    clearTimeout(timeoutEliminarReserva);
                }
                this.render();
            };

            acciones.appendChild(btnEditarReserva); 
            acciones.appendChild(btnEliminarReserva);
            acciones.appendChild(btnDeshacerEliminacion);

            tarjeta.appendChild(acciones);

            this.lista.appendChild(tarjeta);
        });
    }
}