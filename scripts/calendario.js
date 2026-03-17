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
            this.lista.innerHTML = "<p>No hay reservas vigentes</p>";
            return;
        }

        reservasFiltradas
            .sort((a, b) => a.fechaHoraInicio.localeCompare(b.fechaHoraInicio))
            .forEach(reserva => {
                const li = document.createElement("li");
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
                span.innerHTML = "Eliminando...";
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

            li.appendChild(span); 
            li.appendChild(btnEditarReserva); 
            li.appendChild(btnEliminarReserva);
            li.appendChild(btnDeshacerEliminacion);

            this.lista.appendChild(li);
        });
    }
}